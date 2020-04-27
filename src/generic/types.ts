/** Generic base object for all players in games */
export interface IGenericPlayer {
    /** Names are unique. Each player name should be suffixed with the order they joined the room */
    name: string;

    /** Marks a player as AI */
    isAI?: boolean;
}

/** Generic base object for all games */
export interface IGenericGame<T extends object = any> {
    id: string; // empty at first
    name: string; 
    state: "InPublicLobby" | "InPrivateLobby" | "InGame";
    type: string;

    /** Any settings used for the specific game type */
    typeSettings?: T;

    /** Name of the player who can play next */
    nextToPlay: string;
    players: IGenericPlayer[];

    // These would need to be enforced at the server side if we support them
    maxPlayers?: number;
}

//TODO how to do AI players? 
// MAYBE mark them as AI and have them run on the HOST's machine?