import { getInput } from "./utils";
import chalk from "chalk";

const USE_EXAMPLE = true;

// After the list of springs for a given row, the size of each
// contiguous group of damaged springs is listed in the order
// those groups appear in the row. This list always accounts
// for every damaged spring, and each number is the entire size
// of its contiguous group (that is, groups are always separated
// by at least one operational spring: #### would always be 4, never 2,2).

interface Line {
  pattern: string[];
  sizes: number[];
}

const parseInput = (): Line[] => {
  const input = getInput(__filename, USE_EXAMPLE);
  return input.split("\n").reduce((acc, line) => {
    if (!line) return acc;

    const [first, second] = line.split(" ");

    const pattern = first.split("");
    const sizes = second.split(",").map((i) => parseInt(i));
    acc.push({ pattern, sizes });
    return acc;
  }, [] as Line[]);
};

interface Substring {
  startIndex: number;
  substring: string[];
}

const groupPattern = (pattern: string[]): Substring[] => {
  const groups: Substring[] = [];

  let currentSubstring: string[] = [];

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];

    if (char === ".") {
      if (currentSubstring.length) {
        groups.push({
          startIndex: i - currentSubstring.length,
          substring: currentSubstring,
        });
        currentSubstring = [];
      }
    } else {
      currentSubstring.push(char);
    }
  }

  if (currentSubstring.length) {
    groups.push({
      startIndex: pattern.length - currentSubstring.length,
      substring: currentSubstring,
    });
  }

  return groups;
};

const input = parseInput();

const permuteLine = (line: Line): number => {
  const { pattern, sizes } = input[0];
  const groups = groupPattern(pattern);
  console.log(groups);

  // // After the list of springs for a given row, the size of each
  // contiguous group of damaged springs is listed in the order
  // those groups appear in the row.
  const sizesBiggestToSmallest = [...sizes].sort().reverse();
  console.log(sizesBiggestToSmallest);

  for (let i = 0; i < sizesBiggestToSmallest.length; i++) {
    const size = sizesBiggestToSmallest[i];
    console.log();
    console.log(size);
    const potentialPositions: Substring[] = [];

    for (let g = 0; g < groups.length; g++) {
      const group = groups[g];
      if (size <= group.substring.length) potentialPositions.push(group);
    }

    console.log(potentialPositions);
  }

  return -1;
};

permuteLine(input[0]);
