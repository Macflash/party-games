import React from "react";
import { IGameComponentProps } from "../lobby/game";
import { createUtils, useAI } from "../utils/playerUtils";
import { Header } from "../basic/basics";
import { ScoreCard } from "./scoreCard";

export type Dice = number[];

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
        globalField,
         allPlayersField, 
         playAi, isYourTurn, nextToPlay, incrementPlayer, playerNames, updateGame } = utils;
    const [numberOfRolls] = globalField<number>("numberOfRolls", 3);
    const [numberOfDice] = globalField<number>("numberOfDice", 5);

    const [dice, setDice] = globalField<number[]>("dice", createArray(numberOfDice, () => 0));
    const [rolls, setRolls] = globalField<number>("rolls", numberOfRolls);

    const [yourNumberScores, setYourNumberScores] = yourField<number[]>("numberScores", []);
    const [allNumberScores] = allPlayersField<number[]>("numberScores");

    useAI(playAi, () => {
        // Just advance the game for now!
        incrementPlayer();
        updateGame();
    });

    const endYourTurn = () => {
        setRolls(numberOfRolls);
        setDice(createArray(numberOfDice, () => 0))
        incrementPlayer();
        updateGame();
    }

    return (
        <div>
            {isYourTurn ? <Header>It's your turn!</Header> : <Header>It's {nextToPlay}'s turn.</Header>}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <ScoreCard 
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
                <DiceArea
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
                    }} />
            </div>
        </div>

    );
}

export const DiceArea: React.FC<{
    isYourTurn: boolean,
    dice: number[],
    setDice: (newDice: number[]) => void,
    rolls: number,
    setRolls: (newRolls: number) => void,
}> = props => {
    return <div style={{ margin: 20, width: 300 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            {props.dice.map((d, i) => <Die key={i} number={d} onClick={props.isYourTurn ? () => {
                if (props.rolls > 0) {
                    var newdice = [...props.dice];
                    newdice[i] = 0;
                    props.setDice?.(newdice);
                }
            } : undefined} />)}
        </div>

        <button
            onClick={props.isYourTurn ? () => {
                props.setRolls(props.rolls - 1);
                props.setDice?.(props.dice.map(d => d === 0 ? Math.floor(Math.random() * 5) + 1 : d));
            } : undefined}
            disabled={!props.isYourTurn || !props.setDice || props.dice.filter(d => d === 0).length <= 0}
        >
            Roll ({props.rolls})
        </button>
    </div>
}

export default RollX;

export const Die: React.FC<{ number: number, onClick?: () => void }> = props => {
    const size = 30;
    return <div style={{
        color: "black",
        cursor: "pointer",
        border: "2px solid white",
        width: size,
        height: size,
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: props.number === 0 ? "lightgrey" : "white",
        borderRadius: 2,
    }}
        onClick={props.onClick}
    >
        {props.number === 0 ? "?" : props.number}
    </div>
}
