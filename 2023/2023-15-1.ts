import { getInput } from "./utils";

const input = getInput(__filename, false);

// To run the HASH algorithm on a string, start with a current value of 0.
// Then, for each character in the string starting from the beginning:
//
// Determine the ASCII code for the current character of the string.
// Increase the current value by the ASCII code you just determined.
// Set the current value to itself multiplied by 17.
// Set the current value to the remainder of dividing itself by 256.
const hash = (s: string): number => {
  let value = 0;

  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    value += code;
    value = value * 17;
    value = value % 256;
  }

  return value;
};

const partOne = () => {
  const sequence = input.split(",");
  const sum = sequence.reduce((acc, seq) => {
    const val = hash(seq);
    acc += val;
    console.log(seq, val, acc);
    return acc;
  }, 0);

  console.log(sum);
};

partOne();

// console.log(hash("HASH"));
