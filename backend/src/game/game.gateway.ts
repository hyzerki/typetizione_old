import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "Socket.IO";
import { query } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PlayerService } from 'src/player/player.service';
import { GameService } from './game.service';
import { Inject, forwardRef } from '@nestjs/common';
import { game, game_status } from '@prisma/client';
import Game from './class/Game';
import Player from './class/Player';
import { PrismaService } from 'src/prisma/prisma.service';




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

  games: Map<number, Game> = new Map();

  addGame(gameId: number, textId: number, players: any[]) {
    this.games.set(gameId, new Game(gameId, textId));
    players.map(p => this.games.get(gameId).whiteList.set(p.player_id, new Player(p.player_id)));
    this.games.get(gameId).loadTimeout = setTimeout(async () => {
      this.games.get(gameId).whiteList.forEach(async p => {
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
      this.games.get(gameId).gameStage = 2;
      let text_to_type = await this.prisma.text_to_type.findUnique({ where: { id: textId } });
      this.server.to(gameId.toString()).emit("game_start", text_to_type);

      setTimeout(() => {
        this.games.get(gameId).gameStage = 3;
        this.games.get(gameId).whiteList.forEach(async p => {
          if (p.isConnected) {
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
          this.server.to(gameId.toString()).disconnectSockets();
        });
        this.games.delete(gameId);
      }, 600000)


    }, 10000);
  }

  @WebSocketServer()
  server: Server;

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
      console.log("GAME: 1");
      client.disconnect();
      return;
    }
    if (game.gameStage > 1) {
      client.data.disconnectedByServer = true;
      console.log("GAME: 2");
      client.disconnect();
      return;
    }

    console.log("🚀 ~ file: game.gateway.ts:130 ~ GameGateway ~ handleConnection ~ game.whiteList:", game.whiteList)
    let whitelistEntry = game.whiteList.get(playerId);
    if (!whitelistEntry) {
      client.data.disconnectedByServer = true;
      console.log("GAME: 3");
      client.disconnect();
      return;
    }

    whitelistEntry.isConnected = true;
    client.data.whitelistEntry = whitelistEntry;
    client.data.gameId = gameId;
    client.data.id = playerId;
    client.join(gameId.toString());
    console.log("GAME: 4");
    //todo доделывать дальше логику

  }

  async handleDisconnect(client: any) {
    if (client.data.disconnectedByServer) {
      return;
    }
    client.data.whitelistEntry.isConnected = false;
    let game = this.games.get(client.data.gameId);
    if (!game) {
      return;
    }
    if (game.gameStage === 2) {
      await this.prisma.player_game_stats.update({
        where: {
          game_id_player_id: { game_id: game.id, player_id: client.data.id }
        },
        data: {
          game_status: game_status.left,
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
//fix исправить ранний лив)
  @SubscribeMessage("text_finished")
  async handleFinish(client: Socket, payload: any) {
    let game = this.games.get(client.data.gameId);
    if (!game) {
      client.data.disconnectedByServer = true;
      client.disconnect();
      return;
    }
    if (game.gameStage === 2) {
      let place = ++game.finished;
      await this.prisma.player_game_stats.update({
        where: {
          game_id_player_id: { game_id: game.id, player_id: client.data.id }
        },
        data: {
          game_status: game_status.finished,
          rating_gain: place <= 2 ? +25 : -25,
          player: {
            update: {
              rating: place <= 2 ? { increment: 25 } : { decrement: 25 }
            }
          }
        }
      })
      client.emit("result", { place: place });
    }
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
}
