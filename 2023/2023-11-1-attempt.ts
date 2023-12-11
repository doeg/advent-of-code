import { getInput } from "./utils";
import chalk from "chalk";

const input = getInput(__filename, true);

interface GridNode {
  char: string;
  col: number;
  galaxy: number; // 0 if not a galaxy since -1 is truthy
  weight: number;
  row: number;
  visited: boolean;
  key: string; // `${row}-${col}`
}

type Grid = GridNode[][];

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
        if (n.weight > 1) {
          output.push(chalk.white(str));
        } else {
          output.push(chalk.gray(str));
        }
      }
    }
    console.log(output.join(""));
  }
};

// Returns a grid of grid nodes, plus an array of all galaxies
const parseInput = (): { grid: Grid; galaxies: GridNode[] } => {
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
        key: `${row}-${col}`,
        galaxy: char === "#" ? galaxyCounter++ : 0,
        row,
        weight: 1,
        visited: false,
      };
      acc[row].push(n);

      if (n.galaxy) galaxies.push(n);
    });

    return acc;
  }, [] as Grid);

  return { grid, galaxies };
};

// Modifies the grid in place to set the weights of each node.
// If a node falls on a row or a column that doesn't have any galaxies,
// then the weight of that node is 2. Else the weight of that node is 1.
const setWeights = (grid: Grid) => {
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

  // Set the weights of each node
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (emptyRows[row] || emptyCols[col]) {
        grid[row][col].weight = 2;
      }
    }
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

const getNode = (grid: Grid, row: number, col: number): GridNode | null => {
  if (row < 0) return null;
  if (row >= grid.length) return null;
  if (col < 0) return null;
  if (col >= grid[0].length) return null;

  return grid[row][col];
};

const getNorth = (grid: Grid, row: number, col: number) =>
  getNode(grid, row - 1, col);
const getEast = (grid: Grid, row: number, col: number) =>
  getNode(grid, row, col + 1);
const getSouth = (grid: Grid, row: number, col: number) =>
  getNode(grid, row + 1, col);
const getWest = (grid: Grid, row: number, col: number) =>
  getNode(grid, row, col - 1);

const getNeighbors = (grid: Grid, row: number, col: number): GridNode[] => {
  const north = getNorth(grid, row, col);
  const east = getEast(grid, row, col);
  const south = getSouth(grid, row, col);
  const west = getWest(grid, row, col);

  return [north, east, south, west].filter((n) => !!n) as GridNode[];
};

const parseKey = (key: string): { row: number; col: number } => {
  const s = key.split("-");
  const row = parseInt(s[0]);
  const col = parseInt(s[1]);
  return { row, col };
};

// Finds the shortest path between two galaxies using Dijkstra's algorithm
const findShortestPath = (
  inputGrid: Grid,

  // Note that these nodes aren't duplicates and therefore shouldn't be modified.
  sourceInput: GridNode,
  destinationInput: GridNode
): GridNode[] => {
  const grid = duplicateGrid(inputGrid);

  const source = grid[sourceInput.row][sourceInput.col];
  const dest = grid[destinationInput.row][destinationInput.col];

  const queue: { [key: string]: GridNode } = {};

  // dist[u] is the current distance from the source to the vertex u, given by key.
  const dist: { [key: string]: number } = {};

  // prev contains pointers to previous-hop nodes on the shortest path from the source
  // to the given vertex; equivalently the next hop on the path from the given vertex to the source.
  const prev: { [key: string]: GridNode } = {};

  const gridNodesByKey: { [key: string]: GridNode } = {};

  // For each vertex in the matrix...
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid.length; col++) {
      const v = grid[row][col];
      // Add the grid to the lookup matrix.
      gridNodesByKey[v.key] = v;

      // dist[v] ← INFINITY
      dist[v.key] = Number.MAX_VALUE;

      queue[v.key] = v;
    }
  }

  dist[source.key] = 0;

  while (Object.keys(queue).length > 0) {
    // From Dijkstra's: search for the vertex u in the vertex set Queue
    // that has the least dist[u] value;
    //
    // u ← vertex in Q with min dist[u]

    let minKey: string | null = null;
    let minDistU = Number.MAX_VALUE;

    Object.keys(queue).forEach((nodeKey) => {
      if (dist[nodeKey] <= minDistU) {
        minKey = nodeKey;
      }
    });

    if (!minKey) throw Error("no min key");

    // Get the node with the smallest distance
    const u = gridNodesByKey[minKey];
    console.log("NODE", u);

    // !!! Early exit !!!
    //
    // Early exit since we're only interested in the shortest path
    // between source and target.
    if (u === dest) break;

    // Remove the node from the queue
    delete queue[minKey];

    // For each neighbor v of u still in Q...
    const neighbors = getNeighbors(grid, u.row, u.col);
    if (neighbors.length > 4) throw Error("weird neighbors");

    const neighborsStillInQueue = neighbors.filter((n) => !!(n.key in queue));
    for (let i = 0; i < neighborsStillInQueue.length; i++) {
      const v = neighborsStillInQueue[i];

      // alt ← dist[u] + Graph.Edges(u, v)
      //
      // The variable "alt" is the length of the path from the root node
      // to the current neighbor node v if it were to go through u. If this
      // path is shorter than the current path recorded for v, that current path
      // is replaced with this alt path.
      //
      //
      // Graph.Edges(u, v) returns the length of the edge joining
      // (i.e., the distance between) the two neighbor-nodes u and v.
      const alt = dist[u.key] + v.weight;

      if (alt <= dist[v.key]) {
        dist[v.key] = alt;
        prev[v.key] = u;
      }
    }
  }

  console.log("=====");
  console.log(dist);
  console.log(prev);
  console.log("DONE");

  // Read the shortest path from source to target by reverse iteration
  const path = Object.values(prev);
  console.log(path.map((n) => n.key));

  const pathLength = path.reduce((acc, node) => {
    acc += node.weight;
    return acc;
  }, 0);
  console.log(pathLength);

  console.log(Object.keys(prev));

  for (let key in prev) {
    const node = prev[key];
    node.visited = true;
  }

  printGrid(grid);
};

const { galaxies, grid } = parseInput();
setWeights(grid);
printGrid(grid);

console.log(galaxies);
// const source = galaxies[4];
// const dest = galaxies[8];
// console.log("=====");
// console.log("SOURCE", source);
// console.log("DEST", dest);
// console.log("=====");
// const shortestPath = findShortestPath(grid, galaxies[0], galaxies[6]);
// console.log(shortestPath);
