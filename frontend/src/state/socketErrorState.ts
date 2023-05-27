import { atom } from "recoil";

export const socketErrorState = atom<boolean>({
    key: "socketError",
    default: false,
})