import $api from "../http";


export default class TextService{
    static async getRandomText():Promise<any> {
        try {
            const text = (await $api.get(`/text/random`)).data[0].text;
            return text;
        }catch(e:any){
            return "";
        } 
    }
}