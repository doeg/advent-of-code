import { getInput } from "./utils";

const input = getInput(__filename, false);

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

  while (col < pattern[0].length) {
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

const getVerticalAsString = (pattern: Pattern, col: number): string => {
  const chars: string[] = [];
  for (let row = 0; row < pattern.length; row++) {
    const lineChars = pattern[row].split("");
    const char = lineChars[col];
    chars.push(char);
  }
  return chars.join("");
};

const getHorizontalIndex = (pattern: Pattern): number | null => {
  let row = 1;

  while (row < pattern.length) {
    let allRowsMirroredAtIndex = true;
    for (let col = 0; col < pattern[row].length; col++) {
      const line = getVerticalAsString(pattern, col);

      const first = line.substring(0, row);
      const second = line.substring(row);
      const isMirrored = areMirrorImages(first, second);
      if (!isMirrored) {
        allRowsMirroredAtIndex = false;
        break;
      }
    }

    if (allRowsMirroredAtIndex) {
      return row;
    }

    row++;
  }
  return null;
};

const patterns = parsePatterns();

const partOne = () => {
  let sum = 0;

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const vindex = getVerticalIndex(pattern);
    if (typeof vindex === "number") {
      sum += vindex;
      continue;
    }

    const hindex = getHorizontalIndex(pattern);
    if (typeof hindex === "number") {
      sum = sum + 100 * hindex;
    }

    if (typeof vindex !== "number" && typeof hindex !== "number") {
      console.log(pattern);
      console.log("pattern index", i);
      throw Error("no match for pattern");
    }
  }

  console.log(sum);
};

const processPattern = (inputPattern: Pattern, i: number): number | null => {
  const vindex0 = getVerticalIndex(inputPattern);
  const hindex0 = getHorizontalIndex(inputPattern);

  let maybeHindex: number | null = null;
  let maybeVindex: number | null = null;

  // Iterate through every character in the matrix, attempting to swap the character
  // and see if that produces a horizontal or a vertical reflection.
  for (let row = 0; row < inputPattern.length; row++) {
    for (let col = 0; col < inputPattern[0].length; col++) {
      const newPattern = [...inputPattern];

      const char = newPattern[row][col];
      const newRow = newPattern[row].split("");
      const newChar = char === "#" ? "." : "#";

      newRow[col] = newChar;
      newPattern[row] = newRow.join("");

      const vindex = getVerticalIndex(newPattern);
      if (typeof vindex === "number") {
        // console.log(inputPattern);
        // console.log(newPattern);
        // console.log(
        //   `Found a vindex by swapping (${row}, ${col}) from ${char} to ${newChar}`
        // );

        if (vindex !== vindex0) {
          return vindex;
        }
        maybeVindex = vindex;
      }

      const hindex = getHorizontalIndex(newPattern);
      if (typeof hindex === "number") {
        if (hindex !== hindex0) return 100 * hindex;
        maybeHindex = hindex;
      }
    }
  }

  console.log(
    "NO NEW REFLECTIONS FOUND",
    i,
    "maybeVindex",
    maybeVindex,
    "vindex0",
    vindex0,
    "maybeHindex",
    maybeHindex,
    "hindex0",
    hindex0
  );

  if (maybeVindex) return maybeVindex;
  if (maybeHindex) return 100 * maybeHindex;

  return null;
};

const partTwo = () => {
  let sum = 0;

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const result = processPattern(pattern, i);

    if (typeof result !== "number") {
      throw Error("could not figure out pattern");
    }

    sum += result;
  }

  console.log("RESULLT:");
  console.log(sum);
};

// partOne();
partTwo();
