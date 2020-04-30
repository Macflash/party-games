import React from "react";
import { IGameComponentProps } from "../lobby/game";
import { getGameData, getYours, IncrementNextToPlayer, setYours, getIsYourTurn, getCurrentPlayerIndex, shouldPlayAi } from "../utils/playerUtils";
import { Header, border } from "../basic/basics";
import { CB } from "../generic/apis";

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

function createArray<T extends object | number | string>(num: number, initial?: () => T): T[] {
    var arr = new Array(num);
    for (var i = 0; i < num; i++) {
        arr[i] = initial?.() ?? 0;
    }

    return arr;
}

const RollX: React.FC<IGameComponentProps<IRollXGameData>> = props => {
    const { game, yourName, updateGame } = props;
    game.nextToPlay = game.nextToPlay ?? game.players[0].name;
    const isYourTurn = getIsYourTurn(game, yourName);
    const { dice = createArray(5, () => 0), rolls = 3, diceNumber = 5, scores = createArray<RollXScore>(game.players.length, () => ({ Numbers: [] })) } = getGameData(game);

    const yourScoreCard = getYours(game, yourName, scores);
    console.log("getting scores", scores, yourScoreCard);

    const playAi = shouldPlayAi(game, yourName);
    React.useEffect(()=>{
        if(playAi){
            console.log("playing AI turn!");
            props.updateGame(IncrementNextToPlayer(game));
        }
    }, [playAi])

    return (
        <div>
            {isYourTurn ? <Header>It's your turn!</Header> : <Header>It's {game.nextToPlay}'s turn.</Header>}
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <ScoreCard
                    currentPlayerIndex={getCurrentPlayerIndex(game)}
                    yourName={yourName}
                    players={game.players.map(p => p.name)}
                    scoreCards={scores}
                    dice={dice}
                    setScoreCards={newScores => {
                        console.log("setting scores", newScores);
                        var data = getGameData(game);
                        data.scores = newScores; //setYours(game, yourName, scores, newScore);
                        data.rolls = 3;
                        data.dice = createArray(diceNumber, ()=>0);
                        game.objectData = data;
                        IncrementNextToPlayer(game);
                        updateGame(game);
                    }}
                />
                <DiceArea
                    isYourTurn={isYourTurn}
                    dice={dice}
                    setDice={newdice => {
                        var data = getGameData(game);
                        data.dice = newdice;
                        game.objectData = data;
                        updateGame(game);
                    }}
                    rolls={rolls}
                    setRolls={newrolls => {
                        var data = getGameData(game);
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
        <Cell width={150} />
        {props.names.map((n, i) => <Cell key={i}>{n}</Cell>)}
    </Row>
}

export const ScoreRow: React.FC<{ name: string, scores: (number | undefined | false)[], onClick?: () => void }> = props => {
    return <Row>
        <Cell width={150}>{props.name}:</Cell>
        {props.scores.map((score, i) => <Cell key={i}>{score === false || score == undefined ? null : score}</Cell>)}
    </Row>
}

export function sumNumberDice(dice:Dice, validNumber: number){
    return sumDice(dice.filter(d => d == validNumber));
}

export function sumDice(dice:Dice){
    if(!dice || dice.length <= 0){ return 0;}

    return dice.reduce((p, c) => c + (p || 0));
}

export const NumberScoreRow: React.FC<{ dice: Dice, isYourTurn: boolean, turnIndex: number, numberIndex: number, scores: RollXScore[], onClick?: () => void, setScoreCards: CB<RollXScore[]> }> = props => {
    console.log(props.scores);
    const clickable = props.isYourTurn && props.scores[props.turnIndex]?.Numbers?.[props.numberIndex] == undefined;

    return <Row onClick={clickable ? () => {
        var newScores = [...props.scores];
        newScores[props.turnIndex].Numbers[props.numberIndex] = sumNumberDice(props.dice, props.numberIndex);
        props.setScoreCards(newScores);
    } : undefined}>
        <Cell width={150}>{props.numberIndex}:</Cell>
        {props.scores.map((score) => <Cell>{score.Numbers[props.numberIndex]}</Cell>)}
    </Row>
}

export const ScoreCard: React.FC<{ players: string[], scoreCards: RollXScore[], setScoreCards: CB<RollXScore[]>, dice: number[], yourName: string, currentPlayerIndex: number }> = props => {
    const isYourTurn = props.yourName == props.players[props.currentPlayerIndex];
    return <div style={{ textAlign: "left" }}>
        <div>Upper Section</div>
        <PlayerRow names={props.players} />
        <NumberScoreRow numberIndex={1} dice={props.dice} isYourTurn={isYourTurn} turnIndex={props.currentPlayerIndex} scores={props.scoreCards} setScoreCards={props.setScoreCards} />
        <NumberScoreRow numberIndex={2} dice={props.dice} isYourTurn={isYourTurn} turnIndex={props.currentPlayerIndex} scores={props.scoreCards} setScoreCards={props.setScoreCards} />
        <NumberScoreRow numberIndex={3} dice={props.dice} isYourTurn={isYourTurn} turnIndex={props.currentPlayerIndex} scores={props.scoreCards} setScoreCards={props.setScoreCards} />
        <NumberScoreRow numberIndex={4} dice={props.dice} isYourTurn={isYourTurn} turnIndex={props.currentPlayerIndex} scores={props.scoreCards} setScoreCards={props.setScoreCards} />
        <NumberScoreRow numberIndex={5} dice={props.dice} isYourTurn={isYourTurn} turnIndex={props.currentPlayerIndex} scores={props.scoreCards} setScoreCards={props.setScoreCards} />
        <NumberScoreRow numberIndex={6} dice={props.dice} isYourTurn={isYourTurn} turnIndex={props.currentPlayerIndex} scores={props.scoreCards} setScoreCards={props.setScoreCards} />

        {/* <ScoreRow scores={props.scoreCard.Numbers[1]} name="Aces" onClick={() => props.setScoreCard({ ...props.scoreCard, Chance: props.dice?.filter(d => d==1).reduce((prev, cur) => (prev || 0) + cur) })}/> */}

        <div>Lower Section</div>
        <PlayerRow names={props.players} />
        <ScoreRow scores={props.scoreCards.map(s => s.ThreeKind)} name="3 of a kind" />
        <ScoreRow scores={props.scoreCards.map(s => s.FourKind)} name="4 of a kind" />
        <ScoreRow scores={props.scoreCards.map(s => s.FullHouse && 25)} name="Full House" />
        <ScoreRow scores={props.scoreCards.map(s => s.FullHouse && 30)} name="Small Straight (4)" />
        <ScoreRow scores={props.scoreCards.map(s => s.FullHouse && 40)} name="Large Straight (5)" />
        <ScoreRow scores={props.scoreCards.map(s => s.Yeahtzee && 50)} name="Yeahtzee" />
        <ScoreRow scores={props.scoreCards.map(s => s.Chance)} name="Chance" />
        {/* <ScoreRow scores={props.scoreCards.map(s => s.Chance)} name="Chance" onClick={() => props.setScoreCard({ ...props.scoreCard, Chance: props.dice?.reduce((prev, cur) => (prev || 0) + cur) })} /> */}
    </div>
}