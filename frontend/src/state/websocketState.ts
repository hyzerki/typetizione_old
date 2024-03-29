import { atom } from "recoil";
import { getRecoil } from "recoil-nexus";
import { Socket, io } from "socket.io-client";
import { currentPlayerState } from "./currentPlayerState";

let initstate = io();
const websocketState = atom<Socket>({
    key: "websocketState",
    default: initstate,
    dangerouslyAllowMutability: true,
})

function getDataFromCurrentPlayer() {
    let currentPlayer = getRecoil(currentPlayerState);
    let { id, username } = currentPlayer;
    return { id, username };
}

function isAuth() {
    let currentPlayer = getRecoil(currentPlayerState);
    return !!currentPlayer;
}

export { websocketState };