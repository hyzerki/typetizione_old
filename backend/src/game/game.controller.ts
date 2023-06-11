import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {}
    
    @Get(":id")
    getGameById(@Param() params: any){
        this.gameService.findOneGame({id: +params.id})
    }

    @Get(":id/player/:playerId")
    getPlayerGameStatsById(@Param() params: any){
        this.gameService.findOnePlayerGameStats({game_id_player_id:{game_id:+params.id, player_id: +params.playerId}})
    }
}
