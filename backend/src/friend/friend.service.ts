import { Injectable } from '@nestjs/common';
import LobbyGateway from 'src/lobby/lobby.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
    //todo вызывать invalidate_frienlist чтобы перезагрузить список друзей у затронутых записей
    constructor(private prisma: PrismaService, private lobbyGateway: LobbyGateway) { }

    async addPlayerToFriends(req: any) {
        if(req.body.id ===req.user.sub){
            return;
        }
        this.lobbyGateway.server.to(req.body.id.toString()).emit("invalidate_friendlist");
        return this.prisma.friend_relation.upsert({
            where: { friend_one_friend_two: { friend_one: req.body.id, friend_two: req.user.sub } },
            update: {},
            create: { friend_one: req.user.sub, friend_two: req.body.id }
        });
    }

    async acceptFriendRequest(req: any) {
        this.lobbyGateway.server.to(req.body.id.toString()).emit("invalidate_friendlist");
        return this.prisma.friend_relation.update({
            where: {
                friend_one_friend_two: {
                    friend_one: req.body.id, friend_two: req.user.sub
                }
            },
            data: {
                is_accepted: true,
            }
        });
    }

    async deleteFriendOrRequest(req: any) {
        this.lobbyGateway.server.to(req.body.id.toString()).emit("invalidate_friendlist");
        return this.prisma.friend_relation.deleteMany({
            where: {
                OR: [
                    { AND: [{ friend_one: req.user.sub }, { friend_two: req.body.id }] },
                    { AND: [{ friend_one: req.body.id }, { friend_two: req.user.sub }] },
                ],
            }
        });
    }
}
