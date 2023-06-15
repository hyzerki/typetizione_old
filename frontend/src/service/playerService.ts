import { AxiosResponse } from "axios";
import $api from "../http";
import Player from "../model/player";

export default class PlayerService {
    static async getPlayerById(id: number): Promise<Player | null> {
        try {
            const player: Player = (await $api.get(`/player/${id}`)).data;
            return player;
        } catch (e: any) {
            return null;
        }
    }

    static async getPlayerFriends(id: string): Promise<any> {
        try {
            console.log("getFriends")
            const friends = (await $api.get(`/player/${id}/friends`)).data;
            return friends;
        } catch {
            return null;
        }
    }

    static async getPlayerStats(id: string) {
        try {
            const stats = (await $api.get(`/player/${id}/stats`)).data;
            return stats;
        } catch {
            return null;
        }
    }

    static async updatePlayer(username: string): Promise<AxiosResponse<any>> {
        
        return await $api.put("/player", { username });
    }

    static async getRatingLeaderBoard() {
        try {
            const board = (await $api.get(`/player/lb/rating`)).data;
            return board;
        } catch {
            return [];
        }
    }

    static async getCpmLeaderBoard() {
        try {
            const board = (await $api.get(`/player/lb/cpm`)).data;
            return board;
        } catch {
            return [];
        }
    }
}

