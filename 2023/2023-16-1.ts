import { getInput } from "./utils";
import chalk from "chalk";

interface Position {
  row: number;
  col: number;
}

interface Node {
  s: string;
  energized: boolean;
  position: Position;
}

const parseGrid = () => {
  const input = getInput(__filename, true).split("\n");

  const grid: Node[][] = [];

  for (let row = 0; row < input.length; row++) {
    grid[row] = [];
    for (let col = 0; col < input[row].length; col++) {
      grid[row][col] = {
        s: input[row][col],
        energized: false,
        position: { row, col },
      };
    }
  }

  return grid;
};

const printGrid = (grid: Node[][]) => {
  for (let row = 0; row < grid.length; row++) {
    let line = "";
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      const char = cell.energized ? "#" : cell.s;
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
      grid[row][col] = { ...input[row][col] };
    }
  }
  return grid;
};

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

const energizeGrid = (input: Node[][]): Node[][] => {
  const grid = duplicateGrid(input);

  // The beam enters in the top-left corner from the left
  // and heading to the right.
  const initialBeam = {
    position: grid[0][0].position,
    direction: Direction.RIGHT,
  };

  const queue: Beam[] = [initialBeam];

  while (queue.length > 0) {
    console.log(queue);
    const beam = queue.pop();
    if (!beam) throw Error("Weird queue");

    // Skip any nodes that are out of bounds
    if (beam.position.row < 0) continue;
    if (beam.position.row >= grid.length) continue;
    if (beam.position.col < 0) continue;
    if (beam.position.col >= grid[0].length) continue;

    const node = grid[beam.position.row][beam.position.col];
    node.energized = true;

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
    if (
      node.s === "|" &&
      (beam.direction === Direction.LEFT || beam.direction === Direction.RIGHT)
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

    if (node.s === "-") {
      //   if (beam.direction === Direction.LEFT) {
      //     queue.push({ position: leftPosition, direction: Direction.LEFT });
      //     continue;
      //   }

      //   if (beam.direction === Direction.RIGHT) {
      //     queue.push({ position: rightPosition, direction: Direction.RIGHT });
      //     continue;
      //   }

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

      throw Error("bad -");
    }

    // If the beam encounters empty space (.), it continues
    // in the same direction.
    const nextPosition = getNextPosition(beam.position, beam.direction);
    if (
      node.s === "."
      //   (node.s === "|" &&
      //     (beam.direction === Direction.UP ||
      //       beam.direction === Direction.DOWN)) ||
      //   (node.s === "-" &&
      //     (beam.direction === Direction.LEFT ||
      //       beam.direction === Direction.RIGHT))
    ) {
      queue.push({ position: nextPosition, direction: beam.direction });
      continue;
    }

    // If the beam encounters the pointy end of a splitter (| or -),
    // the beam passes through the splitter as if the splitter were empty space.
    // For instance, a rightward-moving beam that encounters a - splitter would
    //  continue in the same direction.

    // throw Error("This");
  }

  return grid;
};

const grid = parseGrid();
printGrid(grid);
console.log();

const egrid = energizeGrid(grid);
console.log();
printGrid(egrid);
