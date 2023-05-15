import { atom } from "recoil";


const refreshTokenState = atom({
    key:"refreshToken",
    default: localStorage.getItem("refresh_token"),  
})

export { refreshTokenState }