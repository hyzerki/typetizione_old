import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { player, Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { SignUpDto } from 'src/auth/dto/signUp.dto';
import PlayerResponse from './dto/player-response.dto';

@Injectable()
export class PlayerService {
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

  async findFullPlayer(playerWhereUniqueInput: Prisma.playerWhereUniqueInput,): Promise<player | null> {
    return this.prisma.player.findUnique({ where: playerWhereUniqueInput });
  }


  async addPlayerToFriends(req: any) {
    return this.prisma.friend_relation.create({ data: { friend_one: req.user.sub, friend_two: req.body.id } });
  }

  async acceptFriendRequest(req: any) {
    return this.prisma.friend_relation.update({
      where: {
        friend_one_friend_two: {
          friend_one: req.user.sub, friend_two: req.body.id
        }
      },
      data: {
        is_accepted: true,
      }
    });
  }

  async deleteFriendOrRequest(req: any) {
    return this.prisma.friend_relation.deleteMany({
      where: {
        OR: [
          { AND: [{ friend_one: req.user.sub }, { friend_two: req.body.id }] },
          { AND: [{ friend_one: req.body.id }, { friend_two: req.user.sub }] },
        ],
      }
    });
  }

  //
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

}
