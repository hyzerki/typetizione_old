import $api from "../http";

export default class FriendsService {

    static async  createFriendRequest(player_id: number) {
        return $api.post("/friend/add", { id: player_id },{});
    }

    static async  acceptFriendRequest(player_id: number) {
        return $api.post("/friend/accept", { id: player_id });
    }

    static async  deleteFriendOrRequest(player_id: number) {
        return await $api.post("/friend/delete", { id: player_id });
    }
}