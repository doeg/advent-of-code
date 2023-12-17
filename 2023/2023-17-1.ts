import { getInput } from "./utils";
import chalk from "chalk";

const USE_EXAMPLE = true;

const parseGrid = (): number[][] => {
  const input = getInput(__filename, USE_EXAMPLE).split("\n");
  const grid: number[][] = [];

  for (let row = 0; row < input.length; row++) {
    if (!input[row]) continue;
    const line = input[row].split("").map((i) => parseInt(i));
    grid[row] = line;
  }

  return grid;
};

const printGrid = (grid: number[][]) => {
  for (let row = 0; row < grid.length; row++) {
    console.log(grid[row].join(" "));
  }
};

const partOne = () => {
  const grid = parseGrid();
  printGrid(grid);
};

partOne();
