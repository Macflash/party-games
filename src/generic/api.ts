// This is where we define all SERVER actions
// For local single player games we can still use these actions but simply use a stub based off browser storage?

import { IGenericGame } from "./genericTypes";

export type Get<ResponseType> = () => Promise<ResponseType>;
export type Post<PayloadType, ResponseType = never> = (payload: PayloadType) => Promise<ResponseType>;

/** Generic API for all game lobbies (Games that have not started) */
export interface IGenericLobbyApi {
    /** Get a list of all games */
    GetGames: Get<IGenericGame<any>[]>;

    /** Get the game object by a specific game id */
    GetGameById: Post<string, IGenericGame<any>>;

    /** Create a game on the server. Response can be empty if the server doesn't change anything. */
    CreateGame: Post<IGenericGame<any>>;

    /** Join a game using the game id */
    JoinGame: Post<string, IGenericGame<any>>;
}

/** Generic API for all games that have started */
export interface IGenericGameApi {
    /** Just passively get the latest game object. 
     * This can be empty if no change since last request
     * or request can be held until there is a new update. */
    GetLatestGameStatus: Get<IGenericGame<any>[]>;

    /** Get the game object by a specific game id */
    PostYourTurn: Post<IGenericGame<any>>;
}