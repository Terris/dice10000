import { useContext } from "react";
import { GameContext } from "../store/GameContext";

export const Die = ({ die }) => {
  const { keepDie } = useContext(GameContext);
  return (
    <button
      className={`die ${die.keep ? "die-keep" : ""} ${
        die.locked ? "die-locked" : ""
      }`}
      onClick={() => keepDie(die.id)}
    >
      {die.value}
      <style jsx>{`
        .die {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;
          height: 60px;
          margin: 10px;
          background: #fff;
          border-radius: 6px;
          color: #444;
          font-weight: 700;
        }
        .die.die-keep {
          background: #c7c7c7;
        }
        .die.die-locked {
          background: #888787;
        }
      `}</style>
    </button>
  );
};
