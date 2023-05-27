import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('player')
export class PlayerController {
    constructor(private playerService:PlayerService){}
    
    @Get(":id")
    getOne(@Param() params: any){
        return this.playerService.findOne({id: parseInt(params.id)});
    }

    @Get(":id/friends")
    getFriends(@Param() params: any){
        return this.playerService.findFriendsOfPlayer(parseInt(params.id));
    }

    @UseGuards(AuthGuard)
    @Post("friends/add")
    addFriend(@Req() req){
        return this.playerService.addPlayerToFriends(req);
    }

    @UseGuards(AuthGuard)
    @Post("friends/accept")
    acceptFriend(@Req() req){
        return this.playerService.acceptFriendRequest(req);
    }
}
