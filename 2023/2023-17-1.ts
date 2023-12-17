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

const positionToKey = ({ row, col }: Position): string => `${row}__${col}`;

const keyToPosition = (key: string): Position => {
  const [row, col] = key.split("__");
  return { row: parseInt(row), col: parseInt(col) };
};

const toKey = (node: Node): string => positionToKey(node.position);

const parseGrid = (): Node[][] => {
  const input = getInput(__filename, USE_EXAMPLE).split("\n");
  const grid: Node[][] = [];

  for (let row = 0; row < input.length; row++) {
    if (!input[row]) continue;
    const line = input[row].split("");
    const nodes: Node[] = line.map((s, col): Node => {
      return {
        position: { row, col },
        id: positionToKey({ row, col }),
        value: parseInt(s),
      };
    });

    grid[row] = nodes;
  }

  return grid;
};

type Direction = "up" | "down" | "left" | "right";

interface Path {
  nodes: Node[];
  currentDirection: Direction;
  currentStepCount: number;
}

const pathCost = (path: Path): number => {
  return path.nodes.reduce((sum, node) => {
    return sum + node.value;
  }, 0);
};

// Returns the index of the path with the cheapest path
const findCheapestPath = (paths: Path[]): number => {
  let cheapestSoFar = Number.MAX_VALUE;
  let cheapestIndex = -1;

  for (let i = 0; i < paths.length; i++) {
    const cost = pathCost(paths[i]);
    if (cost < cheapestSoFar) {
      cheapestSoFar = cost;
      cheapestIndex = i;
    }
  }

  if (cheapestIndex < 0) throw Error("findCheapestPath negative index");
  return cheapestIndex;
};

const traverse = (grid: Node[][], initialPosition: Position) => {
  const paths: Path[] = [];

  const sourceNode = grid[initialPosition.row][initialPosition.col];
  paths.push(
    {
      nodes: [sourceNode],
      currentDirection: "right",
      currentStepCount: 0,
    },
    {
      nodes: [sourceNode],
      currentDirection: "down",
      currentStepCount: 0,
    }
  );

  while (paths.length > 0) {
    const idx = findCheapestPath(paths);
    const path = paths.splice(idx, 1);
    console.log(path);
  }
};

const printGrid = (grid: Node[][]) => {
  for (let row = 0; row < grid.length; row++) {
    console.log(grid[row].map((n) => n.value).join(" "));
  }
};

const partOne = () => {
  const grid = parseGrid();
  printGrid(grid);
  traverse(grid, { row: 0, col: 0 });
  console.log("done");
};

partOne();
