import * as React from "react";
import { useGet } from "../generic/hooks";
import { border } from "../generic/genericStyles";
import { IGenericLobbyApi } from "../generic/genericApis";

export const Lobby: React.FC<{ api: IGenericLobbyApi }> = props => {
    const { api } = props;
    const [games, isLoadingGames, refreshGames] = useGet(api.GetLobbies);

    return <div>
        {/** Game list */}
        <div style={{ border, padding: 25, textAlign: "center" }}>
            {isLoadingGames
                ? "Loading..."
                : games && games.length > 0
                    ? games.map(game => <div style={{ border, padding: 10 }}>{game.type} | {game.name}: {game.players.length} / {game.maxPlayers ?? "∞"} <button>Join</button></div>)
                    : "No games found."
            }
        </div>

        {/** Actions */}
        <div>
            <button>Create Game</button>
            <button onClick={refreshGames}>Refresh List</button>
        </div>
    </div>;
}