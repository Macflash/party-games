import { IGenericGameApi } from "./apis";
import axios from "axios";
import { ServerGameObject } from "./types";

export const OnlineApi: IGenericGameApi = {
    Lobby: {
        GetAll: () => axios.get("/Games/GetGames").then(r => r.data),
        Create: request => axios.post("/Games/Create", request).then(r => r.data),
        Join: request => axios.post("/Games/Join", request).then(r => r.data),
    },
    Play: {

    }
} as IGenericGameApi;