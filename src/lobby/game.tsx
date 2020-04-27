import * as React from "react";
import { ServerGameObject } from "../generic/types";

export const Game: React.FC<{ game: ServerGameObject, yourName: string }> = props => {
    const { game } = props;
    let gameComponent: React.ReactNode = `Game ${game.objectData?.type} was not found!`;
    switch (game.objectData?.type) {
        case "RollX":
            gameComponent = <RollXGame game={game} />
    }

    return <React.Suspense fallback="Loading Game...">{gameComponent}</React.Suspense>;
}

const RollXGame = React.lazy(() => import("../rollX/rollX"));