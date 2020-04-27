import { IGenericGameApi, ICreateGameContract } from "./apis";
import axios from "axios";
import { ServerGameObject } from "./types";

function encodeObjectData(game: ServerGameObject):ServerGameObject {
    return {...game, data: JSON.stringify(game.objectData)}
}

function decodeData(game: ServerGameObject):ServerGameObject {
    return {...game, objectData: JSON.parse(game.data)}
}

export const OnlineApi: IGenericGameApi = {
    Lobby: {
        GetAll: () => axios.get("/Games/GetGames").then(r => r.data),
        Create: request => axios.post<ICreateGameContract>("/Games/Create", {...request, game:encodeObjectData(request.game) }).then(r => ({...r.data, game: decodeData(r.data.game)})),
        Join: request => axios.post("/Games/Join", request).then(r => r.data),
    },
    Play: {

    }
} as IGenericGameApi;