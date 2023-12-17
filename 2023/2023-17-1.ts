import { getInput } from "./utils";
import chalk from "chalk";

const USE_EXAMPLE = true;

const parseGrid = (): number[][] => {
  const input = getInput(__filename, USE_EXAMPLE).split("\n");
  const grid: number[][] = [];

  for (let row = 0; row < input.length; row++) {
    if (!input[row]) continue;
    const line = input[row].split("").map((s) => parseInt(s));
    grid.push(line);
  }

  return grid;
};

const printGrid = (grid: number[][]) => {
  const header = grid[0].map((value, index) => {
    return chalk.grey(index % 10);
  });
  header.unshift("\t");
  console.log(header.join(" "));
  console.log();

  for (let row = 0; row < grid.length; row++) {
    const line: string[] = [chalk.grey(row), "\t"];

    for (let col = 0; col < grid[0].length; col++) {
      line.push(chalk.white(grid[row][col]));
    }

    console.log(line.join(" "));
  }
};

const partOne = () => {
  const grid = parseGrid();
  printGrid(grid);
};

partOne();
