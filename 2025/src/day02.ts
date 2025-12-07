import { readFile } from "./utils";

const parseRanges = (input: string): { start: number; end: number }[] => {
  const ranges = input.split(",");
  return ranges.map((range) => {
    const [start, end] = range.split("-");
    return { start: parseInt(start, 10), end: parseInt(end, 10) };
  });
};

export const partOne = (input: string) => {
  let answer = 0;
  parseRanges(input).forEach(({ start, end }) => {
    for (let current = start; current <= end; current++) {
      const currentStr = `${current}`;

      // Since we're looking for strings with a number repeated exactly twice
      // with no extra digits in between, then invalid numbers must have
      // an even number of digits.
      if (currentStr.length % 2 !== 0) {
        continue;
      }

      const substrLength = currentStr.length / 2;
      const firstHalf = currentStr.slice(0, substrLength);
      const secondHalf = currentStr.slice(substrLength);

      if (firstHalf === secondHalf) {
        answer += current;
      }
    }
  });

  return answer;
};

export const splitEvenSubstrings = (
  source: string,
  substringLength: number
): string[] => {
  if (source.length % substringLength !== 0) {
    return [];
  }

  const substrings = [];
  for (let i = 0; i < source.length; i += substringLength) {
    substrings.push(source.slice(i, i + substringLength));
  }
  return substrings;
};

export const partTwo = (input: string) => {
  let answer = 0;
  parseRanges(input).forEach(({ start, end }) => {
    for (let current = start; current <= end; current++) {
      const currentStr = `${current}`;

      // Check each divisor up to the number of digits.
      for (let divisor = 1; divisor <= currentStr.length / 2; divisor++) {
        const substrings = splitEvenSubstrings(currentStr, divisor);
        if (substrings.length < 2) {
          continue;
        }

        const isMatch = substrings.every((s) => s === substrings[0]);
        if (isMatch) {
          answer += current;
          break;
        }
      }
    }
  });

  return answer;
};

const run = async () => {
  const input = await readFile();
  console.log(partOne(input));
  console.log(partTwo(input));
};

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
