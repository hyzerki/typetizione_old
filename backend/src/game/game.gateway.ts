import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "Socket.IO";
import { query } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PlayerService } from 'src/player/player.service';
import { GameService } from './game.service';
import { Inject, forwardRef } from '@nestjs/common';
import { game, game_status, player_status } from '@prisma/client';
import Game from './class/Game';
import Player from './class/Player';
import { PrismaService } from 'src/prisma/prisma.service';

const WAIT_TIME = 10000;


@WebSocketGateway({
  cors: { origin: "*" },
  serveClient: false,
  namespace: "playgame",
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private authService: AuthService,
    private playerService: PlayerService,
    @Inject(forwardRef(() => GameService))
    private gameService: GameService,
    private prisma: PrismaService
  ) { }

  @WebSocketServer()
  server: Server;

  games: Map<number, Game> = new Map();

  addGame(gameId: number, textId: number, players: any[]) {
    this.games.set(gameId, new Game(gameId, textId));
    players.map(p => this.games.get(gameId).players.set(p.player_id, new Player(p.player_id)));
    let loadTime = Date.now() + WAIT_TIME;
    this.games.get(gameId).whenStopWait = loadTime; //примерное время истечения ожидания игроков

    this.games.get(gameId).loadTimeout = setTimeout(async () => {
      let game = this.games.get(gameId);
      if ([...game.players.values()].some(p => !p.isConnected)) {
        /*логика отмены игры
        игрокам, которые не подключились даёт -25 и статус
          в бд ничего не меняется ведь изначально у игры статус not_started
          а у игроков not connected
          
          соответственно нужно просто её удалить из массива games
          и отключить остальных игроков  
        */

        //тут раздаём уёбкам по -25
        game.players.forEach(async p => {
          if (!p.isConnected) {
            await this.prisma.player_game_stats.update({
              where: {
                game_id_player_id: { game_id: gameId, player_id: p.id }
              },
              data: {
                rating_gain: -25,
                player: {
                  update: {
                    rating: { decrement: 25 }
                  }
                }
              }
            })
          }
        });


        // отослать всем, что по истечению времени игра не может начаться (отключение уже на их совести чтобы можно было рассмотреть, кто не подключился)
        this.server.to(gameId.toString()).emit("game_wont_start", game.players);
        this.games.delete(gameId);
      }

    }, loadTime - Date.now());
  }


  async checkIfGameCanRun(gameId: number) {
    let game = this.games.get(gameId);
    if (!game) { return; }

    if (![...game.players.values()].every(p => p.isConnected)) {
      return;
    }

    if (!!game.loadTimeout) {
      clearTimeout(game.loadTimeout);
    }
    game.isStarted = true;
    let text_to_type = await this.prisma.text_to_type.findUnique({ where: { id: game.text_id } });
    this.server.to(gameId.toString()).emit("game_start", text_to_type);

    game.afkTimeout = setTimeout(() => {
      game.isFinished = true;
      game.players.forEach(async p => {
        if (p.isConnected && !p.isFinished) {
          await this.prisma.player_game_stats.update({
            where: {
              game_id_player_id: { game_id: gameId, player_id: p.id }
            },
            data: {
              status: player_status.afk,
              rating_gain: -25,
              player: {
                update: {
                  rating: { decrement: 25 }
                }
              }
            }
          })
        }
        this.server.to(gameId.toString()).disconnectSockets();
      });
      this.games.delete(gameId);
    }, 600000);

  }

  //проверяет все ли игроки закончили и если да, то завершает игру (без таймаута в 10 минут для афк)
  checkIfGameCanBeFinished(gameId: number) {
    let game = this.games.get(gameId);
    if (!game) { return; }

    if (![...game.players.values()].every(p => p.isFinished)) {
      return;
    }
    //todo завершение игры удаление из games
    game.isFinished = true;
    clearTimeout(game.afkTimeout);
    this.games.delete(gameId);
  }



  afterInit(server: any) {
    //throw new Error('Method not implemented.');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log("🚀 ~ file: game.gateway.ts:93 ~ GameGateway ~ handleConnection ~ client:", client)
    // if (!client.handshake.headers.authorization) {
    //   console.log("🚀 ~ file: game.gateway.ts:95 ~ GameGateway ~ handleConnection ~ authorization:", client.handshake.headers.authorization)

    //   console.log("GAME: 0");
    //   client.data.disconnectedByServer = true;
    //   client.disconnect();
    //   return;
    // }

    // let token  = client.handshake.query.token as string;
    // const payload = await this.authService.verifyToken(token);
    // if(!payload) {
    //   console.log("Не валид");
    //   client.data.disconnectedByServer = true;
    //   client.disconnect();
    // }
    //зачекать есть ли такой игрок в pgs


    const gameId = parseInt(client.handshake.query.game_id as string);
    const playerId = parseInt(client.handshake.query.player_id as string);
    let game = this.games.get(gameId);
    if (!game) {
      client.data.disconnectedByServer = true;
      console.log("GAME: Игра не существует");
      client.disconnect();
      return;
    }
    if (game.isStarted) {
      client.data.disconnectedByServer = true;
      console.log("GAME: Игра уже началась");
      client.disconnect();
      return;
    }

    let whitelistEntry = game.players.get(playerId);
    if (!whitelistEntry) {
      client.data.disconnectedByServer = true;
      console.log("GAME: игрок не найден в запрашиваемой игре");
      client.disconnect();
      return;
    }



    client.join(gameId.toString());
    whitelistEntry.isConnected = true;
    client.data.whitelistEntry = whitelistEntry;
    client.data.gameId = gameId;
    client.data.id = playerId;
    //todo синхронизировать игрока и отпраить ему время конца ожидания (loadTimeout)
    client.emit("sync", { sent: Date.now(), waitTill: game.whenStopWait });
    this.server.to(gameId.toString()).emit("player_connected", [...game.players.values()]);
    this.checkIfGameCanRun(gameId);
    console.log(`GAME: Игрок ${playerId} успешно подключился к игре`);

  }



  async handleDisconnect(client: any) {
    if (client.data.isFinished) {
      return;
    }
    if (client.data.disconnectedByServer) {
      return;
    }
    client.data.whitelistEntry.isConnected = false;
    let game = this.games.get(client.data.gameId);
    if (!game) {
      return;
    }
    this.server.to(game.id.toString()).emit("player_disconnected",  [...game.players.values()]);
    if (game.isStarted) {
      await this.prisma.player_game_stats.update({
        where: {
          game_id_player_id: { game_id: game.id, player_id: client.data.id }
        },
        data: {
          status: player_status.left,
          rating_gain: -25,
          player: {
            update: {
              rating: { decrement: 25 }
            }
          }
        }
      })
    }
  }

  @SubscribeMessage("text_finished")
  async handleFinish(client: Socket, payload: any) {
    //todo взять данные о вводе с клиента (payload), высчитать wpm cpm
    let game = this.games.get(client.data.gameId);
    if (!game) {
      client.data.disconnectedByServer = true;
      client.disconnect();
      return;
    }
    if (game.isStarted) {
      let place = ++game.finished;
      await this.prisma.player_game_stats.update({
        where: {
          game_id_player_id: { game_id: game.id, player_id: client.data.id }
        },
        data: {
          status: player_status.finished,
          rating_gain: place <= 2 ? +25 : -25,
          player: {
            update: {
              rating: place <= 2 ? { increment: 25 } : { decrement: 25 }
            }
          }
        }
      })
      client.data.isFinished = true;
      client.emit("result", { place: place });
    }
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
}
