import * as React from "react";
import { ServerGameObject } from "../generic/types";
import { CB } from "../generic/apis";

export const Game: React.FC<{ game: ServerGameObject, yourName: string, updateGame: CB<ServerGameObject> }> = props => {
    const { game } = props;
    let gameComponent: React.ReactNode = `Game ${game.objectData?.type} was not found!`;
    switch (game.objectData?.type) {
        case "RollX":
            gameComponent = <RollXGame {...props} />
    }

    return <React.Suspense fallback="Loading Game...">{gameComponent}</React.Suspense>;
}

const RollXGame = React.lazy(() => import("../rollX/rollX"));