import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerController } from './player.controller';

@Module({
  providers: [PlayerService, PrismaService],
  exports: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
