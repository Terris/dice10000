import { GameProvider } from "../store/GameContext";
import { GameBoard } from "../components/GameBoard.js";

const Game = () => {
  return (
    <GameProvider>
      <h2>Game page</h2>
      <hr />
      <GameBoard />
    </GameProvider>
  );
};

export default Game;
