import React from 'react';
import './App.css';
import { Lobby } from './lobby/lobby';
import { LocalApi } from './generic/localApi';
import { PickName } from './lobby/pickName';
import { IGenericGame } from './generic/types';
import { Game } from './lobby/game';
import { OnlineApi } from './generic/onlineApi';

function App() {
  const [name, setName] = React.useState<string | null>(null);
  const [game, setGame] = React.useState<IGenericGame | null>(null);
  if (!name) {
    return <PickName onPick={setName} />
  }

  if (game) {
    return <Game game={game} yourName={name} />;
  }

  return <Lobby
    yourName={name}
    nameChange={setName}
    api={window.location.host.indexOf("localhost:3000") >= 0
      ? LocalApi.Lobby
      : OnlineApi.Lobby}
    startGame={setGame}
  />;
}

export default App;
