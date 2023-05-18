import jwtDecode, { InvalidTokenError } from "jwt-decode";
import { atom } from "recoil";
import IPlayer from "../interface/iPlayer";

const currentPlayerState = atom({
    key: "currentPlayer",
    default: getPlayerFromToken(),
})

function getPlayerFromToken() : any|null {
    try {
        let payload: any = jwtDecode(localStorage.getItem("refresh_token")!);
        return { id: payload.sub, username: payload.username };
    } catch (e) {
        return null;
    }
}

export {currentPlayerState, getPlayerFromToken};
