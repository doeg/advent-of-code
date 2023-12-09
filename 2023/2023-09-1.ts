import { getInput } from "./utils";

const input = getInput(__filename, false);

const lines = input.split("\n").reduce((acc, line) => {
  if (!line) return acc;
  const numbers = line.split(" ").map((i) => parseInt(i));
  acc.push(numbers);
  return acc;
}, [] as number[][]);

// Returns an array of differences for a single line.
// For example: [ 0, 3, 6, 9, 12, 15 ] -> [ 3, 3, 3, 3, 3 ]
const getDifferences = (numbers: number[]): number[] => {
  const differences: number[] = [];
  for (let i = 1; i < numbers.length; i++) {
    const first = numbers[i - 1];
    const second = numbers[i];
    differences.push(second - first);
  }
  return differences;
};

let sum = 0;

for (let l = 0; l < lines.length; l++) {
  const line = lines[l];

  // Reconcile each line of differences until all values are 0.
  let allZeroes = false;
  let allDifferences: number[][] = [line];

  while (!allZeroes) {
    const nextInput = allDifferences[allDifferences.length - 1];
    const differences = getDifferences(nextInput);
    allDifferences.push(differences);
    allZeroes = differences.every((i) => i === 0);
  }

  // Figure out the next value in each sequence from the bottom up.
  for (let i = allDifferences.length - 1; i >= 0; i--) {
    const currentLine = allDifferences[i];
    const currentLastValue = currentLine[currentLine.length - 1];

    if (currentLastValue === 0) {
      allDifferences[i].push(currentLastValue);
      continue;
    }

    const previousLine = allDifferences[i + 1];
    const previousLastValue = previousLine[previousLine.length - 1];

    const newLastValue = currentLastValue + previousLastValue;
    allDifferences[i].push(newLastValue);
  }

  const lastLine = allDifferences[0];
  const lastVal = lastLine[lastLine.length - 1];
  sum += lastVal;
}

console.log(sum);
