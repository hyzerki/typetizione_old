import { atom } from "recoil";

export const partyInvitesState = atom({
    key: "partyInvites", 
    default: new Array<any>()
})