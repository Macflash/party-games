import * as React from "react";
import { ServerGameObject } from "../generic/types";
import { CB } from "../generic/apis";

export interface IGameComponentProps<T extends object> {
    game: ServerGameObject<T>,
    yourName: string,
    isYourTurn: boolean,
    updateGame: CB<ServerGameObject>,
} 

export const Game: React.FC<IGameComponentProps<any>> = props => {
    const { game } = props;
    let gameComponent: React.ReactNode = `Game ${game.objectData?.type} was not found!`;
    switch (game.objectData?.type) {
        case "RollX":
            gameComponent = <RollXGame {...props} />
    }

    return <React.Suspense fallback="Loading Game...">{gameComponent}</React.Suspense>;
}

const RollXGame = React.lazy(() => import("../rollX/rollX"));