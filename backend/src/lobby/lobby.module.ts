import { Module, forwardRef } from '@nestjs/common';
import LobbyGateway from './lobby.gateway';
import { LobbyService } from './lobby.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerModule } from 'src/player/player.module';
import { GameModule } from 'src/game/game.module';

@Module({
    imports: [PlayerModule, forwardRef(()=>GameModule) ],
    providers: [LobbyGateway, LobbyService, PrismaService],
    exports: [LobbyGateway]
})
export class LobbyModule {}
