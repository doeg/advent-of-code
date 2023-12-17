import { getInput } from "./utils";
import chalk from "chalk";

const USE_EXAMPLE = true;

interface Position {
  row: number;
  col: number;
}

type Direction = "up" | "down" | "left" | "right";

interface Path {
  direction: Direction;
  nodes: Position[];
}

const NEXT_DIRECTIONS: { [k in Direction]: Direction[] } = {
  up: ["left", "right"],
  down: ["left", "right"],
  left: ["up", "down"],
  right: ["up", "down"],
};

const canGoDirection = (
  grid: number[][],
  { row, col }: Position,
  direction: Direction
): boolean => {
  switch (direction) {
    case "up":
      return row - 1 >= 0;
    case "down":
      return row + 1 < grid.length;
    case "left":
      return col - 1 >= 0;
    case "right":
      return col + 1 < grid[0].length;
  }
};

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

const printGrid = (grid: number[][], path?: Path): void => {
  console.log();
  for (let row = 0; row < grid.length; row++) {
    const line: string[] = [];
    for (let col = 0; col < grid[row].length; col++) {
      const isInPath = path?.nodes.find(
        (node) => node.row === row && node.col === col
      );

      // TODO chalk stuff here
      line.push(
        isInPath ? chalk.yellow(grid[row][col]) : chalk.gray(grid[row][col])
      );
    }
    console.log(line.join(" "));
  }
  console.log();
};

const getCheapestPathIndex = (grid: number[][], paths: Path[]): number => {
  let minPathIndex = -1;
  let minPathCost = Number.MAX_VALUE;

  paths.forEach((path, index) => {
    const cost = path.nodes.reduce((sum, { row, col }) => {
      const val = grid[row][col];
      return sum + val;
    }, 0);

    if (cost < minPathCost) {
      minPathCost = cost;
      minPathIndex = index;
    }
  });

  if (minPathIndex < 0) throw Error("getCheapestPath invalid index");
  return minPathIndex;
};

const getNodesUp = (
  grid: number[][],
  node: Position,
  MAX_NODES: number = 3
): Position[] => {
  let nodes: Position[] = [];
  let i = 1;
  while (i < MAX_NODES && node.row - i >= 0) {
    nodes.push({ row: node.row - i, col: node.col });
    i++;
  }
  return nodes;
};

const getNodesDown = (
  grid: number[][],
  node: Position,
  MAX_NODES: number = 3
): Position[] => {
  let nodes: Position[] = [];
  let i = 1;
  while (i < MAX_NODES && node.row + i < grid.length) {
    nodes.push({ row: node.row + i, col: node.col });
    i++;
  }
  return nodes;
};

const getNodesLeft = (
  grid: number[][],
  node: Position,
  MAX_NODES: number = 3
): Position[] => {
  let nodes: Position[] = [];
  let i = 1;
  while (i < MAX_NODES && node.col - i >= 0) {
    nodes.push({ row: node.row, col: node.col - i });
    i++;
  }
  return nodes;
};

const getNodesRight = (
  grid: number[][],
  node: Position,
  MAX_NODES: number = 3
): Position[] => {
  let nodes: Position[] = [];
  let i = 1;
  while (i < MAX_NODES && node.col + i < grid[0].length) {
    nodes.push({ row: node.row, col: node.col + i });
    i++;
  }
  return nodes;
};

// Returns up to `MAX_NODES` next nodes from (but not including) `node` in the given `direction`.
// Will return fewer than `MAX_NODES` if any of them are out of bounds of `grid`.
const getNextNodes = (
  grid: number[][],
  node: Position,
  direction: Direction,
  MAX_NODES: number = 3
): Position[] => {
  switch (direction) {
    case "up":
      return getNodesUp(grid, node, MAX_NODES);
    case "down":
      return getNodesDown(grid, node, MAX_NODES);
    case "left":
      return getNodesLeft(grid, node, MAX_NODES);
    case "right":
      return getNodesRight(grid, node, MAX_NODES);
  }
};

const partOne = () => {
  const grid = parseGrid();
  printGrid(grid);

  // Start at the top-left corner of the grid
  const initialNode: Position = { row: 0, col: 0 };

  // End at the bottom-right corner of the grid.
  const targetNode: Position = { row: grid.length, col: grid[0].length };

  const openPaths: Path[] = [];

  openPaths.push(
    {
      nodes: [initialNode],
      direction: "right",
    },
    {
      nodes: [initialNode],
      direction: "down",
    }
  );

  let step = 0;

  while (openPaths.length > 0) {
    step++;

    // console.log("\n\n=======================");
    // console.log("ITERATION", step);

    const pathIndex = getCheapestPathIndex(grid, openPaths);
    const path = openPaths.splice(pathIndex, 1)[0];

    const lastNodeInPath = path.nodes[path.nodes.length - 1];
    // console.log("last node in path:", lastNodeInPath);

    if (
      lastNodeInPath.row === targetNode.row &&
      lastNodeInPath.col === targetNode.col
    ) {
      console.log("DONE!!!!!!!!");
      printGrid(grid, path);
      return;
    }

    if (lastNodeInPath.row < 0) continue;
    if (lastNodeInPath.row >= grid.length) continue;
    if (lastNodeInPath.col < 0) continue;
    if (lastNodeInPath.col >= grid[0].length) continue;

    // console.log(path);
    printGrid(grid, path);

    // The next nodes in the path given the current path direction.
    const nextNodesInPath = getNextNodes(grid, lastNodeInPath, path.direction);

    const nextDirections = NEXT_DIRECTIONS[path.direction];

    let subNodes: Position[] = [];
    nextNodesInPath.forEach((node) => {
      subNodes.push(node);
      const nextNodes = [...path.nodes, ...subNodes];

      nextDirections.forEach((direction) => {
        openPaths.push({
          nodes: nextNodes,
          direction,
        });
      });
    });

    // console.log("next nodes in path");
    // console.log(JSON.stringify(nextNodesInPath, null, 2));

    // console.log("remaining paths:", openPaths.length);
    // console.log();

    // debugger;
  }
  console.log(step);
};

partOne();
