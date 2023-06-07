import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import LobbyGateway from 'src/lobby/lobby.gateway';
import { LobbyModule } from 'src/lobby/lobby.module';

@Module({
  imports: [LobbyModule],
  providers: [FriendService,PrismaService, ],
  controllers: [FriendController]
})
export class FriendModule {}
