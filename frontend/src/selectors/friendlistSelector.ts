import { selector } from "recoil";
import playerService from "../service/playerService";
import { currentPlayerState } from "../state/currentPlayerState";

export const friendlistSelector = selector({
    key: "friendlist",
    get:async ({get}) => {
        if(get(currentPlayerState)){
            return await playerService.getPlayerFriends(get(currentPlayerState).id);
        }
        return null;
    }
});