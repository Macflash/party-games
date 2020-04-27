/** Generic base object for all players in games */
export interface IGenericPlayer {
    /** Names are unique. Each player name should be suffixed with the order they joined the room */
    name: string;

    /** Marks a player as AI */
    isAI?: boolean;
}

/** Generic base object for all games */
export interface IGenericGame<T extends object = any> {
    type: string;
    typeSettings?: T;
}

export interface ServerGameObject<T extends object = any> {
    gameId: string;
    name: string;
    state: "InPublicLobby" | "InPrivateLobby" | "InGame" | "GameOver"; 
    players: IGenericPlayer[];
    maxPlayers?: number;
    nextToPlay?: string;

    /** The data blob for the game */
    data: string;
    objectData?: IGenericGame<T>;
}

//TODO how to do AI players? 
// MAYBE mark them as AI and have them run on the HOST's machine?