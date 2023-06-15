import $api from "../http";

export default class MatchService {
    static async getMatches(id: number) {
        try {
            return (await $api.get(`game/history/${id}`)).data
        }
        catch {
            return []
        }
    }
}