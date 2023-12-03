import { getInput } from "./utils";

const input = getInput(__filename, false);

const matrix = input.split("\n").map((line) => {
  return line.split("");
});

const printMatrix = (m: any[][]) => {
  m.forEach((line) => {
    line.forEach((char) => {
      process.stdout.write(`${char} `);
    });
    process.stdout.write("\n");
  });
};
printMatrix(matrix);

const matrixOfNumbers: string[][] = [];

const numbersByID: { [k: string]: number } = {};
const makeID = (row, col, number) => `${row}__${col}__${number}`;

let row = 0;
while (row < matrix.length) {
  //   console.log("\nROW", row);

  // Initialize the matrixOfNumbers row as an array so we can read/write it.
  matrixOfNumbers[row] = [];

  const line = matrix[row];

  let col = 0;

  while (col < line.length) {
    const cell = line[col];

    if (isNaN(parseInt(cell))) {
      col++;
      matrixOfNumbers[row][col] = "";
      continue;
    }

    // This cell is a number.
    // Get the substring starting at the beginning of the number
    const substr = line.join("").substring(col);

    // Extract the number
    const match = substr.match(/\d+/);
    if (!match) {
      throw Error("could not extract number from substring");
    }

    const num = match[0];
    const int = parseInt(num);
    // console.log(substr, int, col, num.length);

    for (let i = 0; i < num.length; i++) {
      matrixOfNumbers[row][col + i] = makeID(row, col, num);
    }

    col += num.length;
  }

  row++;
}

console.log("MATRIX OF NMBERS");
printMatrix(matrixOfNumbers);

const isCellNumber = (row: number, col: number): boolean => {
  if (row >= matrixOfNumbers.length) return false;
  if (row < 0) return false;

  if (col >= matrixOfNumbers[row].length) return false;
  if (col < 0) return false;

  const cell = matrixOfNumbers[row][col];
  if (!cell || cell === "") return false;
  return true;
};

// Returns true if any direction is a symbol
const checkDirections = (row: number, col: number): string[] => {
  let matchCounts: string[] = [];
  // North
  if (isCellNumber(row - 1, col)) {
    matchCounts.push(matrixOfNumbers[row - 1][col]);
  }

  // Northeast
  if (isCellNumber(row - 1, col + 1)) {
    matchCounts.push(matrixOfNumbers[row - 1][col + 1]);
  }

  // East
  if (isCellNumber(row, col + 1)) {
    matchCounts.push(matrixOfNumbers[row][col + 1]);
  }

  // Southeast
  if (isCellNumber(row + 1, col + 1)) {
    matchCounts.push(matrixOfNumbers[row + 1][col + 1]);
  }

  // South
  if (isCellNumber(row + 1, col)) {
    matchCounts.push(matrixOfNumbers[row + 1][col]);
  }

  // Southwest
  if (isCellNumber(row + 1, col - 1)) {
    matchCounts.push(matrixOfNumbers[row + 1][col - 1]);
  }

  // West
  if (isCellNumber(row, col - 1)) {
    matchCounts.push(matrixOfNumbers[row][col - 1]);
  }

  // Northwest
  if (isCellNumber(row - 1, col - 1)) {
    matchCounts.push(matrixOfNumbers[row - 1][col - 1]);
  }

  return matchCounts;
};

let sum = 0;
for (let row = 0; row < matrix.length; row++) {
  for (let col = 0; col < matrix[row].length; col++) {
    const cell = matrix[row][col];
    if (cell !== "*") continue;

    let matchCounts = checkDirections(row, col);
    const matchSet = [...new Set(matchCounts)];

    // if (matchSet.size != 2) continue;
    if (matchSet.length !== 2) continue;
    console.log("* found at", row, col, matchSet);
    let mx = 1;
    matchSet.forEach((m) => {
      const ps = m.split("__");
      const i = parseInt(ps[2]);
      mx *= i;
    });

    sum += mx;
  }
}

console.log(sum);
