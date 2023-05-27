import { atom } from "recoil";

export const socketReadyState = atom<boolean>({
    key: "socketReady",
    default: false,
})