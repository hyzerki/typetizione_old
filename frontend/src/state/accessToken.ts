import { atom } from "recoil";


const accessTokenState = atom({
    key:"accessToken",
    default: localStorage.getItem("access_token"),  
})

export { accessTokenState }