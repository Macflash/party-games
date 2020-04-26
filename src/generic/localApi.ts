import { IGenericGameApi } from "./genericApis";
import { IGenericGame } from "./genericTypes";

var allGames: IGenericGame[] = []; // move to localstorage

var currentPlayer: string | null = null;
var currentGame: IGenericGame | null = null; // move to local storage

function delayed<T>(value: T, delay: number = 500) {
    return new Promise<T>(resolve => {
        setTimeout(() => {
            resolve(value);
        }, delay);
    });
}

export const LocalApi: IGenericGameApi = {
    Lobby: {
        GetLobbies: async () => delayed(allGames),
        GetLobbyById: async id => delayed(allGames.find(game => game.id == id)!),
        CreateLobby: async newGame => { allGames.push(newGame) },
        UpdateLobby: async updatedGame => {
            var index = allGames.findIndex(game => game.id == updatedGame.id);
            var existingGame = allGames[index];

            // Ensure the first player (e.g. the HOST) is the only one who can update the game
            if (existingGame.players[0].name != currentPlayer) {
                throw "Only the HOST can update the game!";
            }

            allGames[index] = updatedGame;
        },
        JoinLobby: async request => {
            var game = allGames.find(game => game.id == request.gameId)!;
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
        PlayTurn: async payload => {
            // Only the nextToPlay player can play!
            if (currentPlayer != currentGame?.players[currentGame?.nextToPlay].name) {
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