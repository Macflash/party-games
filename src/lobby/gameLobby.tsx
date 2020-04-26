import * as React from "react";
import { IGenericGame } from "../generic/types";
import { Header, border } from "../basic/basics";
import { Game } from "./game";

export const CreateBasicGame = (): IGenericGame => ({
    state: "InPublicLobby",
    id: null as any,
    players: [],
    name: "",
    nextToPlay: null as any,
    type: null as any,
});

export const GameLobby: React.FC<{ game: IGenericGame }> = props => {
    return <div>
        <Header>Game: {props.game.name}</Header>
        <div style={{ display: "flex" }}>
            <div style={{ flex: "auto" }}>
                <Header>Info</Header>
            </div>

            <div style={{ flex: "auto", padding: "0 10px", margin: 10, border }}>
                <Header>Players</Header>
                {props.game.players.map(player => <div>
                    {player.isAI ? <span>AI </span> : null}
                    {player.name}
                </div>)}
            </div>
        </div>
    </div>
}