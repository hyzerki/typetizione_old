import IPlayer from "../interface/iPlayer";


export default class Player implements IPlayer{
    id: number;
    username: string;
    rating: string;
    constructor(id:number, username:string, rating:string) {
        this.id = id;
        this.username = username;
        this.rating = rating;
    }
}