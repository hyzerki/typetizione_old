import Player from "./Player";

export default class Game{
    id:number;
    text_id:number;
    loadTimeout?: NodeJS.Timeout;
    afkTimeout?: NodeJS.Timeout;
    players: Map<number,Player> = new Map();
    isStarted: boolean = false;
    isFinished: boolean = false;
    gameStage: number = 1;
    finished: number = 0;
    whenStopWait:number = 0;
    constructor(id:number, text_id:number){
        this.id = id;
        this.text_id = text_id;
    }
}