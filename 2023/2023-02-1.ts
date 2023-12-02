import { getInput } from "./utils";

const input = getInput(__filename);

const TOTALS = {
  red: 12,
  green: 13,
  blue: 14,
};

const sum = input.split("\n").reduce((acc, line) => {
  if (!line) return acc;

  const [prefix, counts] = line.split(":");

  const gameNumber = parseInt((prefix.match(/^\D+(\d+)/) || [])[1]);
  if (isNaN(gameNumber)) {
    throw Error(`Could not parse game number: ${gameNumber}`);
  }

  let shouldCount = true;

  const rounds = counts.split(";");
  rounds.forEach((round) => {
    if (!shouldCount) return;

    Object.keys(TOTALS).forEach((color) => {
      const re = RegExp(`(\\\d+) ${color}`);
      const count = parseInt((re.exec(round) || [])[1]);
      if (isNaN(count)) return;

      if (count > TOTALS[color]) {
        shouldCount = false;
        return;
      }
    });
  });

  if (shouldCount) {
    acc += gameNumber;
  }

  return acc;
}, 0);

console.log(sum);
