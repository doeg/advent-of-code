import { getInput } from "./utils";

const input = getInput(__filename, false);

let sum = 0;

// Index is card number, value is number of copies of that card.
let cardCopies: { [k: number]: number } = {};

input.split("\n").forEach((line, idx) => {
  if (!line) return;

  console.log(line);

  const [prefix, lists] = line.split(":");
  const [winning, card] = lists.split("|");

  // Parse the card number
  const cardNumber = parseInt((/(\d+)/.exec(prefix) || [])[1]);
  if (isNaN(cardNumber)) {
    throw Error(`Could not parse card number from line: ${line}`);
  }

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

  if (!matches.length) {
    const adder = 1 + (cardCopies[cardNumber] || 0);
    console.log("no matches", adder);
    sum = sum + adder;
    return;
  }

  // The total number of cards for this card number
  const cardCountForNumber = (cardCopies[cardNumber] || 0) + 1;

  console.log(
    "card",
    cardNumber,
    "matches",
    matches.length,
    "copies",
    cardCountForNumber
  );

  for (let m = 1; m <= matches.length; m++) {
    const mi = cardNumber + m;
    if (!(mi in cardCopies)) cardCopies[mi] = 0;
    cardCopies[mi] = cardCopies[mi] + cardCountForNumber;
  }

  console.log(cardCopies);
});

console.log(cardCopies);
const result = Object.values(cardCopies).reduce((acc, n) => {
  return (acc += n);
}, 0);

const lineCount = input.split("\n").reduce((acc, n) => {
  if (!n) return acc;
  return acc + 1;
}, 0);
console.log(lineCount);

console.log(result + lineCount);
