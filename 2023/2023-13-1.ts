import { getInput } from "./utils";

const input = getInput(__filename, true);

type Pattern = string[];

const parsePatterns = () => {
  const patterns: Pattern[] = [];

  const lines = input.split("\n");

  let pattern: Pattern = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.length) {
      patterns.push(pattern);
      pattern = [];
    } else {
      pattern.push(line);
    }
  }

  if (pattern.length) patterns.push(pattern);

  return patterns;
};

const areMirrorImages = (left: string, right: string): boolean => {
  const leftReversed = left.split("").reverse().join("");
  const smallestLength = Math.min(left.length, right.length);
  const leftSubstring = leftReversed.substring(0, smallestLength);
  const rightSubstring = right.substring(0, smallestLength);
  return leftSubstring === rightSubstring;
};

const getVerticalIndex = (pattern: Pattern): number | null => {
  // Start at index 1, since a reflection over index 0 doesn't really make sense.
  let col = 1;

  while (col < pattern[0].length - 1) {
    let allRowsMirroredAtIndex = true;

    for (let row = 0; row < pattern.length; row++) {
      const line = pattern[row];

      const first = line.substring(0, col);
      const second = line.substring(col);
      const isMirrored = areMirrorImages(first, second);

      if (!isMirrored) {
        allRowsMirroredAtIndex = false;
        break;
      }
    }

    if (allRowsMirroredAtIndex) {
      return col;
    }

    col++;
  }

  return null;
};

const patterns = parsePatterns();
console.log(getVerticalIndex(patterns[0]));
console.log(getVerticalIndex(patterns[1]));

// patterns.forEach((pattern) => {
//   console.log(pattern);
// });
// console.log(patterns.length);
