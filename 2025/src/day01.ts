import { readLines } from "./utils";

const INITIAL_POSITION = 50;
const DIAL_SIZE = 100;

const parseLine = (line: string): [string, number] => {
  const direction = line.charAt(0);
  const count = parseInt(line.slice(1), 10);
  return [direction, count];
};

// Counts the number of times an operation ends on 0.
export const partOne = (opts: {
  initialPosition: number;
  instructions: string[];
}) => {
  let current = opts.initialPosition;

  return opts.instructions.reduce((acc, line) => {
    const [direction, count] = parseLine(line);

    const effectiveCount = count % DIAL_SIZE;
    const addend =
      direction === "L" ? DIAL_SIZE - effectiveCount : effectiveCount;
    current = (current + addend) % DIAL_SIZE;

    return acc + (current === 0 ? 1 : 0);
  }, 0);
};

// Counts the number of times any click causes the dial to point at 0, regardless
// of whether it happens during a rotation or at the end of one.
export const partTwo = (opts: {
  initialPosition: number;
  instructions: string[];
}) => {
  let current = opts.initialPosition;

  return opts.instructions.reduce((acc, line) => {
    const [direction, count] = parseLine(line);

    const effectiveCount = count % DIAL_SIZE;

    let cycles = Math.floor(count / DIAL_SIZE);

    const difference =
      direction === "L" ? current - effectiveCount : current + effectiveCount;
    if (current !== 0 && (difference <= 0 || difference >= DIAL_SIZE)) {
      cycles++;
    }

    const addend =
      direction === "L" ? DIAL_SIZE - effectiveCount : effectiveCount;
    current = (current + addend) % DIAL_SIZE;

    return acc + cycles;
  }, 0);
};

const run = async () => {
  const instructions = await readLines();
  console.log(partOne({ initialPosition: INITIAL_POSITION, instructions }));
  console.log(partTwo({ initialPosition: INITIAL_POSITION, instructions }));
};

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
