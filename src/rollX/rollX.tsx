import React from "react";
import { ServerGameObject } from "../generic/types";

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

const RollX: React.FC<{ game: ServerGameObject }> = props => {
    const [rolls, setRolls] = React.useState(3);
    const [dice, setDice] = React.useState([0, 0, 0, 0, 0]);
    const [game, setGame] = React.useState<RollXScore>({
        Numbers: [],
    });

    return (
        <div style={{ display: "flex" }}>
            <ScoreCard scoreCard={game} dice={dice} setScoreCard={newScore => { setGame(newScore); setRolls(3); }} />
            <DiceArea dice={dice} setDice={setDice} rolls={rolls} setRolls={setRolls} />
        </div>
    );
}

export const DiceArea: React.FC<{
    dice: number[],
    setDice: (newDice: number[]) => void,
    rolls: number,
    setRolls: (newRolls: number) => void,
}> = props => {
    return <div style={{ margin: 20, width: 300 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            {props.dice.map((d, i) => <Die key={i} number={d} onClick={() => {
                if (props.rolls > 0) {
                    var newdice = [...props.dice];
                    newdice[i] = 0;
                    props.setDice?.(newdice);
                }
            }} />)}
        </div>

        <button
            onClick={() => {
                props.setRolls(props.rolls - 1);
                props.setDice?.(props.dice.map(d => d === 0 ? Math.floor(Math.random() * 5) + 1 : d));
            }}
            disabled={!props.setDice || props.dice.filter(d => d === 0).length <= 0}
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

export const ScoreRow: React.FC<{ name: string, score?: number | false, onClick?: () => void }> = props => {
    return <div onClick={props.score ? undefined : props.onClick} style={{ outline: "2px solid black", margin: 2, width: 200 }}>
        <span style={{ display: "inline-block", width: 150, borderRight: "2px solid black" }}>{props.name}:</span>
        <span>{props.score === false ? null : props.score}</span>
    </div>
}

export const ScoreCard: React.FC<{ scoreCard: RollXScore, setScoreCard: (newscore: RollXScore) => void, dice?: number[] }> = props => {
    return <div style={{ textAlign: "left" }}>
        <div>Upper Section</div>
        <ScoreRow score={props.scoreCard.Numbers[1]} name="Aces" />
        <ScoreRow score={props.scoreCard.Numbers[2]} name="Twos" />
        <ScoreRow score={props.scoreCard.Numbers[3]} name="Threes" />
        <ScoreRow score={props.scoreCard.Numbers[4]} name="Fours" />
        <ScoreRow score={props.scoreCard.Numbers[5]} name="Fives" />
        <ScoreRow score={props.scoreCard.Numbers[6]} name="Sixes" />

        <div>Lower Section</div>
        <ScoreRow score={props.scoreCard.ThreeKind} name="3 of a kind" />
        <ScoreRow score={props.scoreCard.FourKind} name="4 of a kind" />
        <ScoreRow score={props.scoreCard.FullHouse && 25} name="Full House" />
        <ScoreRow score={props.scoreCard.FullHouse && 30} name="Small Straight (4)" />
        <ScoreRow score={props.scoreCard.FullHouse && 40} name="Large Straight (5)" />
        <ScoreRow score={props.scoreCard.Yeahtzee && 50} name="Yeahtzee" />
        <ScoreRow score={props.scoreCard.Chance} name="Chance" onClick={() => props.setScoreCard({ ...props.scoreCard, Chance: props.dice?.reduce((prev, cur) => (prev || 0) + cur) })} />
    </div>
}