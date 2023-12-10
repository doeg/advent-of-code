import { getInput } from "./utils";
import chalk from "chalk";

interface GraphNode {
  row: number;
  col: number;
  s: string;
  d: string;
  neighbors: GraphNode[];
  visited: boolean;
  empty: boolean;
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
        .map(({ d, empty, visited, ...n }) => {
          if (empty) return chalk.grey(d);
          return n.neighbors.length ? chalk.green(d) : d;
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
  console.log("Getting node at ", row, col);
  if (row < 0) return null;
  if (row > nodeGrid.length) return null;
  if (col < 0) return null;
  if (col > nodeGrid[row].length) return null;

  return nodeGrid[row][col];
};

const NORTH_CONNECTORS = ["|", "7", "F"];
const EAST_CONNECTORS = ["J", "-"];
const SOUTH_CONNECTORS = ["|", "L", "J"];
const WEST_CONNECTORS = ["L", "-"];

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

const connectStartNode = (
  nodeGrid: GraphNode[][],
  row: number,
  col: number
): void => {
  const node = nodeGrid[row][col];

  // Check north
  const northNode = getNorthNode(nodeGrid, row, col);
  if (northNode) {
    node.neighbors.push(northNode);
  }

  // Check east
  const eastNode = getEastNode(nodeGrid, row, col);
  if (eastNode) {
    node.neighbors.push(eastNode);
  }

  // Check south
  const southNode = getSouthNode(nodeGrid, row, col);
  if (southNode) {
    node.neighbors.push(southNode);
  }

  // Check west
  const westNode = getWestNode(nodeGrid, row, col);
  if (westNode) {
    node.neighbors.push(westNode);
  }

  if (node.neighbors.length !== 2) {
    console.log(node.neighbors.length);
    throw Error("weird number of nodes on start node");
  }
};

// For the node at `nodeGrid[row][col]`, populate its `neighbors` array
// with adjacent nodes.
//
// Note that every node is connected to at most two other nodes.
// The connected nodes are suggested by the shape of the pipe, except for the
// starting node "S" which can connect to any of N/E/S/W.
const connectGrid = (nodeGrid: GraphNode[][], row: number, col: number) => {
  const node = nodeGrid[row][col];

  switch (node.s) {
    case "S":
      // The start node is special because its shape does not describe
      // which other nodes it is connected to.
      connectStartNode(nodeGrid, row, col);
      break;
    default:
      console.log("unhandled node", node);
      break;
  }

  console.log(row, col, node.d, node.neighbors.length);

  node.neighbors.forEach((node) => connectGrid(nodeGrid, node.row, node.col));
};

const { startNode, nodeGrid } = buildNodeGrid();
printGrid(nodeGrid);
connectGrid(nodeGrid, startNode.row, startNode.col);
printGrid(nodeGrid);
