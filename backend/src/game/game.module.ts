import { Module, forwardRef } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LobbyModule } from 'src/lobby/lobby.module';
import { AuthModule } from 'src/auth/auth.module';
import { PlayerModule } from 'src/player/player.module';
import { GameController } from './game.controller';

@Module({
    imports: [forwardRef(()=>LobbyModule), AuthModule, PlayerModule],
    providers: [GameGateway, GameService, PrismaService],
    exports: [GameGateway, GameService,],
    controllers: [GameController]
})
export class GameModule {
    
 }
