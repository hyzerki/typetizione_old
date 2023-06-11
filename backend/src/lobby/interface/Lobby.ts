import Player from "./Player";

export default interface Lobby {
    id: string;
    players: Array<Player>;
}