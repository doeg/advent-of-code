import { getInput } from "./utils";
import chalk from "chalk";

interface GridNode {
  galaxy: number;
  char: string;
  row: number;
  col: number;
  visited: boolean;
}

type Grid = GridNode[][];

// Returns a grid of grid nodes, plus an array of all galaxies
const parseInput = (): { grid: Grid; galaxies: GridNode[] } => {
  const input = getInput(__filename, true);
  const galaxies: GridNode[] = [];

  let galaxyCounter = 1;

  const grid: Grid = input.split("\n").reduce((acc, line, row) => {
    if (!line) return acc;

    acc[row] = [];

    const cells = line.split("");
    cells.forEach((char, col) => {
      const n = {
        char,
        col,
        galaxy: char === "#" ? galaxyCounter++ : 0,
        row,
        visited: false,
      };
      acc[row].push(n);

      if (n.galaxy) galaxies.push(n);
    });

    return acc;
  }, [] as Grid);

  return { grid, galaxies };
};

const printGrid = (grid: Grid) => {
  for (let row = 0; row < grid.length; row++) {
    const output: string[] = [];
    for (let col = 0; col < grid[row].length; col++) {
      const n = grid[row][col];
      if (!!n.galaxy) {
        output.push(chalk.bgCyanBright(chalk.white(n.galaxy)));
        continue;
      } else {
        const str = n.visited ? "#" : ".";
        output.push(chalk.gray(str));
      }
    }
    console.log(output.join(""));
  }
};

// Returns a deep clone of the given grid.
const duplicateGrid = (grid: Grid): Grid => {
  const newGrid: Grid = [];
  for (let row = 0; row < grid.length; row++) {
    newGrid[row] = [];
    for (let col = 0; col < grid[row].length; col++) {
      // TODO this wont work if adding nested data structures
      newGrid[row][col] = { ...grid[row][col] };
    }
  }
  return newGrid;
};

const inflateGrid = (grid: Grid): Grid => {
  const emptyRows: { [k: number]: boolean } = {};

  // Check row-by-row
  for (let row = 0; row < grid.length; row++) {
    const allEmpty = grid[row].every((n) => n.galaxy === 0);
    if (allEmpty) emptyRows[row] = true;
  }

  // Check col-by-col
  const emptyCols: { [k: number]: boolean } = {};
  for (let col = 0; col < grid[0].length; col++) {
    const columnNodes: GridNode[] = [];
    for (let row = 0; row < grid.length; row++) {
      columnNodes.push(grid[row][col]);
    }
    const allEmpty = columnNodes.every((n) => n.galaxy === 0);
    if (allEmpty) emptyCols[col] = true;
  }

  const newGrid = duplicateGrid(grid);

  // Inflate by row
  Object.keys(emptyRows).forEach((row, idx) => {
    const emptyRow: GridNode[] = [];
    for (let i = 0; i < newGrid[row].length; i++) {
      emptyRow.push({
        galaxy: 0,
        char: ".",
        row: -1,
        col: -1,
        visited: false,
      });
    }

    newGrid.splice(parseInt(row) + idx, 0, emptyRow);
  });

  // Inflate by col
  Object.keys(emptyCols).forEach((colKey, idx) => {
    // if (colKey !== "2") return;
    // if (colKey > 5) return;

    const col = parseInt(colKey);
    console.log("inflating col", col);

    for (let row = 0; row < newGrid.length; row++) {
      newGrid[row].splice(col + idx, 0, {
        galaxy: 0,
        char: ".",
        row: -1,
        col: -1,
        visited: false,
      });
    }
  });

  return newGrid;
};

const { grid, galaxies } = parseInput();
printGrid(grid);
console.log(galaxies);

const inflatedGrid = inflateGrid(grid);
printGrid(inflatedGrid);
