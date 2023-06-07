import axios, { AxiosResponse } from "axios";
import { setRecoil } from "recoil-nexus";
import $api from "../http";
import Player from "../model/player";
import AuthResponse from "../model/response/AuthResponse";
import { currentPlayerState, getPlayerFromToken } from "../state/currentPlayerState";
import SocketService from "./socketService";


export default class AuthService {
    static async login(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        let response = await $api.post<AuthResponse>("/auth/login", { username, password });
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("access_token", response.data.access_token);
        setRecoil(currentPlayerState, getPlayerFromToken());
        SocketService.connect();
        return response;
    }

    static async register(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        let response = await $api.post<AuthResponse>("/auth/register", { username, password });
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("access_token", response.data.access_token);
        setRecoil(currentPlayerState, getPlayerFromToken());
        SocketService.connect();
        return response;
    }

    static async logout(): Promise<AxiosResponse> {
        setRecoil(currentPlayerState, null);
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token");
        SocketService.disconnect();
        return await $api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${localStorage.getItem("refresh_token")}` } });
    }

    static async checkAuth(): Promise<boolean> {
        try {
            let response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("refresh_token")}` } });
            localStorage.setItem("refresh_token", response.data.refresh_token);
            localStorage.setItem("access_token", response.data.access_token);
            setRecoil(currentPlayerState, getPlayerFromToken());
            return true;
        } catch {
            setRecoil(currentPlayerState, null);
            SocketService.disconnect();
            return false;
        }

    }
}
