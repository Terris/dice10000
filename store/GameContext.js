import { useReducer, createContext } from "react";
import GameReducer from "./GameReducer";
import { rollDie } from "../utils";

const initialState = {
  id: null,
  players: [
    {
      id: 0,
      name: "Player 1",
      score: 0,
    },
    {
      id: 1,
      name: "Player 2",
      score: 0,
    },
  ],
  dice: [
    { id: 1, value: 1, keep: false, locked: false },
    { id: 2, value: 2, keep: false, locked: false },
    { id: 3, value: 3, keep: false, locked: false },
    { id: 4, value: 4, keep: false, locked: false },
    { id: 5, value: 5, keep: false, locked: false },
    { id: 6, value: 6, keep: false, locked: false },
  ],
  turnStart: true,
  playerTurnId: 0,
  turnScore: 0,
  sweepScore: 0,
  rollScore: 0,
};

export const GameContext = createContext(initialState);

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GameReducer, initialState);

  // Actions
  function keepDie(dieId) {
    dispatch({
      type: "KEEP_DIE",
      payload: { dieId },
    });
  }

  function rollDice() {
    dispatch({
      type: "ROLL_DICE",
      payload: {},
    });
  }

  function stay(playerId) {
    dispatch({
      type: "STAY",
      payload: { playerId },
    });
  }

  return (
    <GameContext.Provider
      value={{
        game: state,
        stay,
        rollDice,
        keepDie,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
