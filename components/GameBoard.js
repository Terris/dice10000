import { useContext, useState } from "react";
import { GameContext } from "../store/GameContext";
import { Die } from "./Die";
export const GameBoard = () => {
  const { game, stay, rollDice } = useContext(GameContext);
  const { players, dice, rollScore, sweepScore, turnScore } = game;

  return (
    <>
      <h3>Scores:</h3>
      <p>
        {players[0].name}: {JSON.stringify(players[0].score)}
      </p>
      <p>
        Roll Score: {rollScore} | Sweep Score: {sweepScore} | Turn Score:{" "}
        {turnScore}
      </p>
      <h3>Dice:</h3>
      <div className="dice">
        {dice.map((die) => (
          <Die key={die.id} die={die} />
        ))}
      </div>
      <div className="controls">
        <button onClick={() => rollDice()} className="btn">
          Roll
        </button>
        <button onClick={() => stay(0)} className="btn">
          Stay
        </button>
      </div>
      <style jsx>{`
        .dice {
          display: flex;
          padding: 1rem 10px;
        }
        .controls {
          display: flex;
          padding: 10px 1rem;
        }
        .controls .btn {
          margin-right: 20px;
        }
      `}</style>
    </>
  );
};
