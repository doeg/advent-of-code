import { getInput } from "./utils";
import chalk from "chalk";

interface Position {
  row: number;
  col: number;
}

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

const positionToKey = (p: Position) => `${p.row}__${p.col}`;
const positionFromKey = (key: string) => {
  const [row, col] = key.split("__");
  return { row: parseInt(row), col: parseInt(col) };
};

class NodeSet {
  nodes: Position[] = [];

  add = (node: Position) => {
    const index = this.nodes.findIndex(
      (n) => n.row === node.row && n.col === node.col
    );
    if (index < 0) {
      this.nodes.push(node);
    }
  };

  // Returns the node in openSet having the lowest fScore[] value
  popMin = (): Position => {
    // TODO
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
    const next = this.nodes.pop();
    if (!next) throw Error("Cannot popMin on empty NodeSet");
    return next;
  };

  size = () => {
    return this.nodes.length;
  };
}

const log = (...data: any[]) => {
  console.log(...data);
};

// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
const heuristic = (node: Position, goal: Position): number => {
  return 0;
};

// getNeighbours returns all neighbours that are within the bounds of the grid.
const getNeighbours = (grid: number[][], node: Position): Position[] => {
  const neighbours: Position[] = [];
  return neighbours;
};

// A* finds a path from start to goal.
const aStar = (grid: number[][], start: Position, goal: Position) => {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.
  const openSet = new NodeSet();
  openSet.add(start);

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
  // to n currently known.
  const cameFrom: { [nodeKey: string]: string } = {};

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  // The "default value" is Number.MAX_VALUE
  const gScore: { [nodeKey: string]: number } = {};
  gScore[positionToKey(start)] = 0;

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  // The "default value" is Number.MAX_VALUE;
  const fScore: { [nodeKey: string]: number } = {};
  fScore[positionToKey(start)] = heuristic(start, goal);

  let step = 0; // For debugging only

  while (openSet.size() > 0) {
    log("\nIteration", step++);

    const current = openSet.popMin();
    if (current.row === goal.row && current.col === goal.col) {
      // TODO reconstruct path
      console.log("DONE!!!!!!");
      return;
    }

    const neighbours = getNeighbours(grid, current);
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];

      // d(current,neighbor) is the weight of the edge from current to neighbor
      const dCurrentNeighbour = grid[neighbour.row][neighbour.col];

      // tentative_gScore is the distance from start to the neighbor through current
      //   tentative_gScore := gScore[current] + d(current, neighbor)
      const tentativeGScore =
        gScore[positionToKey(current)] + dCurrentNeighbour;

      //   if tentative_gScore < gScore[neighbor]
      if (tentativeGScore < gScore[positionToKey(neighbour)]) {
        // This path to neighbor is better than any previous one. Record it!
        //
        //       cameFrom[neighbor] := current
        cameFrom[positionToKey(neighbour)] = positionToKey(current);
        //       gScore[neighbor] := tentative_gScore
        gScore[positionToKey(neighbour)] = tentativeGScore;
        //       fScore[neighbor] := tentative_gScore + h(neighbor)
        fScore[positionToKey(neighbour)] =
          tentativeGScore + heuristic(neighbour, goal);

        //       if neighbor not in openSet
        //           openSet.add(neighbor)
        openSet.add(neighbour);
      }
    }

    log();
  }
};

const partOne = () => {
  const grid = parseGrid();
  printGrid(grid);

  const start = { row: 0, col: 0 };
  const goal = { row: grid.length - 1, col: grid[0].length - 1 };

  aStar(grid, start, goal);
};

partOne();
