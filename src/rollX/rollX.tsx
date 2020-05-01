import React from "react";
import { IGameComponentProps } from "../lobby/game";
import { createUtils, useAI } from "../utils/playerUtils";
import { Header } from "../basic/basics";
import { ScoreCard } from "./scoreCard";
import { Dice, DiceArea } from "./dice";

export interface IRollXGameData {
    diceNumber: number;
    scores: RollXScore[];
    dice: Dice;
    rolls: number;
}

export interface RollXScore {
    /** Upper Section. Numbers 1-X */
    Numbers: number[];

    // Lower Section
    ThreeKind?: number;
    FourKind?: number;
    FullHouse?: boolean;
    Straight4?: boolean;
    Straight5?: boolean;
    Yeahtzee?: number;
    Chance?: number;
}

function createArray<T extends object | number | string>(num: number, initial?: () => T): T[] {
    var arr = new Array(num);
    for (var i = 0; i < num; i++) {
        arr[i] = initial?.() ?? 0;
    }

    return arr;
}

const RollX: React.FC<IGameComponentProps<IRollXGameData>> = props => {
    const utils = createUtils(props);
    const {
        yourField,
        currentPlayerField,
        globalField,
        allPlayersField,
        playAi, isYourTurn, nextToPlay, incrementPlayer, playerNames, updateGame } = utils;
    const [numberOfRolls] = globalField<number>("numberOfRolls", 3);
    const [numberOfDice] = globalField<number>("numberOfDice", 5);

    const [dice, setDice] = globalField<number[]>("dice", createArray(numberOfDice, () => 0));
    const [rolls, setRolls] = globalField<number>("rolls", numberOfRolls);

    const [allTurns] = allPlayersField<number>("turn");
    const [turn, setTurn] = currentPlayerField<number>("turn", 0);

    const [yourNumberScores, setYourNumberScores] = currentPlayerField<number[]>("numberScores", []);
    const [allNumberScores] = allPlayersField<number[]>("numberScores");

    useAI(playAi, () => {
        // Just advance the game for now!
        setTurn(turn + 1);
        incrementPlayer();
        updateGame();
    });

    const endYourTurn = () => {
        setRolls(numberOfRolls);
        setDice(createArray(numberOfDice, () => 0))
        setTurn(turn + 1);
        incrementPlayer();
        updateGame();
    }

    const gameOver = allTurns.filter(t => t == 13).length == playerNames.length;

    return (
        <div>
            {isYourTurn ? <Header>It's your turn!</Header> : <Header>It's {nextToPlay}'s turn.</Header>}
            <div style={{ display: "flex", flexWrap: "wrap" }}>

                <ScoreCard
                    gameOver={gameOver}

                    endYourTurn={endYourTurn}
                    yourField={yourField}
                    globalField={globalField}
                    allPlayersField={allPlayersField}

                    players={playerNames}
                    dice={dice}
                    isYourTurn={isYourTurn}
                    nextToPlay={nextToPlay}
                    allNumberScores={allNumberScores}
                    yourNumberScores={yourNumberScores}
                    setYourNumberScores={newNumberScore => {
                        setYourNumberScores(newNumberScore);
                        endYourTurn();
                    }}
                />

                {gameOver ? null : <DiceArea
                    isYourTurn={isYourTurn}
                    dice={dice}
                    setDice={newDice => {
                        setDice(newDice);
                        updateGame();
                    }}
                    rolls={rolls}
                    setRolls={newRolls => {
                        setRolls(newRolls);
                        updateGame();
                    }}
                />}

            </div>
        </div>

    );
}

export default RollX;