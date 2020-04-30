import React from "react";
import { IGameComponentProps } from "../lobby/game";
import { IGenericGame } from "../generic/types";
import { getGameData, getYours, IncrementNextToPlayer, setYours, getIsYourTurn } from "../utils/playerUtils";
import { Header, border } from "../basic/basics";

type Dice = number[];

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

function createArray<T extends object | number | string>(num: number, initial?: T): T[] {
    var arr = new Array(num);
    for (var i = 0; i < num; i++) {
        arr[i] = initial ?? 0;
    }

    return arr;
}

const RollX: React.FC<IGameComponentProps<IRollXGameData>> = props => {
    const { game, yourName, updateGame } = props;  
    game.nextToPlay = game.nextToPlay ?? game.players[0].name;
    const isYourTurn = getIsYourTurn(game, yourName);
    const data = getGameData(game);
    const { dice = createArray(5, 0), rolls = 3, diceNumber = 5, scores = createArray<RollXScore>(game.players.length, { Numbers: [] }) } = data;

    const yourScoreCard = getYours(game, yourName, scores);
    console.log("getting scores", scores, yourScoreCard);

    return (
        <div>
            {isYourTurn ? <Header>It's your turn!</Header> : <Header>It's {game.nextToPlay}'s turn.</Header>}
            <div style={{ display: "flex" }}>
                <ScoreCard
                    scoreCard={yourScoreCard}
                    dice={dice}
                    setScoreCard={newScore => {
                        data.scores = setYours(game, yourName, scores, newScore);
                        data.rolls = 3;
                        data.dice = createArray(diceNumber, 0);
                        game.objectData = data;
                        IncrementNextToPlayer(game);
                        updateGame(game);
                    }}
                />
                <DiceArea
                    isYourTurn={isYourTurn}
                    dice={dice}
                    setDice={newdice => {
                        data.dice = newdice;
                        game.objectData = data;
                        updateGame(game);
                    }}
                    rolls={rolls}
                    setRolls={newrolls => {
                        data.rolls = newrolls;
                        game.objectData = data;
                        updateGame(game);
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

export const ScoreRow: React.FC<{ name: string, score?: number | false, onClick?: () => void }> = props => {
    return <div onClick={props.score ? undefined : props.onClick} style={{ cursor: props.score ? undefined: "pointer", outline: border, margin: 2, width: 200 }}>
        <span style={{ display: "inline-block", width: 150, borderRight: border, padding:2 }}>{props.name}:</span>
        <span style={{display: "inline-block", padding:2}}>{props.score === false ? null : props.score}</span>
    </div>
}

export const NumberScoreRow: React.FC<{ name: string, number: number, numberscores: number[], onClick?: () => void }> = props => {
    return <div onClick={props.score ? undefined : props.onClick} style={{ cursor: props.score ? undefined: "pointer", outline: border, margin: 2, width: 200 }}>
        <span style={{ display: "inline-block", width: 150, borderRight: border, padding:2 }}>{props.name}:</span>
        <span style={{display: "inline-block", padding:2}}>{props.score === false ? null : props.score}</span>
    </div>
}

export const ScoreCard: React.FC<{ scoreCard: RollXScore, setScoreCard: (newscore: RollXScore) => void, dice?: number[] }> = props => {
    return <div style={{ textAlign: "left" }}>
        <div>Upper Section</div>
        <ScoreRow score={props.scoreCard.Numbers[1]} name="Aces" onClick={() => props.setScoreCard({ ...props.scoreCard, Chance: props.dice?.filter(d => d==1).reduce((prev, cur) => (prev || 0) + cur) })}/>
        <ScoreRow score={props.scoreCard.Numbers[2]} name="Twos" onClick={() => props.setScoreCard({ ...props.scoreCard, Chance: props.dice?.filter(d => d==2).reduce((prev, cur) => (prev || 0) + cur) })}/>
        <ScoreRow score={props.scoreCard.Numbers[3]} name="Threes" onClick={() => props.setScoreCard({ ...props.scoreCard, Chance: props.dice?.filter(d => d==3).reduce((prev, cur) => (prev || 0) + cur) })}/>
        <ScoreRow score={props.scoreCard.Numbers[4]} name="Fours" onClick={() => props.setScoreCard({ ...props.scoreCard, Chance: props.dice?.filter(d => d==4).reduce((prev, cur) => (prev || 0) + cur) })}/>
        <ScoreRow score={props.scoreCard.Numbers[5]} name="Fives"onClick={() => props.setScoreCard({ ...props.scoreCard, Chance: props.dice?.filter(d => d==5).reduce((prev, cur) => (prev || 0) + cur) })} />
        <ScoreRow score={props.scoreCard.Numbers[6]} name="Sixes" onClick={() => props.setScoreCard({ ...props.scoreCard, Chance: props.dice?.filter(d => d==6).reduce((prev, cur) => (prev || 0) + cur) })}/>

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