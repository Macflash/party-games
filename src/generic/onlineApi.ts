import { IGenericGameApi, ICreateGameContract, IJoinGameResponse } from "./apis";
import axios from "axios";
import { ServerGameObject } from "./types";

function encodeObjectData(game: ServerGameObject): ServerGameObject {
    return { ...game, data: game.objectData ? JSON.stringify(game.objectData) : "" }
}

function decodeObjectData(game: ServerGameObject): ServerGameObject {
    return { ...game, objectData: game.data ? JSON.parse(game.data) : undefined }
}


// this can be reused by getbyid too! and probably Refresh
const handleSingleGameGet = (r: { data: ServerGameObject }) => decodeObjectData(r.data);
const handleCreateRequest = (request: ICreateGameContract) => ({ ...request, game: encodeObjectData(request.game) });
const handleCreateAndJoinResponse = (r: { data: ICreateGameContract | IJoinGameResponse }) => ({ ...r.data, game: decodeObjectData(r.data.game) });
const handleCheckIfInGame = (r: { data: ICreateGameContract | IJoinGameResponse | null }) => (r.data ? { ...r.data, game: decodeObjectData(r.data.game) } : null);

export const OnlineApi: IGenericGameApi = {
    Lobby: {
        GetAll: () => axios.get("/Games/GetGames").then(r => r.data),
        GetCurrentGame: () => axios.get<ServerGameObject>("/Games/GetCurrentGame").then(handleSingleGameGet),
        CheckIfInGame: () => axios.get<IJoinGameResponse | null>("/Games/Refresh").then(handleCheckIfInGame),
        Create: request => axios.post<ICreateGameContract>("/Games/Create", handleCreateRequest(request)).then(handleCreateAndJoinResponse),
        Join: request => axios.post<IJoinGameResponse>("/Games/Join", request).then(handleCreateAndJoinResponse),
        Update: game => axios.post("/Games/Update", encodeObjectData(game)),
    },
    Play: {

    }
} as IGenericGameApi;