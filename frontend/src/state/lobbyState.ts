import { atom } from "recoil";

class Player {
    player_id: string = "";
    username: string = "";
}

class Lobby {
    id: string = "";
    players: Array<Player> = new Array();
}

export const lobbyState = atom<Lobby>({
    key: "lobbyState",
    default: new Lobby()
})