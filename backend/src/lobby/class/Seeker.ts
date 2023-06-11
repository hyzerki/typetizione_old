import Lobby from "../interface/Lobby";
import Player from "../interface/Player";
import LobbyGateway from "../lobby.gateway";

export default class Seeker implements Lobby {
    id: string;
    players: Player[];
    gameType: string;
    languages: string[];
    upperBound: number;
    lowerBound: number;
    boundUpdateInterval?: NodeJS.Timer = setInterval(() => {
        console.log(`New Bounds: ${this.upperBound}->${this.upperBound + 100}`);
        this.lowerBound -= 100;
        this.upperBound += 100;
        LobbyGateway.findMatch(this);
    }, 10000);

    constructor(id, players, gameType, languages, lowerBound, upperBound) {
        this.id = id;
        this.players = players;
        this.gameType = gameType;
        this.languages = languages;
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
    }
}