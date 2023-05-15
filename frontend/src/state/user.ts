import { atom } from "recoil";


const userState = atom({
    key:"user",
    default: localStorage.getItem("user"),  
})

export { userState }