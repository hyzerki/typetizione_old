import $api from "../http";
import Player from "../model/player";

export default class PlayerService {
    static async getPlayerById(id:number):Promise<Player|null> {
        try {
            const player:Player =  (await $api.get(`/player/${id}`)).data;
            return player;
        }catch(e:any){
            return null;
        } 
    }

    static async getPlayerFriends(id:string):Promise<any> {
        try {
            const friends = (await $api.get(`/player/${id}/friends`)).data;
            return friends;
        }catch{
            return null;
        }
    }

}

