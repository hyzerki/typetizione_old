import AxiosClient from "../helpers/axiosClient";
import Player from "../model/player";



export async function login(username:string, password:string):Promise<Player> {
        const {data} = await AxiosClient.post("/auth/login",{username,password});
        let {access_token, refresh_token} = data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        let player:Player = data.player;
        localStorage.setItem("player_id", player.id.toString());
        return player;
}