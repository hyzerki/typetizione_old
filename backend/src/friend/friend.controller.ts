import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
//import { AuthGuard } from '@nestjs/passport';
import { FriendService } from './friend.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('friend')
export class FriendController {

    constructor(private friendService: FriendService) {}

    @UseGuards(AuthGuard)
    @Post("add")
    addFriend(@Req() req){
        return this.friendService.addPlayerToFriends(req);
    }

    @UseGuards(AuthGuard)
    @Post("accept")
    acceptFriend(@Req() req){
        return this.friendService.acceptFriendRequest(req);
    }

    @UseGuards(AuthGuard)
    @Post("delete")
    deleteFriend(@Req() req){
        return this.friendService.deleteFriendOrRequest(req);
    }
}
