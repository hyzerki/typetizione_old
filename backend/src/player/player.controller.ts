import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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

    @UseGuards(AuthGuard)
    @Get(":id/friends")
    getFriends(@Param() params: any){
        return this.playerService.findFriendsOfPlayer(parseInt(params.id));
    }

    @UseGuards(AuthGuard)
    @Put()
    updatePlayerUsername(@Req() req: any){
        return this.playerService.updatePlayerUsername(req);
    }

}
