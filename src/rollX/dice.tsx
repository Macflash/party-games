import React from "react";
import { InRange } from "../utils/randomUtil";

export type Dice = number[];

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
                props.setDice?.(props.dice.map(d => d === 0 ? InRange(1, 6) : d));
            } : undefined}
            disabled={!props.isYourTurn || !props.setDice || props.dice.filter(d => d === 0).length <= 0}
        >
            Roll ({props.rolls})
        </button>
    </div>
}

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
