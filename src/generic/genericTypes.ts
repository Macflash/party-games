/** Generic base object for all players in games */
export interface IGenericPlayer {
    /** Names are unique. Each player name should be suffixed with the order they joined the room */
    name: string;
}

/** Generic base object for all games */
export interface IGenericGame<T extends object> {
    gameId: string;
    gameState: "InPublicLobby" | "InPrivateLobby" | "InGame";
    gameType: string;

    /** Any settings used for the specific game type */
    gameTypeSettings?: T;

    /** Next to play is the only one allowed to update the server 
     * When posting the next to play cannot be you! */
    nextToPlay: number;
    players: IGenericPlayer[];

    // These would need to be enforced at the server side if we support them
    minPlayers?: number;
    maxPlayers?: number;
}