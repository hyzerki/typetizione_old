import { Module } from '@nestjs/common';
import LobbyGateway from './lobby.gateway';
import { LobbyService } from './lobby.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    providers: [LobbyGateway, LobbyService, PrismaService],
    exports: [LobbyGateway]
})
export class LobbyModule {}
