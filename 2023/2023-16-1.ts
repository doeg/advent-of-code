import { getInput } from "./utils";
import chalk from "chalk";

interface Position {
  row: number;
  col: number;
}

enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}
interface Beam {
  position: Position;
  direction: Direction;
}

interface Node {
  s: string;
  energized: boolean;
  beams: Beam[];
  position: Position;
}

const parseGrid = () => {
  const input = getInput(__filename, false).split("\n");

  const grid: Node[][] = [];

  for (let row = 0; row < input.length; row++) {
    grid[row] = [];
    for (let col = 0; col < input[row].length; col++) {
      grid[row][col] = {
        s: input[row][col],
        energized: false,
        position: { row, col },
        beams: [],
      };
    }
  }

  return grid;
};

const getDisplay = (cell: Node, printDirections: boolean): string => {
  if (printDirections) {
    if (cell.beams.length > 1 && cell.s === ".") {
      return chalk.red(cell.beams.length);
    }

    if (cell.s === "|") {
      return cell.beams.length ? chalk.yellow(cell.s) : chalk.magenta(cell.s);
    }

    if (cell.s === "-") {
      return cell.beams.length ? chalk.yellow(cell.s) : chalk.magenta(cell.s);
    }

    if (cell.s === "/") {
      return cell.beams.length ? chalk.yellow(cell.s) : chalk.cyan(cell.s);
    }

    if (cell.s === "\\") {
      return cell.beams.length ? chalk.yellow(cell.s) : chalk.cyan(cell.s);
    }

    if (cell.beams.length === 1) {
      const beam = cell.beams[0];
      if (beam.direction === Direction.UP) return chalk.yellow("^");
      if (beam.direction === Direction.DOWN) return chalk.yellow("v");
      if (beam.direction === Direction.LEFT) return chalk.yellow("<");
      if (beam.direction === Direction.RIGHT) return chalk.yellow(">");
      return chalk.yellow(cell.beams.length);
    }
  }

  if (cell.energized) {
    return chalk.yellowBright("#");
  }

  if (cell.s === ".") {
    return chalk.gray(cell.s);
  }

  if (cell.s === "/" || cell.s === "\\") {
    return chalk.cyan(cell.s);
  }

  if (cell.s === "|" || cell.s === "-") {
    return chalk.magenta(cell.s);
  }

  return cell.s;
};

const printGrid = (grid: Node[][], printDirections: boolean) => {
  console.log();
  let header = "  ";
  for (let i = 0; i < grid[0].length; i++) {
    header = `${header}${i}`;
  }
  console.log(header);

  for (let row = 0; row < grid.length; row++) {
    let line = `${row} `;
    for (let col = 0; col < grid[row].length; col++) {
      const char = getDisplay(grid[row][col], printDirections);
      line = `${line}${char}`;
    }
    console.log(line);
  }
};

const duplicateGrid = (input: Node[][]): Node[][] => {
  const grid: Node[][] = [];
  for (let row = 0; row < input.length; row++) {
    grid[row] = [];
    for (let col = 0; col < input[row].length; col++) {
      grid[row][col] = {
        ...input[row][col],
        beams: [],
      };
    }
  }
  return grid;
};

const getNextPosition = (
  position: Position,
  direction: Direction
): Position => {
  const { row, col } = position;
  switch (direction) {
    case Direction.UP:
      return { row: row - 1, col: col };
    case Direction.DOWN:
      return { row: row + 1, col: col };
    case Direction.LEFT:
      return { row: row, col: col - 1 };
    case Direction.RIGHT:
      return { row: row, col: col + 1 };
    default:
      throw Error("invalid direction");
  }
};

const MAX_CYCLES = 1000;

