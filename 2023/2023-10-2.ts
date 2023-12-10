import { getInput } from "./utils";
import chalk from "chalk";

interface GraphNode {
  row: number;
  col: number;
  s: string;
  d: string;
  neighbors: GraphNode[];
  visited: boolean; // True if the node has been visited in the connectGraph function
  empty: boolean;

  inside: boolean;
  fillChecked: boolean;
}

// Just parse the input into a grid of strings.
// We can do the graph-building path separately.
const parseInput = (): string[][] => {
  const input = getInput(__filename, true);
  const lines = input.split("\n");

  const grid: string[][] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    grid[i] = line.split("");
  }

  return grid;
};

const CHAR_TO_UNICODE = {
  "|": "║", // is a vertical pipe connecting north and south.
  "-": "═", // is a horizontal pipe connecting east and west.
  L: "╚", // is a 90-degree bend connecting north and east.
  J: "╝", // is a 90-degree bend connecting north and west.
  "7": "╗", // is a 90-degree bend connecting south and west.
  F: "╔", // is a 90-degree bend connecting south and east.
  ".": ".", // is ground; there is no pipe in this tile.
  S: "S", // is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
};

// Builds a graph from a grid, returning the pointer to the starting node.
// This does not actually connect any nodes to their neighbors.
const buildNodeGrid = (): { startNode: GraphNode; nodeGrid: GraphNode[][] } => {
  const grid = parseInput();

  let startNode: GraphNode | null = null;
  const nodeGrid: GraphNode[][] = [];

  for (let row = 0; row < grid.length; row++) {
    const line = grid[row];
    nodeGrid[row] = [];
    for (let col = 0; col < line.length; col++) {
      const s = grid[row][col] as string;
      const graphNode: GraphNode = {
        row,
        col,
        s,
        d: CHAR_TO_UNICODE[s],
        empty: s === ".",
        neighbors: [],
        visited: false,

        // Flood fill
        inside: false,
        fillChecked: false,
      };

      nodeGrid[row][col] = graphNode;

      // Mark the start node
      if (s === "S") startNode = graphNode;
    }
  }

  if (!startNode) throw Error("Could not find start node");

  return { startNode, nodeGrid };
};

// Helper function to print a grid.
const printGrid = (grid: GraphNode[][]) => {
  grid.forEach((line) => {
    console.log(
      line
        .map(({ d, ...n }) => {
          if (n.visited) return chalk.green(d);
          if (n.inside) return chalk.bgCyan(d);
          if (n.fillChecked) return chalk.red(d);

          return chalk.bgCyan(d);
        })
        .join("")
    );
  });
};

const getNode = (
  nodeGrid: GraphNode[][],
  row: number,
  col: number
): GraphNode | null => {
  if (row < 0) return null;
  if (row >= nodeGrid.length) return null;
  if (col < 0) return null;
  if (col > nodeGrid[row].length) return null;

  return nodeGrid[row][col];
};

const NORTH_CONNECTORS = ["|", "7", "F", "S"];
const EAST_CONNECTORS = ["J", "-", "7", "S"];
const SOUTH_CONNECTORS = ["|", "L", "J", "S"];
const WEST_CONNECTORS = ["L", "-", "F", "S"];

const hasCharacter = (node: GraphNode, characters: string[]): boolean => {
  return characters.indexOf(node.s) >= 0;
};

// Returns a node if it is a valid NORTHERN connecting node to the node at nodeGrid[row][col]
const getNorthNode = (
  nodeGrid: GraphNode[][],
  row: number,
  col: number
): GraphNode | null => {
  const northNode = getNode(nodeGrid, row - 1, col);
  return northNode && hasCharacter(northNode, NORTH_CONNECTORS)
    ? northNode
    : null;
};

const getEastNode = (
  nodeGrid: GraphNode[][],
  row: number,
  col: number
): GraphNode | null => {
  const eastNode = getNode(nodeGrid, row, col + 1);
  return eastNode && hasCharacter(eastNode, EAST_CONNECTORS) ? eastNode : null;
};

const getSouthNode = (
  nodeGrid: GraphNode[][],
  row: number,
  col: number
): GraphNode | null => {
  const southNode = getNode(nodeGrid, row + 1, col);
  return southNode && hasCharacter(southNode, SOUTH_CONNECTORS)
    ? southNode
    : null;
};

const getWestNode = (
  nodeGrid: GraphNode[][],
  row: number,
  col: number
): GraphNode | null => {
  const westNode = getNode(nodeGrid, row, col - 1);
  return westNode && hasCharacter(westNode, WEST_CONNECTORS) ? westNode : null;
};

