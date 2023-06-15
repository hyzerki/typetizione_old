import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TextService, PrismaService],
  controllers: [TextController]
})
export class TextModule { }
