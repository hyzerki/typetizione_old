import { selector } from "recoil";
import { currentPlayerState } from "../state/currentPlayerState";
import MatchService from "../service/matchService";


export const recentMatchesSelector = selector({
    key: "recentMatchesSelector",
    get: async ({ get }) => {
        if (get(currentPlayerState)) {
            return (await MatchService.getMatches(get(currentPlayerState).id)).slice(0, 10);
        }
        return null;
    }
});