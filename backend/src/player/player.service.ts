import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { player, Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { SignUpDto } from 'src/auth/dto/signUp.dto';
import PlayerResponse from './dto/player-response.dto';

@Injectable()
export class PlayerService {
  //todo inject lobby gateway here
  constructor(private prisma: PrismaService) { }

  async findOne(playerWhereUniqueInput: Prisma.playerWhereUniqueInput,): Promise<PlayerResponse | null> {
    return this.prisma.player.findUnique({ where: playerWhereUniqueInput, select: { username: true, rating: true, id: true } });
  }

  async registerPlayer(signUpDto: SignUpDto): Promise<player> {
    const salt: string = crypto.randomBytes(32).toString();
    const password: string = await argon2.hash(salt + signUpDto.password);
    return this.prisma.player.create({
      data: {
        username: signUpDto.username,
        password: Buffer.from(password),
        salt: Buffer.from(salt),
      },
    });
  }

  async updatePlayerUsername(request:any) {
    return this.prisma.player.update({where:{id:request.user.sub}, data:{username: request.body.username}}); 
  }

  async findFullPlayer(playerWhereUniqueInput: Prisma.playerWhereUniqueInput,): Promise<player | null> {
    return this.prisma.player.findUnique({ where: playerWhereUniqueInput });
  }

  async findFriendsOfPlayer(playerId: number): Promise<any> {
    return this.prisma.player.findUnique({
      where: {
        id: playerId
      }, select: {
        initiated_relations: {
          include: {
            related_player_two: {
              select: {
                id: true,
                username: true,
                rating: true,
              }
            }
          }
        },
        proposed_relations: {
          include: {
            related_player_one: {
              select: {
                id: true,
                username: true,
                rating: true,
              }
            }
          }
        }
      }
    });
  }

  //
  

}
