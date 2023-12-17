import { getInput } from "./utils";
import chalk from "chalk";

const USE_EXAMPLE = true;

interface Position {
  row: number;
  col: number;
}

interface Node {
  position: Position;
  value: number;
}
type Direction = "up" | "down" | "left" | "right";

interface Path {
  nodes: Node[];

  // pendingDirection is the direction of the _next_ movements.
  pendingDirection: Direction;
}

const parseGrid = (): Node[][] => {
  const input = getInput(__filename, USE_EXAMPLE).split("\n");
  const grid: Node[][] = [];

  for (let row = 0; row < input.length; row++) {
    if (!input[row]) continue;
    const line = input[row].split("");
    const nodes: Node[] = line.map((s, col): Node => {
      return {
        position: { row, col },
        value: parseInt(s),
      };
    });

    grid[row] = nodes;
  }

  return grid;
};

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

const getNodesToRight = (grid: Node[][], initialPosition: Position): Node[] => {
  const nodes = [];

  let i = 1;
  while (i <= 3) {
    const nextCol = initialPosition.col + i;
    i++;

    if (nextCol > grid[0].length) {
      break;
    }

    const nextNode = grid[initialPosition.row][nextCol];
    nodes.push(nextNode);
  }

  return nodes;
};

const getNodesInStraightLine = (
  grid: Node[][],
  node: Node,
  direction: Direction
): Node[] => {
  const nodes: Node[] = [];

  switch (direction) {
    case "up":
    case "down":
    case "left":
    case "right":
      return getNodesToRight(grid, node.position);
  }

  return nodes;
};

const isDestination = (grid: Node[][], node: Node): boolean => {
  return (
    node.position.row === grid.length - 1 &&
    node.position.col === grid[0].length - 1
  );
};

const NEXT_DIRECTIONS: { [k in Direction]: Direction[] } = {
  up: ["left", "right"],
  down: ["left", "right"],
  left: ["up", "down"],
  right: ["up", "down"],
};

const traverse = (grid: Node[][], initialPosition: Position) => {
  const paths: Path[] = [];

  const sourceNode = grid[initialPosition.row][initialPosition.col];
  paths.push(
    {
      nodes: [sourceNode],
      pendingDirection: "right",
    },
    {
      nodes: [sourceNode],
      pendingDirection: "down",
    }
  );

  while (paths.length > 0) {
    // Choose the cheapest path from the list of open paths.
    const idx = findCheapestPath(paths);
    const path = paths.splice(idx, 1)[0];

    // Check if we are at the last node. If so, we're done. Maybe?
    // Or maybe we should keep track of all completed paths and then take the smallest?
    const lastNode = path.nodes[path.nodes.length - 1];
    if (isDestination(grid, lastNode)) {
      console.log("DONE!!!!!");
      return;
    }

    // Get the next 1, 2, and 3 nodes in a straight line from `path.pendingDirection`.
    const nextNodes = getNodesInStraightLine(
      grid,
      lastNode,
      path.pendingDirection
    );

    const nextDirections = NEXT_DIRECTIONS[path.pendingDirection];

    const nextPaths: Path[] = [];
    const subNodes: Node[] = [];

    nextNodes.forEach((node) => {
      subNodes.push(node);
      nextDirections.forEach((direction) => {
        nextPaths.push({
          nodes: [...path.nodes, ...subNodes],
          pendingDirection: direction,
        });
      });
    });

    console.log("next paths", nextPaths.length, nextPaths);
    console.log();
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
