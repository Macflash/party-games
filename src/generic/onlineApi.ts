import { IGenericGameApi } from "./apis";
import { IGenericGame } from "./types";
import axios from "axios";

export const OnlineApi: IGenericGameApi = {
    Lobby: {
        GetAll: () => axios.get("/Games/GetGames").then(r => r.data),
        Create: newGame => axios.post("/Games/Create", newGame).then(r => r.data),
    },
    Play: {

    }
} as IGenericGameApi;