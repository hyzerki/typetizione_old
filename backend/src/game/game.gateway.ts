import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { query } from 'express';

interface Player{
  id: number;
  username: string;
}

interface Game{
  id: number;
  type: string;
  
  
}


@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  afterInit(server: any) {
    //throw new Error('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    
  }
  handleDisconnect(client: any) {
    //throw new Error('Method not implemented.');
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
