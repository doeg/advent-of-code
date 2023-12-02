import { getInput } from "./utils";

const input = getInput(__filename);

const COLORS = ["red", "green", "blue"];

const sum = input.split("\n").reduce((acc, line) => {
  if (!line) return acc;
  const [_, counts] = line.split(":");
  const rounds = counts.split(";");

  const minimums: { [k: string]: number } = {};

  rounds.forEach((round) => {
    COLORS.forEach((color) => {
      const re = RegExp(`(\\\d+) ${color}`);
      const count = parseInt((re.exec(round) || [])[1]);
      if (isNaN(count)) return;

      if (!(color in minimums)) {
        minimums[color] = count;
      } else if (count > minimums[color]) {
        minimums[color] = count;
      }
    });
  });

  const power = Object.values(minimums).reduce((macc, m) => {
    return macc * m;
  }, 1);

  return (acc += power);
}, 0);

console.log(sum);
