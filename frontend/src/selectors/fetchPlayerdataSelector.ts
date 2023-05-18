import { selector } from "recoil";
import playerService from "../service/playerService";
import { currentPlayerState } from "../state/currentPlayerState";

export const fetchPlayerDataSelector = selector({
    key: "fetchPlayerData",
    get:async ({get}) => {
        if(get(currentPlayerState)){
            return await playerService.getPlayerById(get(currentPlayerState)?.id);
        }
        return null;
    }
});