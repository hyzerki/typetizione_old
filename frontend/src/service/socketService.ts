import { getRecoil, setRecoil } from "recoil-nexus";
import { io } from "socket.io-client";
import { currentPlayerState } from "../state/currentPlayerState";
import { websocketState } from "../state/websocketState";
import { lobbyState } from "../state/lobbyState";

export default class SocketService {
    static connect() {
        let currentPlayer = getRecoil(currentPlayerState);

        let socket = io(`${import.meta.env.VITE_API_BASE_URL}/lobby`,
            {
                query: {
                    player_id: currentPlayer.id,
                    username: currentPlayer.username
                },
                transports: ["websocket"]
            }
        );

        // function handlePartyChange(payload: any) {
        //     console.log("lobby changed")
        //     console.log("", payload)
        //     setRecoil(lobbyState, payload);
        // }
        // socket.on("lobby_changed", handlePartyChange);
        
        setRecoil(websocketState, socket);
    }

    static disconnect() {
        let socket = getRecoil(websocketState);
        socket.removeAllListeners();
        socket.disconnect();

        socket = io({ autoConnect: false });
        setRecoil(websocketState, socket);
    }
}