export const rollDie = () => {
  let min = 1;
  let max = 6;
  return Math.floor(Math.random() * (max - min)) + min;
};
