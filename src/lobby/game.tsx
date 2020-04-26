import * as React from "react";
import { IGenericGame } from "../generic/types";

export const Game: React.FC<{ game: IGenericGame }> = props => {
    const { game } = props;
    let gameComponent: React.ReactNode = `Game ${game.type} was not found!`;
    switch (game.type) {
        case "RollX":
            gameComponent = <RollXGame game={game} />
    }

    return <div>{gameComponent}</div>;
}

const RollXGame = React.lazy(() => import("../rollX/rollX"));