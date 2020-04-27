// This is where we define all SERVER actions
// For local single player games we can still use these actions but simply use a stub based off browser storage?

import { IGenericGame } from "./types";

export type CB<T = any> = (newValue: T) => void;
export type Get<ResponseType> = () => Promise<ResponseType>;
export type Post<PayloadType, ResponseType = void> = (payload: PayloadType) => Promise<ResponseType>;

export interface ICreateGameContract {
    /** Game you want to join */
    game: IGenericGame;

    /** Name you want to use */
    playerName: string;
}

export interface IJoinGameRequest {
    /** Game you want to join */
    gameId: string;

    /** Name you want to use */
    playerName: string;
}

export interface IJoinGameResponse {
    /** The reqeusted game */
    game: IGenericGame<any>;

    /** Your actual unique name with the # appended */
    playerName: string;
}

/** Generic API for all game lobbies (Games that have not started) */
export interface IGenericLobbyApi {
    /** Get a list of all games */
    GetAll: Get<{[gameId: number]: IGenericGame<any>}>;

    /** Get the game object by a specific game id */
    GetById: Post<string, IGenericGame<any>>;

    /** Create a game on the server. Response can be empty if the server doesn't change anything. */
    Create: Post<ICreateGameContract, ICreateGameContract>;

    /** Update a game on the server.
     *  This lets the host of the game change game settings and min/max players.
     *  @warn Only the host should be able to do this!
     */
    Update: Post<IGenericGame<any>>;

    /** Join a game using the game id
     *  @warn This should respect the MAX players
     */
    Join: Post<IJoinGameRequest, IJoinGameResponse>;

    // TODO: Handle players. E.G. Kick a player or allow a player to quit?
}

/** Generic API for all games that have started */
export interface IGenericPlayApi<T extends object = any> {
    /** Just passively get the latest game object. 
     * This can be empty if no change since last request
     * or request can be held until there is a new update. */
    Refresh: Get<IGenericGame<T>>;

    /** Get the game object by a specific game id.
     *  @warn You should only be able to do this if the nextToPlay is YOU!
     *  @warn You should always have to change the nextToPlay to be someone else!
     */
    Play: Post<IGenericGame<T>>;
}

export interface IGenericGameApi<T extends object = any>  {
    Lobby: IGenericLobbyApi;
    Play: IGenericPlayApi<T>;
}