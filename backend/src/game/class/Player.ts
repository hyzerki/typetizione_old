export default class Player{
    id:number;
    isConnected:boolean = false;
    isFinished: boolean = false;
    constructor(id: number){
        this.id = id;
    }
}