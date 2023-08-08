import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Prisma, game, game_type, player_game_stats } from '@prisma/client';
import { get } from 'http';
import Seeker from 'src/lobby/class/Seeker';
import { Server, Socket } from "Socket.IO";
import LobbyGateway from 'src/lobby/lobby.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => LobbyGateway))
        private lobbyGateway: LobbyGateway,
        @Inject(forwardRef(() => GameGateway))
        private gameGateway: GameGateway
    ) { }

   

    async createGame(seekers: Seeker[]) {
        console.log("🚀 ~ file: game.service.ts:17 ~ GameService ~ createGame ~ seekers:", seekers)
        console.log("BUHJRB", seekers[0].players)
        //определить какого типа будет предстоящая игра
        const gameType = seekers[0].gameType;
        //определить на каком языке будет предстоящая игра
        const languages = this.getLanguages(seekers);
        let language
        if (languages.length === 0) {
            console.log("ФИЛЬТР ЯЗЫКОВ РАБОТАЕТ НЕКОРРЕКТНО!\n", "ФИЛЬТР ЯЗЫКОВ РАБОТАЕТ НЕКОРРЕКТНО!\n", "ФИЛЬТР ЯЗЫКОВ РАБОТАЕТ НЕКОРРЕКТНО!\n");
            language = "russian";
        } else {
            language = languages[Math.floor(Math.random() * languages.length)];
        }

        //todo refactor to $queryRaw (select top 1 from texts where id = random())
        let texts = await this.prisma.text_to_type.findMany({
            where: {
                text_language: language
            },
            select: {
                id: true
            }
        });

        let textId = texts[Math.floor(Math.random() * texts.length)];

        // let players = seekers.map((seeker: Seeker) => { return seeker.players }).flat(3).map((player) => { return { player_id: +player.player_id } });
        let players = seekers.flatMap(s => s.players).map(p => { return { player_id: +p.player_id } });

        //создать игру и добавить туда pgs
        let game = await this.prisma.game.create({
            data: {
                type: game_type[gameType],
                text_id: textId.id,
                player_game_stats: {
                    createMany: {
                        data: players
                    }
                }
            }
        });

        this.gameGateway.addGame(game.id, textId.id, players);

        // раскидать всем инвайты в созданную игру
        seekers.forEach((seeker: Seeker) => {
            this.lobbyGateway.server.to(seeker.id).emit("game_found", game);
        })

        return game;
    }

    findOnePlayerGameStats(player_game_statsWhereUniqueInput: Prisma.player_game_statsWhereUniqueInput): Promise<player_game_stats> {
        return this.prisma.player_game_stats.findUnique({
            where: player_game_statsWhereUniqueInput,
            include: { game: true }
        });
    }

    findOneGame(gameWhereUniqueInput: Prisma.gameWhereUniqueInput): Promise<game> {
        return this.prisma.game.findUnique({
            where: gameWhereUniqueInput,
        });
    }

    getGameHistoryByPlayerId(player_id: number) {
        return this.prisma.player_game_stats.findMany({
            include: { game: { include: { text_to_type: { select: { text_language: true } } } } },
            where: { player_id },
            orderBy: { game: { date_time: 'desc' } }
        })
    }

    getLanguages(seekers: Seeker[]): string[] {
        const seekArr = [...seekers];
        let firstSeeker = seekArr.shift();
        if (seekArr.length === 0) {
            return firstSeeker.languages;
        }
        return firstSeeker.languages.filter(lang => this.getLanguages(seekArr).includes(lang));
    }
}
