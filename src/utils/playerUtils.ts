import { set, get } from "lodash";
import { ServerGameObject, IGenericGame } from "../generic/types";
import { CB } from "../generic/apis";
import React from "react";

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

export function getGameData<T extends object>(game: ServerGameObject<T>, initial: T = {} as any): T {
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
    if (getCurrentPlayer(game)?.isAI && isHost(game, yourName)) {
        return true;
    }

    return false;
}

export interface IGameComponentProps {
    game: ServerGameObject,
    yourName: string,
    isYourTurn: boolean,
    updateGame: CB<ServerGameObject>,
} 

export const createUtils = (props: IGameComponentProps) => {
    const {game, yourName, updateGame} = props;

    // init next to play if not set
    game.nextToPlay = game.nextToPlay ?? game.players[0].name;

    const globalPath = `objectData.global.`;
    const playerPath = (name: string) => `objectData.playerData[${name}].`;
    const yourPath = playerPath(yourName);

    // Get and set GLOBAL data
    function setGlobal<T>(path: string, newValue: T) {
        set(game, globalPath + path, newValue);
    }

    function getGlobal<T>(path: string, defaultValue?: T) {
        return get(game, globalPath + path, defaultValue) as T;
    }

    // Get and set your PERSONAL data
    function setCurrent<T>(path: string, newValue: T) {
        set(game, playerPath(game.nextToPlay!) + path, newValue);
    }

    function getCurrent<T>(path: string, defaultValue?: T) {
        return get(game, playerPath(game.nextToPlay!)  + path, defaultValue) as T;
    }

    // Get and set your PERSONAL data
    function setYours<T>(path: string, newValue: T) {
        set(game, yourPath + path, newValue);
    }

    function getYours<T>(path: string, defaultValue?: T) {
        return get(game, yourPath + path, defaultValue) as T;
    }

    // Get and set data for ALL PLAYERS
    function setPlayers<T>(path: string, player: string, newValue: T) {
        set(game, playerPath(player) + path, newValue);
    }

    function getPlayers<T>(path: string) {
        return game.players.map(player => get(game, playerPath(player.name) + path));
    }

    function yourField<T>(path: string, defaultValue?: T): [T, CB<T>] {
        return [
            getYours(path, defaultValue),
            (value: T) => setYours(path, value)
        ];
    }

    function globalField<T>(path: string, defaultValue?: T): [T, CB<T>] {
        return [
            getGlobal(path, defaultValue),
            (value: T) => setGlobal(path, value)
        ];
    }

    function currentPlayerField<T>(path: string, defaultValue?: T): [T, CB<T>] {
        return [
            getCurrent(path, defaultValue),
            (value: T) => setCurrent(path, value)
        ];
    }

    function allPlayersField<T>(path: string): [T[], (p: string, v: T) => void] {
        return [
            getPlayers(path),
            (player: string, value: T) => setPlayers(path, player, value)
        ];
    }

    const isYourTurn = getIsYourTurn(game, yourName);
    const playAi = shouldPlayAi(game, yourName);

    return {
        yourField,
        globalField,
        currentPlayerField,
        allPlayersField,

        setGlobal,
        getGlobal,
        setYours,
        getYours,

        isYourTurn,
        playAi,
        nextToPlay: game.nextToPlay,
        incrementPlayer: () => IncrementNextToPlayer(game),
        playerNames: game.players.map(p => p.name),
        updateGame: () => updateGame(game),
    }
}

export function useAI(playAi: boolean, aiAction: () => void) {
    React.useEffect(() => {
        if (playAi) {
            console.log("playing AI turn!");
            aiAction();
        }
    }, [playAi])
}