const connectNode = (
  nodeGrid: GraphNode[][],
  row: number,
  col: number
): void => {
  const node = nodeGrid[row][col];

  // Check north
  if (hasCharacter(node, ["S", "|", "L", "J"])) {
    const northNode = getNorthNode(nodeGrid, row, col);
    // console.log("checkingn north", northNode);
    if (northNode) {
      node.neighbors.push(northNode);
    }
  }

  // Check east
  if (hasCharacter(node, ["S", "-", "L", "F"])) {
    const eastNode = getEastNode(nodeGrid, row, col);
    // console.log("checking east", eastNode);
    if (eastNode) {
      node.neighbors.push(eastNode);
    }
  }

  // Check south
  if (hasCharacter(node, ["S", "|", "7", "F"])) {
    const southNode = getSouthNode(nodeGrid, row, col);
    // console.log("checking south", southNode);
    if (southNode) {
      node.neighbors.push(southNode);
    }
  }

  // Check west
  if (hasCharacter(node, ["S", "-", "J", "7"])) {
    const westNode = getWestNode(nodeGrid, row, col);
    // console.log("checking west", westNode);
    if (westNode) {
      node.neighbors.push(westNode);
    }
  }

  if (node.neighbors.length !== 2) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(node);
    printGrid(nodeGrid);
    console.log("neighbor count", node.neighbors.length);
    throw Error("weird number of nodes for node");
  }
};

const connectGridInLoop = (nodeGrid: GraphNode[][], startNode: GraphNode) => {
  let counter = 0;
  let stack: GraphNode[] = [];
  stack.push(startNode);

  while (stack.length > 0) {
    const node = stack.pop();

    if (!node) throw Error("bad pop");

    if (!node.visited) {
      node.visited = true;
      connectNode(nodeGrid, node.row, node.col);
      counter++;
      node.neighbors.forEach((n) => stack.push(n));
    }
  }

  console.log("DONE", counter);
};

// Start a flood fill from the given node.
const floodFromNode = (nodeGrid: GraphNode[][], startNode: GraphNode): void => {
  const queue: GraphNode[] = [startNode];

  console.log(
    "Starting flood from node",
    startNode.row,
    startNode.col,
    startNode.d
  );

  while (queue.length > 0) {
    const node = queue.pop();
    if (!node) throw Error("invalid queue");

    // Don't process nodes that have already been processed as part of this region fill.
    if (node.fillChecked) continue;

    node.fillChecked = true;

    const northNode = getNode(nodeGrid, node.row - 1, node.col);
    const eastNode = getNode(nodeGrid, node.row, node.col + 1);
    const southNode = getNode(nodeGrid, node.row + 1, node.col);
    const westNode = getNode(nodeGrid, node.row, node.col - 1);

    const boundedNorth = !!northNode && hasCharacter(northNode, ["-"]);
    const boundedEast = !!eastNode && hasCharacter(eastNode, ["|"]);
    const boundedSouth = !!southNode && hasCharacter(southNode, ["-"]);
    const boundedWest = !!westNode && hasCharacter(westNode, ["|"]);

    const push = (n: GraphNode) => {
      queue.push(n);
    };

    if (!node.visited) {
      // If the node isn't part of a path, the flood fill can go in any
      // direction, so check them all.
      if (northNode && !boundedNorth) push(northNode);
      if (eastNode && !boundedEast) push(eastNode);
      if (southNode && !boundedSouth) push(southNode);
      if (westNode && !boundedWest) push(westNode);
    } else {
      // If we're on a path, allow the flood to move through the pipes.
      if (node.s === "|") {
        if (northNode && !boundedNorth) push(northNode);
        if (southNode && !boundedSouth) push(southNode);
      }

      if (node.s === "-") {
        if (eastNode && !boundedEast) push(eastNode);
        if (westNode && !boundedWest) push(westNode);
      }

      if (node.s === "L") {
        if (northNode && !boundedNorth) push(northNode);
        if (eastNode && !boundedEast) push(eastNode);
      }
      if (node.s === "J") {
        if (northNode && !boundedNorth) push(northNode);
        if (westNode && !boundedWest) push(westNode);
      }

      if (node.s === "7") {
        if (southNode && !boundedSouth) push(southNode);
        if (westNode && !boundedWest) push(westNode);
      }

      if (node.s === "F") {
        if (southNode && !boundedSouth) push(southNode);
        if (eastNode && !boundedEast) push(eastNode);
      }
    }
  }
};

const fillGrid = (nodeGrid: GraphNode[][]) => {
  for (let row = 0; row < nodeGrid.length; row++) {
    for (let col = 0; col < nodeGrid[row].length; col++) {
      // TODO: Remove
      // For debugging, only start the flood fill at the top left corner.
      // if (row > 0 || col > 0) return;
      if (
        !(
          row === 0 ||
          col === 0 ||
          row === nodeGrid.length ||
          col === nodeGrid[row].length
        )
      )
        continue;

      // Pick a node from which to start the flood fill.
      const node = nodeGrid[row][col];

      // If the node is part of a path, do not bother doing a flood fill
      // starting at this position. This may or may not be accurate...?
      if (node.visited) continue;

      // If we've already processed this node as part of a previous flood fill, continue.
      if (node.fillChecked) continue;

      floodFromNode(nodeGrid, node);
    }
  }
};

// ******************************************************
//
// ENTRY POINT
//
// ******************************************************
const { startNode, nodeGrid } = buildNodeGrid();
connectGridInLoop(nodeGrid, startNode);
printGrid(nodeGrid);

fillGrid(nodeGrid);
printGrid(nodeGrid);
