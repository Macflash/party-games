import React from 'react';
import './App.css';
import { Lobby } from './lobby/lobby';
import { LocalApi } from './generic/localApi';
import { PickName } from './lobby/pickName';
import { ServerGameObject } from './generic/types';
import { Game } from './lobby/game';
import { OnlineApi } from './generic/onlineApi';
import { IGenericGameApi, CB } from './generic/apis';
import { GameLobby } from './lobby/gameLobby';
import { getIsYourTurn } from './utils/playerUtils';

const pollWait = 1500;
var currentGame: ServerGameObject | null = null;
var setter: CB<ServerGameObject> | null = null;

const refreshGame = (api: IGenericGameApi) => api.Lobby.GetCurrentGame();
const setCurrentGame = (game: ServerGameObject) => {
  currentGame = game;
  setter?.(game);
}

//var isRunning = false;
const startGameTimer = (api: IGenericGameApi, playerName: string) => {
  //if (isRunning) { throw "Loop was already running!"; }
  //api and name WONT change from this point on

  //hmm, interval does NOT handle the time it takes to make an API call..
  setTimeout(async () => {
    console.log("game loop", currentGame);
    // two main states
    // 1 in an active game
    if (!currentGame) { throw "no game yet!!" }
    else if (currentGame.state == "InGame") {
      // check if it is your turn!
      const isYourTurn = currentGame.nextToPlay == playerName;
      if (isYourTurn) {
        console.log("In game & your turn! No refresh");
        // DONT poll here. You need to take some action and update the server!
        startGameTimer(api, playerName);
      }
      else {
        console.log("In game & NOT your turn. Refreshing...");
        // you should have no actions available so you can just refresh and update
        const game = await refreshGame(api);
        setCurrentGame(game);
        startGameTimer(api, playerName);
      }
    }
    else if (currentGame.state == "InPrivateLobby" || currentGame.state == "InPublicLobby") {
      console.log("In lobby. Refreshing...");
      // we can always refresh here?
      const game = await refreshGame(api);
      setCurrentGame(game);
      startGameTimer(api, playerName);
    }
    else {
      console.log("Game is probably over! Cancel the loop.");
      //isRunning = false;
    }

    // 2 In the game lobby
  }, pollWait);
}

function App() {
  const api = window.location.host.indexOf("localhost:3000") >= 0 ? LocalApi : OnlineApi;
  const [playerName, setYourName] = React.useState<string>("");
  const [game, setGame] = React.useState<ServerGameObject | null>(null);
  setter = setGame;

  const setGameAndStartTimer = (game: ServerGameObject, playerName: string) => {
    setYourName(playerName);
    setCurrentGame(game);
    startGameTimer(api, playerName);
  }

  const joinGame = async (game: ServerGameObject) => {
    // TODO: start a timer here!
    const resp = await api.Lobby.Join({ gameId: game.gameId, playerName });
    console.log("joined game", resp);
    setGameAndStartTimer(resp.game, resp.playerName);
  };

  const createGame = async (game: ServerGameObject) => {
    // TODO start a timer here!
    const resp = await api.Lobby.Create({ game, playerName });
    console.log("created game", resp);
    setGameAndStartTimer(resp.game, resp.playerName);
  };

  const startGame = async (game: ServerGameObject) => {
    // TODO: start a timer here!
    const resp = await api.Lobby.Update(game);
    setCurrentGame(game);
    console.log("started game", resp);
  };

  const updateGame = async (game: ServerGameObject) => {
    // TODO: start a timer here!
    const resp = await api.Lobby.Update(game);
    setCurrentGame({ ...game });
    console.log("updated game", game, resp);
  };

  if (!playerName) {
    return <PickName onPick={setYourName} />
  }

  // TODO: handle deep links

  if (game && game.state == "InGame") {
    return <Game game={game} yourName={playerName} isYourTurn={getIsYourTurn(game, playerName)} updateGame={updateGame} />;
  }

  if (game && (game.state == "InPrivateLobby" || game.state == "InPublicLobby")) {
    return <GameLobby yourName={playerName} game={game} startGame={startGame} updateGame={updateGame} />;
  }

  return <Lobby
    api={api.Lobby}
    joinGame={joinGame}
    createGame={createGame}
  />;
}

export default App;
