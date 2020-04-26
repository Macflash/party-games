import React from 'react';
import './App.css';
import { Lobby } from './lobby/lobby';
import { LocalApi } from './generic/localApi';

function App() {
  return (
    <div>
      <Lobby api={LocalApi.Lobby} />
    </div>
  );
}

export default App;
