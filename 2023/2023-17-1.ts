import { getInput } from "./utils";
import chalk from "chalk";

const USE_EXAMPLE = true;

interface Position {
  row: number;
  col: number;
}

interface Node {
  position: Position;
  id: string;
  value: number;
}

const toKey = ({ row, col }: Position): string => `${row}__${col}`;

const fromKey = (key: string): Position => {
  const [row, col] = key.split("__");
  return { row: parseInt(row), col: parseInt(col) };
};

const parseGrid = (): Node[][] => {
  const input = getInput(__filename, USE_EXAMPLE).split("\n");
  const grid: Node[][] = [];

  for (let row = 0; row < input.length; row++) {
    if (!input[row]) continue;
    const line = input[row].split("");
    const nodes: Node[] = line.map((s, col): Node => {
      return {
        position: { row, col },
        id: toKey({ row, col }),
        value: parseInt(s),
      };
    });

    grid[row] = nodes;
  }

  return grid;
};

const printGrid = (grid: Node[][]) => {
  for (let row = 0; row < grid.length; row++) {
    console.log(grid[row].map((n) => n.value).join(" "));
  }
};

const partOne = () => {
  const grid = parseGrid();
  printGrid(grid);
};

partOne();
