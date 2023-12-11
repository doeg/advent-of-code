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
  const input = getInput(__filename, false);
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
    const col = parseInt(colKey);

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

  // Fix coordinates
  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[row].length; col++) {
      newGrid[row][col].row = row;
      newGrid[row][col].col = col;
    }
  }

  return newGrid;
};

const findGalaxies = (grid: GridNode[][]): GridNode[] => {
  const galaxies: GridNode[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      if (node.galaxy) galaxies.push(node);
    }
  }
  return galaxies;
};

const makeKey = (a: GridNode, b: GridNode): string => {
  return [a.galaxy, b.galaxy].sort().join("--");
};

const findDistances = (galaxies: GridNode[]) => {
  const memoizedByPair: { [key: string]: number } = {};

  for (let s = 0; s < galaxies.length; s++) {
    for (let d = 0; d < galaxies.length; d++) {
      if (s === d) continue;

      const source = galaxies[s];
      const dest = galaxies[d];

      const key = makeKey(source, dest);
      if (key in memoizedByPair) continue;

      const absRow = Math.abs(source.row - dest.row);
      const absCol = Math.abs(source.col - dest.col);
      const distance = absRow + absCol;

      memoizedByPair[key] = distance;
    }
  }

  const sum = Object.values(memoizedByPair).reduce((acc, v) => {
    acc += v;
    return acc;
  }, 0);
  console.log(sum);
};

const { grid } = parseInput();
// printGrid(grid);
// console.log(findGalaxies(grid));

const inflatedGrid = inflateGrid(grid);
// printGrid(inflatedGrid);

// console.log(findGalaxies(inflatedGrid));
findDistances(findGalaxies(inflatedGrid));
