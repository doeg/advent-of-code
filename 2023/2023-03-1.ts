import { getInput } from "./utils";

const input = getInput(__filename, false);

const matrix = input.split("\n").map((line) => {
  return line.split("");
});

const printMatrix = () => {
  matrix.forEach((line) => {
    line.forEach((char) => {
      process.stdout.write(char);
    });
    process.stdout.write("\n");
  });
};

// Returns true if the cell at matrix[row][col] is a symbol (other than ".").
// Returns false if the cell is a symbol or a ".", or if it's out of bounds.
const isCellSymbol = (row: number, col: number): boolean => {
  if (row >= matrix.length) return false;
  if (row < 0) return false;

  if (col >= matrix[row].length) return false;
  if (col < 0) return false;

  const cell = matrix[row][col];
  if (!isNaN(parseInt(cell))) return false;
  if (cell === ".") return false;

  return true;
};

printMatrix();

const log = (...str) => {
  if (false) console.log(str);
};

// Returns true if any direction is a symbol
const checkDirections = (row: number, col: number): boolean => {
  // North
  if (isCellSymbol(row - 1, col)) {
    log("match found north");
    return true;
  }

  // Northeast
  if (isCellSymbol(row - 1, col + 1)) {
    log("match found northeast");
    return true;
  }

  // East
  if (isCellSymbol(row, col + 1)) {
    log("match found east");
    return true;
  }

  // Southeast
  if (isCellSymbol(row + 1, col + 1)) {
    return true;
  }

  // South
  if (isCellSymbol(row + 1, col)) {
    return true;
  }

  // Southwest
  if (isCellSymbol(row + 1, col - 1)) {
    return true;
  }

  // West
  if (isCellSymbol(row, col - 1)) {
    return true;
  }

  // Northwest
  if (isCellSymbol(row - 1, col - 1)) {
    return true;
  }

  return false;
};

let sum = 0;

let row = 0;
while (row < matrix.length) {
  console.log("\nROW", row);
  //   if (row > 3) break;
  let col = 0;
  const line = matrix[row];

  while (col < matrix[row].length) {
    const cell = line[col];
    const int = parseInt(cell);

    // The cell is not a number; continue to the next cell
    if (isNaN(int)) {
      col++;
      continue;
    }

    // Get the substring starting at the beginning of the number
    const substr = line.join("").substring(col);

    // Extract the number
    const match = substr.match(/\d+/);
    if (!match) {
      throw Error("could not extract number from substring");
    }

    const num = match[0];
    let hasAnyMatches = false;

    // Check all digits of the number
    for (let i = 0; i < num.length; i++) {
      hasAnyMatches = hasAnyMatches || checkDirections(row, col + i);
    }

    if (hasAnyMatches) {
      console.log("found", parseInt(num), `at ${row},${col}`, num.length);
      sum += parseInt(num);
    }

    col += num.length;
  }

  row++;
}

console.log(sum);
