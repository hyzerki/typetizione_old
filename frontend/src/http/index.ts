import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { setRecoil } from "recoil-nexus";
import { currentPlayerState, getPlayerFromToken } from "../state/currentPlayerState";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const $api = axios.create({ baseURL: API_BASE_URL });


$api.interceptors.request.use(
  config => {
    console.log("rR", config);
    if (!localStorage.getItem("access_token")) {
      return config;
    }


    //const newConfig = {
    //  [headers]: {},
    //  ...config,
    //};

    config.headers = <AxiosRequestHeaders>{
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };

    //newConfig.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
    return config;
  },
  e => Promise.reject(e)
);

$api.interceptors.response.use(
  r => r,
  async error => {
    if (error.response.status !== axios.HttpStatusCode.Unauthorized) {
      throw error;
    }
    if (!localStorage.getItem("refresh_token") || error.config.retry) {
      setRecoil(currentPlayerState, null);
      throw error;
    }
    
      // console.log("pre")
      
      // console.log("post", refreshRequest);
    
    const { data } = await await axios.post("/auth/refresh", {}, { baseURL: API_BASE_URL, headers: { Authorization: `Bearer ${localStorage.getItem("refresh_token")}` } });;
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    setRecoil(currentPlayerState, getPlayerFromToken());
    const newRequest = {  
      ...error.config,
      retry: true,
    };

    return $api(newRequest);
  }
);



export default $api;

















/*



export default class AxiosClient {

  client: AxiosInstance;
  accessToken: string | null;
  refreshToken: string | null;
  refreshRequest: any;


  constructor() {
    this.client = axios.create({ baseURL: API_BASE_URL });
    this.accessToken = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");
    this.refreshRequest = null;

    this.client.interceptors.request.use(
      config => {
        if (!this.accessToken) {
          return config;
        }

        const newConfig = {
          headers: {},
          ...config,
        };

        newConfig.headers.Authorization = `Bearer ${this.accessToken}`;
        return newConfig;
      },
      e => Promise.reject(e)
    );

    this.client.interceptors.response.use(
      r => r,
      async error => {
        if (
          !this.refreshToken ||
          error.response.status !== 401 ||
          error.config.retry
        ) {
          throw error;
        }

        if (!this.refreshRequest) {
          this.refreshRequest = await this.client.post("/auth/refresh", {
            refreshToken: this.refreshToken,
          });
        }
        const { data } = await this.refreshRequest;
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        const newRequest = {
          ...error.config,
          retry: true,
        };

        return this.client(newRequest);
      }
    );
  }
} */