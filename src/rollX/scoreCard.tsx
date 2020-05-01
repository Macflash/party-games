import React from "react";
import { CB } from "../generic/apis";
import { border } from "../basic/basics";
import { Dice } from "./rollX";

const firstCellWidth = 150;

export const Row: React.FC<{ onClick?: CB }> = props => {
    return <div onClick={props.onClick} style={{ cursor: props.onClick ? "pointer" : undefined, outline: border, margin: 2, display: "flex", justifyContent: "flex-start" }}>
        {props.children}
    </div>
}

export const Cell: React.FC<{ width?: number }> = props => {
    return <div style={{ width: props.width ?? 100, borderRight: border, padding: 2, flex: "none" }}>
        {props.children}
    </div>
}

export const PlayerRow: React.FC<{ names: string[] }> = props => {
    return <Row>
        <Cell width={firstCellWidth} />
        {props.names.map((n, i) => <Cell key={i}>{n}</Cell>)}
    </Row>
}

export const ScoreRow: React.FC<{ name: string, scores: (number | undefined | false)[], onClick?: () => void }> = props => {
    return <Row>
        <Cell width={firstCellWidth}>{props.name}:</Cell>
        {props.scores.map((score, i) => <Cell key={i}>{score === false || score == undefined ? null : score}</Cell>)}
    </Row>
}

export function sumNumberDice(dice: Dice, validNumber: number) {
    return sumDice(dice.filter(d => d == validNumber));
}

export function sumDice(dice: Dice) {
    if (!dice || dice.length <= 0) { return 0; }

    return dice.reduce((p, c) => c + (p || 0));
}

export function noUnrolledDice(dice: Dice) {
    return countSpecificDice(dice, 0) == 0;
}


export const NumberScoreRow: React.FC<{
    numberIndex: number,
    players: string[],
    isYourTurn: boolean,
    nextToPlay: string,
    dice: number[],
    allNumberScores: number[][],
    yourNumberScores: number[],
    setYourNumberScores: CB<number[]>,
}> = props => {
    const clickable = props.isYourTurn && noUnrolledDice(props.dice) && props.yourNumberScores[props.numberIndex] == undefined;
    const wouldScore = sumNumberDice(props.dice, props.numberIndex);
    return <Row onClick={clickable ? () => {
        var newScores = [...props.yourNumberScores];
        newScores[props.numberIndex] = wouldScore;
        props.setYourNumberScores(newScores);
    } : undefined}>
        <Cell width={firstCellWidth}>{props.numberIndex}:</Cell>
        {props.allNumberScores.map((score, i) => {
            if (clickable && props.isYourTurn && props.players[i] == props.nextToPlay) {
                return <Cell><button style={{ height: "inherit", padding: 2, margin: 0, width: "100%" }}>Score {wouldScore}</button></Cell>
            }

            return <Cell>{score?.[props.numberIndex]}</Cell>
        })}
    </Row>
}

export const PathScoreRow: React.FC<{
    name: string,
    players: string[],
    isYourTurn: boolean,
    nextToPlay: string,

    dice: Dice,
    valid: boolean,
    wouldScore: number,

    path: string,
    yourField: <T>(path: string, defaultValue?: T | undefined) => [T, CB<T>],
    globalField: <T>(path: string, defaultValue?: T | undefined) => [T, CB<T>],
    allPlayersField: <T>(path: string) => [T[], (p: string, v: T) => void],
    endYourTurn: () => void,
}> = props => {
    const [yourScore, setYourScore] = props.yourField<number | undefined>(props.path, undefined);
    const clickable = props.isYourTurn && noUnrolledDice(props.dice) && props.valid && yourScore == undefined;
    const [allScores] = props.allPlayersField<number | undefined>(props.path);

    return <Row>
        <Cell width={firstCellWidth}>{props.name}:</Cell>
        {allScores.map((score, i) => {
            if (clickable && props.isYourTurn && props.players[i] == props.nextToPlay) {
                return <Cell><button
                    onClick={() => {
                        setYourScore(props.wouldScore);
                        props.endYourTurn();
                    }}
                    style={{ height: "inherit", padding: 2, margin: 0, width: "100%" }}>Score {props.wouldScore}</button></Cell>
            }

            return <Cell key={i}>{score}</Cell>
        })}
    </Row>
}

export function countSpecificDice(dice: Dice, number: number) {
    return dice.filter(d => d == number).length;
}

export function isXofKind(dice: Dice, x: number) {
    for (var i = 0; i < dice.length; i++) {
        if (countSpecificDice(dice, dice[i]) >= x) {
            return true;
        }
    }

    return false;
}

export function isFullHouse(dice: Dice) {
    let has2 = 0;
    let has3 = 0;
    for (var i = 0; i < dice.length; i++) {
        if (countSpecificDice(dice, dice[i]) >= 3) {
            has3 = i;
        }
    }
    for (var i = 0; i < dice.length; i++) {
        if (i == has3) { continue; }
        if (countSpecificDice(dice, dice[i]) >= 2) {
            has2 = i;
        }
    }

    return has2 != 0 && has3 != 0;
}

