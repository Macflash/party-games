import { IGenericGameApi, ICreateGameContract, IJoinGameResponse } from "./apis";
import axios from "axios";
import { ServerGameObject } from "./types";

function encodeObjectData(game: ServerGameObject): ServerGameObject {
    return { ...game, data: JSON.stringify(game.objectData) }
}

function decodeObjectData(game: ServerGameObject): ServerGameObject {
    return { ...game, objectData: JSON.parse(game.data) }
}

const handleCreateRequest = (request: ICreateGameContract) => ({ ...request, game: encodeObjectData(request.game) });
const handleCreateAndJoinResponse = (r: { data: ICreateGameContract | IJoinGameResponse }) => ({ ...r.data, game: decodeObjectData(r.data.game) });

export const OnlineApi: IGenericGameApi = {
    Lobby: {
        GetAll: () => axios.get("/Games/GetGames").then(r => r.data),
        Create: request => axios.post<ICreateGameContract>("/Games/Create", handleCreateRequest(request)).then(handleCreateAndJoinResponse),
        Join: request => axios.post<IJoinGameResponse>("/Games/Join", request).then(handleCreateAndJoinResponse),
    },
    Play: {

    }
} as IGenericGameApi;