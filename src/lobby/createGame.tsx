import * as React from "react";
import { CB, IGenericLobbyApi } from "../generic/apis";
import { Dialog, Input, Header, DropDown } from "../basic/basics";
import { ServerGameObject } from "../generic/types";

export const CreateBasicGame = (): ServerGameObject => ({
    state: "InPublicLobby",
    gameId: null as any,
    players: [],
    name: "",
    nextToPlay: null as any,
    data: "",
});

export const CreateGame: React.FC<{ onCreate: CB<ServerGameObject>, yourName: string }> = props => {
    const [showDialog, setShowDialog] = React.useState(false);
    const [game, setGame] = React.useState<ServerGameObject>({ ...CreateBasicGame() });

    return <>
        <button onClick={() => setShowDialog(true)}>Create Game</button>
        {showDialog ?
            <Dialog>
                <Header>Create a game</Header>
                <Input name="Name" value={game.name} onChange={name => setGame({ ...game, name })} />
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

                <DropDown name="Type" value={game.objectData?.type} onChange={type => setGame({ ...game, objectData: {...game.objectData, type} })}>
                    <option value="RollX">Roll - X</option>
                    <option value="CribBIGage">CribBIGage</option>
                </DropDown>

                <div>
                    <button disabled={!game.name || !game.objectData?.type} onClick={() => props.onCreate(game)}>Create</button>
                    <button onClick={() => setShowDialog(false)}>Cancel</button>
                </div>
            </Dialog>
            : null}
    </>;
}