const energizeGrid = (input: Node[][], initialBeam: Beam): Node[][] => {
  let step = 0;
  const grid = duplicateGrid(input);

  const queue: Beam[] = [initialBeam];

  while (queue.length > 0) {
    // const beam = queue.pop();
    const beam = queue.shift();
    if (!beam) throw Error("Weird queue");

    // Skip any nodes that are out of bounds
    if (beam.position.row < 0) continue;
    if (beam.position.row >= grid.length) continue;
    if (beam.position.col < 0) continue;
    if (beam.position.col >= grid[0].length) continue;

    const node = grid[beam.position.row][beam.position.col];
    if (!node) {
      console.log("no node found at", beam.position.row, beam.position.col);
      throw Error("nope");
    }

    if (node.beams.length >= MAX_CYCLES) {
      continue;
    }

    // printGrid(grid, true);
    // debugger;

    node.energized = true;
    node.beams.push(beam);

    const upPosition: Position = {
      row: beam.position.row - 1,
      col: beam.position.col,
    };
    const downPosition: Position = {
      row: beam.position.row + 1,
      col: beam.position.col,
    };
    const leftPosition: Position = {
      row: beam.position.row,
      col: beam.position.col - 1,
    };
    const rightPosition: Position = {
      row: beam.position.row,
      col: beam.position.col + 1,
    };

    // If the beam encounters a mirror (/ or \),
    // the beam is reflected 90 degrees depending on the angle of the mirror.
    // For instance, a rightward-moving beam that encounters a / mirror
    // would continue upward in the mirror's column, while a rightward-moving
    // beam that encounters a \ mirror would continue downward from the mirror's column.
    if (node.s === "/") {
      if (beam.direction === Direction.UP) {
        queue.push({
          position: rightPosition,
          direction: Direction.RIGHT,
        });
        continue;
      }
      if (beam.direction === Direction.DOWN) {
        queue.push({
          position: leftPosition,
          direction: Direction.LEFT,
        });
        continue;
      }
      if (beam.direction === Direction.LEFT) {
        queue.push({
          position: downPosition,
          direction: Direction.DOWN,
        });
        continue;
      }
      if (beam.direction === Direction.RIGHT) {
        queue.push({
          position: upPosition,
          direction: Direction.UP,
        });
        continue;
      }
      throw Error("nope nope");
    }

    if (node.s === "\\") {
      if (beam.direction === Direction.UP) {
        queue.push({
          position: leftPosition,
          direction: Direction.LEFT,
        });
        continue;
      }
      if (beam.direction === Direction.DOWN) {
        queue.push({
          position: rightPosition,
          direction: Direction.RIGHT,
        });
        continue;
      }
      if (beam.direction === Direction.LEFT) {
        queue.push({
          position: upPosition,
          direction: Direction.UP,
        });
        continue;
      }
      if (beam.direction === Direction.RIGHT) {
        queue.push({
          position: downPosition,
          direction: Direction.DOWN,
        });
        continue;
      }
      throw Error("this should not happen");
    }

    // If the beam encounters the flat side of a splitter (| or -), the beam
    // is split into two beams going in each of the two directions the splitter's
    // pointy ends are pointing. For instance, a rightward-moving beam that encounters
    // a | splitter would split into two beams: one that continues upward from
    // the splitter's column and one that continues downward from the splitter's column.
    if (node.s === "|") {
      if (
        beam.direction === Direction.LEFT ||
        beam.direction === Direction.RIGHT
      ) {
        queue.push(
          {
            position: upPosition,
            direction: Direction.UP,
          },
          {
            position: downPosition,
            direction: Direction.DOWN,
          }
        );
        continue;
      }
    }

    if (node.s === "-") {
      if (
        beam.direction === Direction.UP ||
        beam.direction === Direction.DOWN
      ) {
        queue.push(
          {
            position: leftPosition,
            direction: Direction.LEFT,
          },
          {
            position: rightPosition,
            direction: Direction.RIGHT,
          }
        );
        continue;
      }
    }

    // If the beam encounters empty space (.), it continues
    // in the same direction.
    //
    // If the beam encounters the pointy end of a splitter (| or -),
    // the beam passes through the splitter as if the splitter were empty space.
    // For instance, a rightward-moving beam that encounters a - splitter would
    //  continue in the same direction.
    const nextPosition = getNextPosition(beam.position, beam.direction);
    queue.push({ position: nextPosition, direction: beam.direction });
  }

  return grid;
};

const countEnergized = (grid: Node[][]): number => {
  let sum = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].energized) sum++;
    }
  }
  return sum;
};

const partOne = () => {
  const grid = parseGrid();
  printGrid(grid);
  // console.log();

  // The beam enters in the top-left corner from the left
  // and heading to the right.
  const initialBeam = {
    position: grid[0][0].position,
    direction: Direction.RIGHT,
    id: 0,
  };
  const egrid = energizeGrid(grid, initialBeam);

  console.log();
  console.log();
  console.log();
  console.log("DONE!!!!!!!!!!!");
  printGrid(egrid, true);
  printGrid(egrid, false);

  console.log(countEnergized(egrid));
};

const partTwo = () => {
  const grid = parseGrid();

  let maxEnergized = 0;

  // Top to bottom, left edge, going right
  for (let row = 0; row < grid.length; row++) {
    const beam = {
      position: { row, col: 0 },
      direction: Direction.RIGHT,
    };
    const e = countEnergized(energizeGrid(grid, beam));

    maxEnergized = Math.max(maxEnergized, e);
    console.log(beam, e, maxEnergized);
  }

  // Top to bottom, right edge, going left
  for (let row = 0; row < grid.length; row++) {
    const beam = {
      position: { row, col: grid[0].length - 1 },
      direction: Direction.LEFT,
    };
    const e = countEnergized(energizeGrid(grid, beam));

    maxEnergized = Math.max(maxEnergized, e);
    console.log(beam, e, maxEnergized);
  }

  // Left to right, top edge, going down
  for (let col = 0; col < grid[0].length; col++) {
    const beam = {
      position: { row: 0, col },
      direction: Direction.DOWN,
    };
    const e = countEnergized(energizeGrid(grid, beam));

    maxEnergized = Math.max(maxEnergized, e);
    console.log(beam, e, maxEnergized);
  }

  // Left to right, bottom edge, going up
  for (let col = 0; col < grid[0].length; col++) {
    const beam = {
      position: { row: grid.length - 1, col },
      direction: Direction.UP,
    };
    const e = countEnergized(energizeGrid(grid, beam));

    maxEnergized = Math.max(maxEnergized, e);
    console.log(beam, e, maxEnergized);
  }

  console.log(maxEnergized);
};

// partOne();
partTwo();

// const grid = parseGrid();
// const e = countEnergized(
//   energizeGrid(grid, {
//     position: { row: 109, col: 19 },
//     direction: Direction.UP,
//   })
// );
// console.log(e);
