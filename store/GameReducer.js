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
  const values = getKeptDice(state).map((die) => die.value);
  const handMap = mapHand(values);
  const handMapValues = Object.values(handMap);
  // if straight || pairs
  if (hasStraightOrPairs(handMapValues)) {
    return 1500;
  }
  // score for triples, 1s& 5s
  let score = 0;
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

const hasStraightOrPairs = (values) => {
  return (
    values.length === 6 ||
    (values.length === 3 && values.every((val) => val === 2)) ||
    (values.length === 2 && values.some((val) => val === 4))
  );
};

const hasScoringSingleton = (values) =>
  values.some((key) => key === 1 || key === 5);

const rollHasHand = (state) => {
  const availableDice = state.dice.filter((die) => !die.locked);
  const values = availableDice.map((die) => die.value);
  const handMap = mapHand(values);
  const handMapValues = Object.values(handMap);
  // if straight || pairs || contains 1 or 2
  if (hasStraightOrPairs(handMapValues) || hasScoringSingleton(values)) {
    return true;
  }
  return false;
};

const endTurn = (state) => {
  // resetDice
  resetDice(state);
  // reset all turn scores
  resetAllScores(state);
  // set turnStart to true
  state.turnStart = true;
  // set turnPlayerId to next player
  const lastPlayerIndex = state.players.findIndex(
    (player) => player.id === state.playerTurnId
  );
  // if the last player is last in players collection
  if (lastPlayerIndex === state.players.length - 1) {
    state.playerTurnId = 0;
  } else {
    state.playerTurnId = state.players[lastPlayerIndex + 1].id;
  }
};

const validateKeepable = (state, die) => {
  const values = state.dice.map((d) => d.value);
  let handMap = mapHand(values);
  // if this die value is part of a straight, pair, triples, or is a 1 or a 5
  return (
    handMap[die.value] >= 3 ||
    hasStraightOrPairs(Object.values(handMap)) ||
    die.value === 1 ||
    die.value === 5
  );
};

// SET STATE
// --------------------------------

const rollDice = (state) => {
  // validate it's not the first roll or at least one kept die
  const keptOrLockedDice = state.dice.filter((die) => die.locked || die.keep);
  if (!state.turnStart && keptOrLockedDice.length === 0) {
    return { ...state };
  }
  // if first roll of turn, toggle false
  if (state.turnStart) {
    state.turnStart = false;
  }

  // if all six dice are kept or locked
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
  // check for hands
  if (!rollHasHand(state)) {
    endTurn(state);
  }
  return { ...state };
};

const toggleKeep = (state, action) => {
  const dieIndex = getDieIndex(state, action);
  const die = state.dice[dieIndex];
  // toggle keep value if not locked
  if (!die.locked) {
    if (!die.keep) {
      // validate keepable
      console.log(validateKeepable(state, die));
      if (validateKeepable(state, die)) {
        die.keep = true;
      } else {
        return { ...state };
      }
    } else {
      die.keep = false;
    }
    // set rollScore
    state.rollScore = calculateRollScore(state);
  }
  return { ...state };
};

const stay = (state, action) => {
  // update player score
  state.players[getPlayerIndex(state)].score =
    calculateTurnScore(state) + getPlayerScore(state);
  endTurn(state);
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
      return stay(state, action);
    case "RESET":
      return init(action.payload);
    default:
      return state;
  }
};
