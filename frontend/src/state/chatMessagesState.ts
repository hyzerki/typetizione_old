import { atom } from "recoil";

export const chatMessagesState = atom({
    key: "chatMessages",
    default: new Array<any>()
});