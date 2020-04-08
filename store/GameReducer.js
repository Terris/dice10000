import { rollDie } from "../utils";

// UTILS
// --------------------------------
const getPlayerIndex = (state) =>
  state.players.findIndex((player) => player.id === state.playerTurnId);

const getDieIndex = (state, action) =>
  state.dice.findIndex((die) => die.id === action.payload.dieId);

const getPlayerScore = (state) => state.players[getPlayerIndex(state)].score;

const getKeptDice = (state) =>
  state.dice.filter((die) => die.keep && !die.locked);

const mapHand = (values) => {
  const result = {};
  values.forEach((value) => {
    if (result[value]) {
      result[value]++;
    } else {
      result[value] = 1;
    }
  });
  return result;
};

const calculateRollScore = (state) => {
  let score = 0;
  const values = getKeptDice(state).map((die) => die.value);
  const handMap = mapHand(values);
  const handMapValues = Object.values(handMap);
  // if straight || pairs
  if (
    handMapValues.length === 6 ||
    (handMapValues.length === 3 && handMapValues.every((val) => val === 2))
  ) {
    return 1500;
  }
  // score for triples, 1s& 5s
  for (let dieKey in handMap) {
    const dieKeyInt = parseInt(dieKey);
    // if triple or better
    if (handMap[dieKey] >= 3) {
      const multiplier = dieKeyInt === 1 ? 1000 : 100;
      score += dieKeyInt * multiplier * (handMap[dieKey] - 2);
    } else {
      // score for 1s & 5s
      if (dieKeyInt === 1) {
        score += handMap[dieKey] * 100;
      } else if (dieKeyInt === 5) {
        score += handMap[dieKey] * 50;
      }
    }
  }
  return score;
};

const calculateTurnScore = (state) => {
  const { turnScore, sweepScore } = state;
  return turnScore + sweepScore + calculateRollScore(state);
};

const resetAllScores = (state) => {
  state.rollScore = 0;
  state.sweepScore = 0;
  state.turnScore = 0;
};

const resetDice = (state) => {
  state.dice.forEach((die) => {
    die.keep = false;
    die.locked = false;
  });
};

// SET STATE
// --------------------------------

const rollDice = (state) => {
  // if all six dice are kept
  const keptOrLockedDice = state.dice.filter((die) => die.locked || die.keep);
  if (keptOrLockedDice.length === 6) {
    // set turnScore, reset sweepScore
    state.turnScore = calculateTurnScore(state);
    state.sweepScore = 0;
    // and unlock/unkeep all dice
    resetDice(state);
  } else {
    // update sweep score
    state.sweepScore = state.sweepScore + calculateRollScore(state);
  }
  // reset roll score
  state.rollScore = 0;
  // roll or lock dice
  state.dice.forEach((die) => {
    if (die.keep === false) {
      die.value = rollDie();
    } else {
      die.locked = true;
    }
  });
  return { ...state };
};

const toggleKeep = (state, action) => {
  const dieIndex = getDieIndex(state, action);
  // toggle keep value if not locked
  if (!state.dice[dieIndex].locked) {
    state.dice[dieIndex].keep = state.dice[dieIndex].keep ? false : true;
    // set rollScore
    state.rollScore = calculateRollScore(state);
  }
  return { ...state };
};

const recordScore = (state, action) => {
  // update player score
  state.players[getPlayerIndex(state)].score =
    calculateTurnScore(state) + getPlayerScore(state);
  resetAllScores(state);
  resetDice(state);
  return { ...state };
};

// REDUCER
// --------------------------------
export default (state, action) => {
  switch (action.type) {
    case "ROLL_DICE":
      return rollDice(state);
    case "KEEP_DIE":
      return toggleKeep(state, action);
    case "STAY":
      return recordScore(state, action);
    case "RESET":
      return init(action.payload);
    default:
      return state;
  }
};
