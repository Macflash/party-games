import { ServerGameObject, IGenericGame } from "../generic/types";

/** Get the current player for the game */
export const isHost = (game: ServerGameObject, playerName: string) => game.players[0].name == playerName;
export const getPlayerIndex = (game: ServerGameObject, playerName: string) => game.players.findIndex(p => p.name == playerName)!;
export const getCurrentPlayerIndex = (game: ServerGameObject) => getPlayerIndex(game, game.nextToPlay!)!;
export const getCurrentPlayer = (game: ServerGameObject) => game.players[getCurrentPlayerIndex(game)];

/** Check whether it is your turn to play */
export const getIsYourTurn = (game: ServerGameObject, yourName: string) => game.nextToPlay == yourName;

/** Update to the next player. 
 *  Works for Clockwise rotation of play order */
export const IncrementNextToPlayer = (game: ServerGameObject) => {
    const index = getCurrentPlayerIndex(game);
    let nextToPlayIndex = (index + 1) % game.players.length;
    game.nextToPlay = game.players[nextToPlayIndex].name;
    return game;
}

export function getGameData<T extends object>(game:ServerGameObject<T>, initial: T = {} as any): T {
    return game.objectData as T || initial;
}

export function getYours<T>(game: ServerGameObject, yourName: string, items: T[]): T {
    const index = getPlayerIndex(game, yourName);
    return items[index];
}

export function setYours<T>(game: ServerGameObject, yourName: string, items: T[], newItem: T): T[] {
    const index = getPlayerIndex(game, yourName);
    items[index] = newItem;
    return [...items];
}

export function getCurrent<T>(game: ServerGameObject, items: T[]): T {
    const index = getCurrentPlayerIndex(game);
    return items[index];
}

export function setCurrent<T>(game: ServerGameObject, items: T[], newItem: T): T[] {
    const index = getCurrentPlayerIndex(game);
    items[index] = newItem;
    return [...items];
}

export function shouldPlayAi(game: ServerGameObject, yourName: string): boolean {
    // basically HOST is the one who plays all AI turns
    // so if current player is AI
    // and we are the HOST
    // we should play their turn
    if(getCurrentPlayer(game)?.isAI && isHost(game, yourName)){
        return true;
    }

    return false;
}