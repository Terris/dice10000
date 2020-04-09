import { useContext, useState } from "react";
import { GameContext } from "../store/GameContext";
import { Die } from "./Die";
export const GameBoard = () => {
  const { game, stay, rollDice } = useContext(GameContext);
  const {
    players,
    dice,
    playerTurnId,
    rollScore,
    sweepScore,
    turnScore,
    turnStart,
  } = game;

  return (
    <>
      <h3>Scores:</h3>
      <ul>
        {players.map((player) => (
          <li
            key={player.id}
            className={`player ${
              player.id === playerTurnId ? "player-turn" : ""
            }`}
          >
            {player.name}: {player.score}
          </li>
        ))}
      </ul>
      <h3>Turn Scores:</h3>
      <p>
        Roll Score: {rollScore} | Sweep Score: {sweepScore} | Turn Score:{" "}
        {turnScore}
      </p>
      <h3>Dice:</h3>
      <div className={`dice ${turnStart ? "dice-turnstart" : ""}`}>
        {dice.map((die) => (
          <Die key={die.id} die={die} />
        ))}
      </div>
      <div className="controls">
        <button onClick={() => rollDice()} className="btn">
          Roll
        </button>
        <button
          onClick={() => stay(0)}
          className="btn"
          disabled={
            turnStart === true ||
            (rollScore === 0 && sweepScore === 0 && turnScore === 0)
          }
        >
          Stay
        </button>
      </div>
      <style jsx>{`
        .player.player-turn {
          background: green;
        }
        .dice {
          display: flex;
          padding: 1rem 10px;
        }
        .dice.dice-turnstart {
          pointer-events: none;
          background: #4e3a3a;
          cursor: not-allowed;
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
