import * as React from "react";
import { useGet } from "../generic/hooks";
import { IGenericLobbyApi, CB } from "../generic/apis";
import { CreateGame } from "./createGame";
import { Header, border } from "../basic/basics";
import { IGenericGame } from "../generic/types";
import { GameLobby } from "./gameLobby";

export const Lobby: React.FC<{ api: IGenericLobbyApi, yourName: string, startGame: CB<IGenericGame> }> = props => {
    const { api } = props;
    const [games, isLoadingGames, refreshGames] = useGet(api.GetAll);
    const [currentLobby, setCurrentLobby] = React.useState<IGenericGame | null>(null);

    if (currentLobby) {
        return <GameLobby yourName={props.yourName} game={currentLobby} startGame={props.startGame} />;
    }

    return <div>
        <Header>{window.location.host}{window.location.pathname}</Header>
        {/** Game list */}
        <div style={{ border, padding: 25, textAlign: "center" }}>
            {isLoadingGames
                ? "Loading..."
                : games && Object.keys(games).length > 0
                    ? Object.keys(games).map(gameId => {
                        const game = games[Number(gameId)];
                        //todo this shouldn't happen
                        if(!game){ return null; }
                        return <div style={{ border, padding: 10 }}>
                            {game.type} |
                         {game.name}:
                         {game.players.length} / {game.maxPlayers ?? "∞"}
                            <button onClick={() => setCurrentLobby(game)}>Join</button></div>
                    })
                    : "No games found."
            }
        </div>

        {/** Actions */}
        <div>
            <CreateGame yourName={props.yourName} onCreate={game => { 
                // TODO: update your name based on the server response!
                api.Create({ game, playerName: props.yourName }).then(val => setCurrentLobby(val.game));
                 }} />
            <button onClick={refreshGames}>Refresh List</button>
        </div>
    </div>;
}