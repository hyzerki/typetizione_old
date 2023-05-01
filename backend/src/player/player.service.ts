import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { player, Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    playerWhereUniqueInput: Prisma.playerWhereUniqueInput,
  ): Promise<player | null> {
    return this.prisma.player.findUnique({ where: playerWhereUniqueInput });
  }

  async registerPlayer(player: Prisma.playerCreateInput): Promise<player> {
    const salt: string = crypto.randomBytes(32).toString();
    const password: string = await argon2.hash(salt + player.password);
    player.password = password;
    player.salt = salt;
    return this.prisma.player.create({ data: player });
  }
}
