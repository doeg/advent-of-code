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

const patterns = parsePatterns();
patterns.forEach((pattern) => {
  console.log(pattern);
});
console.log(patterns.length);
