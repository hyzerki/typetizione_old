import { atom } from "recoil";

export const isGameSearchActiveState = atom<boolean>({
    key:"isGameSearchActiveState",
    default: false,
});