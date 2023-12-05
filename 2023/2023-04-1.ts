import { getInput } from "./utils";

const input = getInput(__filename, false);

let sum = 0;

input.split("\n").forEach((line, idx) => {
  if (!line) return;
  //   const re = /Card (\d+)/.exec(line);
  //   console.log(re);
  const [prefix, lists] = line.split(":");
  const [winning, card] = lists.split("|");

  const winningNumbers = winning.split(/\s+/).reduce((acc, n) => {
    if (!n) return acc;
    acc.push(parseInt(n));
    return acc;
  }, [] as number[]);

  const matches = card.split(/\s+/).filter((n) => {
    const i = parseInt(n);
    if (isNaN(i)) return false;

    return winningNumbers.indexOf(i) >= 0;
  });

  if (!matches.length) return;

  const val = Math.pow(2, matches.length - 1);
  sum += val;
  console.log(prefix, winning, card, matches.length, val);
});

console.log(sum);
