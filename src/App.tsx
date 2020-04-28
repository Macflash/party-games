import React from 'react';
import './App.css';
import { Lobby } from './lobby/lobby';
import { LocalApi } from './generic/localApi';
import { PickName } from './lobby/pickName';
import { ServerGameObject } from './generic/types';
import { Game } from './lobby/game';
import { OnlineApi } from './generic/onlineApi';
import { IGenericGameApi } from './generic/apis';
import { GameLobby } from './lobby/gameLobby';
import { Server } from 'http';

var interval: any = null;
const refreshGame = (api: IGenericGameApi) => api.Lobby.GetCurrentGame();
const startGameTimer = (api: IGenericGameApi, playerName: string) => {
  //api and name WONT change from this point on

}

function App() {
  const api = window.location.host.indexOf("localhost:3000") >= 0 ? LocalApi : OnlineApi;
  const [playerName, setYourName] = React.useState<string>("");
  const [game, setGame] = React.useState<ServerGameObject | null>(null);

  const joinGame = async (game: ServerGameObject) => {
    // TODO: start a timer here!
    const resp = await api.Lobby.Join({ gameId: game.gameId, playerName });
    setYourName(resp.playerName);
    setGame(resp.game);
  };

  const createGame = async (game: ServerGameObject) => {
    // TODO start a timer here!
    const resp = await api.Lobby.Create({ game, playerName });
    setYourName(resp.playerName);
    setGame(resp.game);
  };

  if (!playerName) {
    return <PickName onPick={setYourName} />
  }

  if (game && game.state == "InGame") {
    return <Game game={game} yourName={playerName} />;
  }

  if (game && (game.state == "InPrivateLobby" || game.state == "InPublicLobby")) {
    return <GameLobby yourName={playerName} game={game} startGame={setGame} />;
  }

  return <Lobby
    api={api.Lobby}
    joinGame={joinGame}
    createGame={createGame}
  />;
}

export default App;
