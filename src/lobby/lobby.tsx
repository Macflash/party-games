import * as React from "react";
import { useGet } from "../generic/hooks";
import { IGenericLobbyApi, CB } from "../generic/apis";
import { CreateGame } from "./createGame";
import { Header, border } from "../basic/basics";
import { ServerGameObject } from "../generic/types";

export const Lobby: React.FC<{ api: IGenericLobbyApi, joinGame: CB<ServerGameObject>, createGame: CB<ServerGameObject> }> = props => {
    const { api, joinGame, createGame } = props;
    const [games, isLoadingGames, refreshGames] = useGet(api.GetAll);

    return <div>
        <Header>{window.location.host}{window.location.pathname}</Header>
        {/** Game list */}
        <div style={{ border, padding: 25, textAlign: "center" }}>
            {isLoadingGames
                ? "Loading..."
                : games && Object.keys(games).length > 0
                    ? Object.keys(games).filter(gameId => games[Number(gameId)]?.state == "InPublicLobby").map(gameId => {
                        const game = games[Number(gameId)];
                        if (!game) { return null; }
                        return <div key={gameId} style={{ border, padding: 10 }}>
                            {game.objectData?.type} {game.players[0].name} |
                         {game.name}:
                         {game.players.length} / {game.maxPlayers ?? "∞"}
                            <button onClick={() => joinGame(game)}>Join</button></div>
                    })
                    : "No games found."
            }
        </div>

        {/** Actions */}
        <div>
            <CreateGame onCreate={createGame} />
            <button onClick={refreshGames}>Refresh List</button>
        </div>
    </div>;
}