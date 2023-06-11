import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "Socket.IO";
import { query } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { PlayerService } from 'src/player/player.service';
import { GameService } from './game.service';

interface Player {
  id: number;
  username: string;
}

interface Game {
  id: number;
  type: string;


}


@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private authService: AuthService, private playerService: PlayerService, private gameService: GameService) { }

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    //throw new Error('Method not implemented.');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    if (!client.handshake.headers.authorization) {
      client.disconnect(true);
      return;
    }
    const [type, token] = client.handshake.headers.authorization.split(' ') ?? [];
    const payload = await this.authService.verifyToken(token);
    //зачекать есть ли такой игрок в pgs
    const gameId = client.handshake.query.id;
    let pgs = null;
    try {
      //проверка есть ли игрок в списке данной игры
      pgs = await this.gameService.findOnePlayerGameStats({
        game_id_player_id: {
          game_id: +gameId,
          player_id: +payload.sub
        }
      });
    }
    catch {
      client.disconnect();
    }
    //todo доделывать дальше логику
  }

  handleDisconnect(client: any) {
    //throw new Error('Method not implemented.');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
