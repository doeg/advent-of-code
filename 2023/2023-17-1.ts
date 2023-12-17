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

const dijkstra = (grid: Node[][], initialPosition: Position) => {
  const queue: Node[] = [];

  // dist is an array that contains the current distances from the source to
  // other vertices, i.e. dist[u] is the current distance from the source to the vertex u
  const dist: { [key: string]: number } = {};

  //The prev array contains pointers to previous-hop nodes on the shortest path
  // from source to the given vertex (equivalently, it is the next-hop on the path
  // from the given vertex to the source)
  const prev: { [key: string]: string | null } = {};

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      dist[toKey(node)] = Number.MAX_VALUE;
      prev[toKey(node)] = null;
      queue.push(node);
    }
  }

  const source: Node = grid[initialPosition.row][initialPosition.col];
  dist[toKey(source)] = 0;

  // Because it is difficult to keep the top-heavy crucible going in a straight
  // line for very long, it can move at most three blocks in a single direction
  // before it must turn 90 degrees left or right.
  //
  // The crucible also can't reverse direction; after entering each city block,
  // it may only turn left, continue straight, or turn right.
  while (queue.length > 0) {}
};

const printGrid = (grid: Node[][]) => {
  for (let row = 0; row < grid.length; row++) {
    console.log(grid[row].map((n) => n.value).join(" "));
  }
};

const partOne = () => {
  const grid = parseGrid();
  printGrid(grid);
  dijkstra(grid, { row: 0, col: 0 });
};

partOne();
