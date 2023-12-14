import { getInput } from "./utils";

const parseGrid = (): string[][] => {
  const input = getInput(__filename, true);
  const lines = input.split("\n");

  const grid: string[][] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    grid[i] = lines[i].split("");
  }
  return grid;
};

const printGrid = (grid: string[][]) => {
  grid.forEach((line) => {
    console.log(line.join(""));
  });
};

const rotateCW = (grid: string[][]): string[][] => {
  const numberOfRows = grid.length;
  const maxRow = numberOfRows - 1;

  const numberOfCols = grid[0].length;
  const maxCol = numberOfCols - 1;

  // Prepopulate the rotated grid with the number of rows
  // that is equivalent ot the length of a given column
  // in the original grid.
  const rotated: string[][] = [];
  for (let i = 0; i < grid[0].length; i++) {
    rotated[i] = [];
  }

  // For each row in the original grid...
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];

      const rotatedRow = col;
      const rotatedCol = numberOfCols - row;

      console.log(`${cell} -> ${row},${col} -> ${rotatedRow},${rotatedCol}`);

      rotated[rotatedRow][rotatedCol] = cell;
    }
  }

  //   for (let row = 0; row < grid.length; row++) {
  //     // Get the row from the original grid
  //     const gridRow = grid[row];

  //     const newCol = lastCol - row;

  //     for (let i = 0; i < gridRow.length; i++) {
  //       const cell = gridRow[i];

  //       for (let j = 0; j < grid.length; j++) {
  //         rotated[j][newCol] = cell;
  //       }
  //     }
  //   }

  return rotated;
};

const tiltNorth = (grid: string[][]): string[][] => {
  // Make a copy of the grid
  const tiltedGrid: string[][] = [];

  for (let row = 0; row < grid.length; row++) {
    // tiltedGrid[row] = [];
    tiltedGrid[row] = [...grid[row]];

    // Nothing on row 0 can roll anywhere
    if (row === 0) {
      tiltedGrid[0] = [...grid[0]];
      continue;
    }

    for (let col = 0; col < grid[row].length; col++) {
      const currentCell = tiltedGrid[row][col];
      const northernCell = tiltedGrid[row - 1][col];

      // If the current cell is a square rock or empty ground,
      // those don't move so it's a no-op.
      if (currentCell === "#" || currentCell === ".") {
        tiltedGrid[row][col] = currentCell;
        continue;
      }

      if (currentCell !== "O") {
        console.log(currentCell, row, col);
        printGrid(tiltedGrid);
        throw Error("Invalid character");
      }

      // The current cell, a rounded rock, is blocked from moving north, so we leave it
      // where it is.
      if (northernCell === "O" || northernCell === "#") {
        tiltedGrid[row][col] = currentCell;
        continue;
      }

      console.log("Rock at", row, ",", col, "can roll north");
      tiltedGrid[row - 1][col] = currentCell;
      tiltedGrid[row][col] = ".";
    }
  }

  return tiltedGrid;
};

const grid = parseGrid();
printGrid(grid);

console.log("");

// const grid = [
//   ["1", "2", "3", "X"],
//   ["4", "5", "6", "Y"],
//   ["7", "8", "9", "Z"],
//   ["A", "B", "C", "W"],
// ];
// printGrid(grid);
// console.log();

const rotated = rotateCW(grid);
printGrid(rotated);

// const tiltedNorth = tiltNorth(grid);
// printGrid(tiltedNorth);
