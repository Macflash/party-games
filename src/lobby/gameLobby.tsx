import * as React from "react";
import { ServerGameObject } from "../generic/types";
import { Header, border, Input } from "../basic/basics";
import { Game } from "./game";
import { useDirtyState } from "../generic/hooks";
import { CB } from "../generic/apis";

export const GameLobby: React.FC<{ game: ServerGameObject, yourName: string, startGame: CB<ServerGameObject> }> = props => {
    const [game, setGame, dirty, setDirty] = useDirtyState(props.game);
    const youAreHost = game.players[0].name == props.yourName;

    return <div>
        <Header>Game: {game.name}</Header>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ flex: "auto" }}>
                <Header>Info</Header>
                <div>Invite Link: {window.location.href}</div>
                <div>Type: {game.objectData?.type}</div>
                <Input
                    name="Max Players"
                    value={game.maxPlayers == undefined ? "No maximum" : game.maxPlayers.toString()}
                    onChange={maxPlayers => setGame({
                        ...game,
                        maxPlayers:
                            maxPlayers === undefined
                                || Number(maxPlayers) <= 0
                                ? undefined
                                : Math.min(Math.max(0, Number(maxPlayers)), 20)
                    })}
                />

                {youAreHost ? <div>
                    <button disabled={!dirty} onClick={() => { setDirty(false); }}>Update</button>
                    <button disabled={game.players.length < 2} onClick={() => props.startGame(game)}>Start!</button>
                    <button
                        onClick={() =>
                            setGame({
                                ...game,
                                players: [
                                    ...game.players,
                                    { isAI: true, name: "AI_Marty #" + game.players.length }
                                ]
                            })}>
                        Add AI player
                    </button>
                </div> : null}
            </div>

            <div style={{ flex: "auto", padding: "0 10px", margin: 10, border }}>
                <Header>Players ({game.players.length}{game.maxPlayers ? `/${game.maxPlayers}` : null})</Header>
                {game.players.map((player, i) =>
                    <div key={i} style={{
                        display: "flex",
                        borderBottom: border,
                        padding: "10px 0",
                        marginBottom: -2
                    }}>
                        <div style={{ flex: "auto" }}>{player.name}</div>
                        {player.isAI ? <div>AI </div> : null}
                        {i == 0 ? <div>HOST</div> : null}
                    </div>)}
            </div>
        </div>
    </div>
}