import { IGenericGameApi } from "./apis";
import { ServerGameObject } from "./types";

var localGameIdCounter = 0;
var allGames: {[id: number]: ServerGameObject} = {}; // move to localstorage

var currentPlayer: string | null = null;
var currentGame: ServerGameObject | null = null; // move to local storage

function delayed<T>(value: T, delay: number = 500) {
    return new Promise<T>(resolve => {
        setTimeout(() => {
            resolve(value);
        }, delay);
    });
}

export const LocalApi: IGenericGameApi = {
    Lobby: {
        GetAll: async () => delayed(allGames),
        GetById: async id => delayed(allGames[Number(id)]),
        GetCurrentGame: async () => delayed(currentGame!),
        Create: async newGame => { 
            newGame.game.gameId = localGameIdCounter.toString();
            allGames[localGameIdCounter] = newGame.game;
            localGameIdCounter++;
            newGame.playerName = newGame.playerName + "#1";
            newGame.game.players = [{ name: newGame.playerName }];
            return newGame;
         },
        Update: async updatedGame => {
            var existingGame = allGames[Number(updatedGame.gameId)];

            // Ensure the first player (e.g. the HOST) is the only one who can update the game
            if (existingGame.players[0].name != currentPlayer) {
                throw "Only the HOST can update the game!";
            }

            allGames[Number(updatedGame.gameId)] = updatedGame;
        },
        Join: async request => {
            var game = allGames[Number(request.gameId)];
            var playerName = request.playerName + " #" + game.players.length + 1;

            game.players.push({ name: playerName });

            currentGame = game;
            currentPlayer = playerName;

            return {
                game,
                playerName
            }
        }
    },
    Play: {
        Play: async payload => {
            // Only the nextToPlay player can play!
            if (currentPlayer != currentGame?.nextToPlay) {
                throw "It is not your turn to play!";
            }

            // player must change the nextToPlay player!
            if (currentGame?.nextToPlay == payload.nextToPlay) {
                throw "Next to play MUST advance to the next player!";
            }

            currentGame = payload;
        },
        Refresh: async () => currentGame!,
    }
}