import { getInput } from "./utils";
import chalk from "chalk";

const USE_EXAMPLE = true;

interface Instruction {
  direction: string;
  value: number;
  color: string;
}

const parseInput = (): Instruction[] => {
  return getInput(__filename, USE_EXAMPLE)
    .split("\n")
    .reduce((acc, line) => {
      if (!line) return acc;

      const matches = /([RUDL]) (\d+) \(#(\S+)\)/.exec(line);
      if (!matches || matches.length < 4) throw Error("invalid regexp matches");

      const direction = matches[1];
      const value = parseInt(matches[2]);
      const color = matches[3];

      const instruction: Instruction = { direction, value, color };
      acc.push(instruction);

      return acc;
    }, [] as Instruction[]);
};

const GRID_SIZE = 10;

const drawGrid = (instructions: Instruction[]): boolean[][] => {
  const grid: boolean[][] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = new Array(GRID_SIZE);
  }

  let row = 0;
  let col = 0;

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    const { direction, value } = instruction;

    if (direction === "U") {
      for (let i = 0; i < value; i++) {
        grid[row--][col] = true;
      }
      continue;
    }

    if (direction === "R") {
      for (let i = 0; i < value; i++) {
        grid[row][col++] = true;
      }
      continue;
    }

    if (direction === "D") {
      for (let i = 0; i < value; i++) {
        grid[row++][col] = true;
      }
      continue;
    }

    if (direction === "L") {
      for (let i = 0; i < value; i++) {
        grid[row][col--] = true;
      }
      continue;
    }
  }

  return grid;
};

const printGrid = (grid: boolean[][]) => {
  for (let row = 0; row < grid.length; row++) {
    const line: string[] = [];
    for (let col = 0; col < grid[0].length; col++) {
      const cell = grid[row][col];
      line.push(cell ? "#" : ".");
    }
    console.log(line.join(" "));
  }
};

const partOne = () => {
  const instructions = parseInput();
  console.log(instructions);

  const grid = drawGrid(instructions);
  printGrid(grid);
};

partOne();
