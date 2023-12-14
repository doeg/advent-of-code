import { getInput } from "./utils";

const parseGrid = (): string[][] => {
  const input = getInput(__filename, false);
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
  const numberOfCols = grid[0].length;

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
      if (!cell) {
        console.log("no??");
      }
      const rotatedRow = col;
      const rotatedCol = numberOfCols - row - 1;
      rotated[rotatedRow][rotatedCol] = cell;
    }
  }

  return rotated;
};

const findEmptySpot = (gridRow: string[], col: number): number => {
  const cell = gridRow[col];
  if (cell !== "O") throw Error("Cannot move cell that isn't a round rock");

  // console.log(
  //   `Finding empty spot for ${cell} at ${col} in ${gridRow.join("")}`
  // );
  let newCol = col;
  let nextCol = col + 1;

  while (nextCol < gridRow.length) {
    const nextCell = gridRow[nextCol];
    if (nextCell === "O" || nextCell === "#") break;
    newCol++;
    nextCol++;
  }

  // let nextCol = col;
  // for (let i = col; i < gridRow.length; i++) {
  //   const nextCell = gridRow[i];
  //   if (nextCell === "#" || nextCell === "O") {
  //     return nextCol;
  //   }
  //   nextCol += i;
  // }

  //   for (let i = gridRow.length - 1; i >= col; i--) {
  //     const spot = gridRow[i];
  //     if (spot === ".") return i;
  //   }
  return newCol;
};

const rollRight = (rotatedGrid: string[][]): string[][] => {
  // Make a copy of the grid and prepopulate the rows to make it
  // a bit easier to fill.
  const tiltedGrid: string[][] = [];
  for (let i = 0; i < rotatedGrid.length; i++) {
    tiltedGrid[i] = rotatedGrid[i];
  }

  // Go row-by-row in the rotated grid.
  for (let row = 0; row < rotatedGrid.length; row++) {
    const gridRow = rotatedGrid[row];

    // console.log("");
    // console.log("");
    // console.log("ROW", row);
    for (let col = gridRow.length - 1; col >= 0; col--) {
      // We're moving the item from the original grid, not the new one.
      const cell = gridRow[col];

      // Empty spaces + square rocks don't move.
      if (cell === "." || cell === "#") continue;

      // Use the row from the NEW grid
      const nextCol = findEmptySpot(tiltedGrid[row], col);
      // console.log(`Moving ${cell} from ${col} to ${nextCol}`);
      tiltedGrid[row][col] = ".";
      tiltedGrid[row][nextCol] = cell;

      // console.log(tiltedGrid[row].join(""));
      // console.log();
    }
  }

  return tiltedGrid;
};

// console.log(
//   rotateCW([
//     ["1", "2", "3", "W"],
//     ["4", "5", "6", "X"],
//     ["7", "8", "9", "Y"],
//     ["A", "B", "C", "Z"],
//   ])
// );

const duplicateGrid = (grid: string[][]): string[][] => {
  return grid.map((row) => [...row]);
};

const getScore = (grid: string[][]): number => {
  let score = 0;
  for (let row = 0; row < grid.length; row++) {
    const rowScore = grid.length - row;
    const numRocksOnRow = grid[row].filter((c) => c === "O").length;
    // console.log(row, numRocksOnRow, rowScore);
    score += rowScore * numRocksOnRow;
  }
  return score;
};

const tiltNorth = (grid: string[][]): string[][] => {
  // Rotate the grid CW so now all rocks are rolling to the right (east)
  return rotateCW(rotateCW(rotateCW(rollRight(rotateCW(grid)))));
};

const tiltWest = (grid: string[][]): string[][] => {
  return rotateCW(rotateCW(rollRight(rotateCW(rotateCW(grid)))));
};

const tiltSouth = (grid: string[][]): string[][] => {
  return rotateCW(rollRight(rotateCW(rotateCW(rotateCW(grid)))));
};

const tiltEast = (grid: string[][]): string[][] => {
  return rollRight(grid);
};

const partOne = () => {
  const grid = parseGrid();
  printGrid(grid);
  console.log("");
  const final = tiltNorth(grid);
  printGrid(final);

  console.log(getScore(final));
};

const partTwo = () => {
  const grid = parseGrid();

  // ((1000000000-116)%22)-1+95
  // (( total # of cycles - offset of beginning of cycle) % (length of cycle + 1)) - 1 + 95
  const cycles = 98;

  let nextGrid = grid;

  const patterns: string[] = [];

  // Each cycle tilts the platform four times so that the rounded rocks roll north,
  // then west, then south, then east. After each tilt, the rounded rocks roll as
  // far as they can before the platform tilts in the next direction.
  // After one cycle, the platform will have finished rolling the rounded rocks in
  // those four directions in that order.
  for (let cycle = 0; cycle < cycles; cycle++) {
    // console.log();
    console.log();
    console.log("CYCLE", cycle);
    // printGrid(grid);

    // nextGrid = tiltNorth(nextGrid);
    // nextGrid = rotateCW(rotateCW(rollRight(rotateCW(rotateCW(nextGrid)))));
    // nextGrid = rollRight(nextGrid);
    // nextGrid =
    // }

    const tiltedNorth = tiltNorth(nextGrid);
    // console.log();
    // console.log("NORTH");
    // printGrid(tiltedNorth);

    const tiltedWest = tiltWest(tiltedNorth);
    // console.log();
    // console.log("WEST");
    // printGrid(tiltedWest);

    const tiltedSouth = tiltSouth(tiltedWest);
    // console.log();
    // console.log("SOUTH");
    // printGrid(tiltedSouth);

    const tiltedEast = tiltEast(tiltedSouth);
    // console.log();
    // console.log("EAST");
    // printGrid(tiltedEast);

    nextGrid = tiltedEast;

    const pattern = nextGrid.reduce((acc, line) => {
      acc = `${acc}${line.join("")}`;
      return acc;
    }, "");

    console.log("Score:", getScore(nextGrid));

    const matchingPattern = patterns.findIndex((p) => p === pattern);
    if (matchingPattern >= 0)
      console.log("cycle", cycle, "matching pattern", matchingPattern);
    patterns.push(pattern);
  }

  console.log(getScore(nextGrid));
};

// partOne();
partTwo();