export function isStraightX(dice: Dice, x: number, startPoint = 0): boolean {
    if (x <= 0) {
        return true;
    }

    const min = Math.min(...dice.filter(d => !startPoint || d >= startPoint));
    if (startPoint != 0 && min != startPoint) {
        return false;
    }

    return isStraightX(dice, x - 1, min + 1);
}

const kind3path = "3kind";
const kind4path = "4kind";
const fullhousePath = "fullhouse";
const straight4path = "straight4";
const straight5path = "straight5";
const yeahtzeepath = "yeahtzee";
const chancePath = "chance";

export const ScoreCard: React.FC<{
    players: string[],
    isYourTurn: boolean,
    nextToPlay: string,
    dice: number[],
    allNumberScores: number[][],
    yourNumberScores: number[],
    setYourNumberScores: CB<number[]>,

    yourField: <T>(path: string, defaultValue?: T | undefined) => [T, CB<T>],
    globalField: <T>(path: string, defaultValue?: T | undefined) => [T, CB<T>],
    allPlayersField: <T>(path: string) => [T[], (p: string, v: T) => void],
    endYourTurn: () => void,
}> = props => {
    const { players, dice } = props;

    const upperTotals = props.allNumberScores.map(sumDice);
    const upperBonuses = upperTotals.map(t => t >= 63 ? 35 : undefined);
    const upperFull = upperTotals.map((t, i) => t + (upperBonuses[i] || 0));

    const [kind3] = props.allPlayersField<number>(kind3path);
    const [kind4] = props.allPlayersField<number>(kind4path);

    const [fullhouse] = props.allPlayersField<number>(fullhousePath);
    const [straight4] = props.allPlayersField<number>(straight4path);
    const [straight5] = props.allPlayersField<number>(straight5path);
    const [yeahtzee] = props.allPlayersField<number>(yeahtzeepath);
    const [chance] = props.allPlayersField<number>(chancePath);

    const lowerTotals = props.players.map((p, i) => {
        return (kind3[i] || 0) + (kind4[i] || 0) + (fullhouse[i] || 0) + (straight4[i] || 0) + (straight5[i] || 0) + (yeahtzee[i] || 0) + (chance[i] || 0);
    });


    return <div style={{ textAlign: "left" }}>
        <div>Upper Section</div>
        <PlayerRow names={players} />
        <NumberScoreRow numberIndex={1} {...props} />
        <NumberScoreRow numberIndex={2} {...props} />
        <NumberScoreRow numberIndex={3} {...props} />
        <NumberScoreRow numberIndex={4} {...props} />
        <NumberScoreRow numberIndex={5} {...props} />
        <NumberScoreRow numberIndex={6} {...props} />

        <Row>
            <Cell width={firstCellWidth}>Total Score:</Cell>
            {upperTotals.map((c, i) => <Cell key={i}>{c}</Cell>)}
        </Row>
        <Row>
            <Cell width={firstCellWidth}>Bonus:</Cell>
            {upperBonuses.map((c, i) => <Cell key={i}>{c}</Cell>)}
        </Row>
        <Row>
            <Cell width={firstCellWidth}>Total:</Cell>
            {upperFull.map((c, i) => <Cell key={i}>{c}</Cell>)}
        </Row>

        {/* <ScoreRow scores={scoreCard.Numbers[1]} name="Aces" onClick={() => setScoreCard({ ...scoreCard, Chance: dice?.filter(d => d==1).reduce((prev, cur) => (prev || 0) + cur) })}/> */}

        <div>Lower Section</div>
        <PathScoreRow {...props} name="3 of a kind" path={kind3path} valid={isXofKind(dice, 3)} wouldScore={sumDice(dice)} />
        <PathScoreRow {...props} name="4 of a kind" path={kind4path} valid={isXofKind(dice, 4)} wouldScore={sumDice(dice)} />

        <PathScoreRow {...props} name="Full House" path={fullhousePath} valid={isFullHouse(dice)} wouldScore={25} />

        <PathScoreRow {...props} name="Sm Straight (4)" path={straight4path} valid={isStraightX(dice, 4)} wouldScore={30} />
        <PathScoreRow {...props} name="Lg Straight (5)" path={straight5path} valid={isStraightX(dice, 5)} wouldScore={40} />

        <PathScoreRow {...props} name="Yeah! (5 of a kind)" path={yeahtzeepath} valid={isXofKind(dice, 5)} wouldScore={50} />

        <PathScoreRow {...props} name="Chance" path={chancePath} valid={true} wouldScore={sumDice(dice)} />

        <Row>
            <Cell width={firstCellWidth}>Lower Total:</Cell>
            {lowerTotals.map((c, i) => <Cell key={i}>{c}</Cell>)}
        </Row>
        <Row>
            <Cell width={firstCellWidth}>Grand Total:</Cell>
            {upperFull.map((c, i) => <Cell key={i}>{c + lowerTotals[i]}</Cell>)}
        </Row>

    </div>
}