import Player from "./Player";

export default class Game{
    id:number;
    text_id:number;
    loadTimeout?: NodeJS.Timeout;
    whiteList: Map<number,Player> = new Map();
    gameStage: number = 1;
    finished: number = 0;
    constructor(id:number, text_id:number){
        this.id = id;
        this.text_id = text_id;
    }
}