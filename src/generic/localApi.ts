import { IGenericGameApi } from "./genericApis";
import { IGenericGame } from "./genericTypes";

var allGames: IGenericGame[] = [];

var currentPlayer: string | null = null;
var currentGame: IGenericGame | null = null;

export const ILocalApi: IGenericGameApi = {
    Lobby: {
        GetLobbies: async () => allGames,
        GetLobbyById: async id => allGames.find(game => game.gameId == id)!,
        CreateLobby: async newGame => { allGames.push(newGame) },
        UpdateLobby: async updatedGame => {
            var index = allGames.findIndex(game => game.gameId == updatedGame.gameId);
            var existingGame = allGames[index];

            // Ensure the first player (e.g. the HOST) is the only one who can update the game
            if(existingGame.players[0].name != currentPlayer){
                throw "Only the HOST can update the game!";
            }

            allGames[index] = updatedGame;
         },
        JoinLobby: async request => {
            var game = allGames.find(game => game.gameId == request.gameId)!;
            var playerName = request.playerName + " #" + game.players.length + 1;

            game.players.push({name: playerName});
            
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
            if(currentPlayer != currentGame?.players[currentGame?.nextToPlay].name){
                throw "It is not your turn to play!";
            }

            // player must change the nextToPlay player!
            if(currentGame?.nextToPlay == payload.nextToPlay){
                throw "Next to play MUST advance to the next player!";
            }

            currentGame = payload;
        },
        Refresh: async () => currentGame!,
    }
}