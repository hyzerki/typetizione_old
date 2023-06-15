import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { PlayerService } from './player/player.service';
import { PrismaService } from './prisma/prisma.service';
import { GameGateway } from './game/game.gateway';
import LobbyGateway from './lobby/lobby.gateway';
import { LobbyService } from './lobby/lobby.service';
import { FriendModule } from './friend/friend.module';
import { FriendService } from './friend/friend.service';
import { LobbyModule } from './lobby/lobby.module';
import { GameModule } from './game/game.module';
import { TextModule } from './text/text.module';


@Module({
  imports: [
    AuthModule,
    PlayerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FriendModule,
    LobbyModule,
    GameModule,
    TextModule,
  ],
  providers: [PrismaService, PlayerService, FriendService],
})
export class AppModule {}
