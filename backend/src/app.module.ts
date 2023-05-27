import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AppGateway from './app/app.gateway';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { PlayerService } from './player/player.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    PlayerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [PrismaService, PlayerService, AppGateway],
})
export class AppModule {}
