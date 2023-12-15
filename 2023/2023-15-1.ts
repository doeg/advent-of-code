import { getInput } from "./utils";

const input = getInput(__filename, false);
const sequence = input.trim().split(",");

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
  const sum = sequence.reduce((acc, seq) => {
    const val = hash(seq);
    acc += val;
    console.log(seq, val, acc);
    return acc;
  }, 0);

  console.log(sum);
};

const logStep = (
  step: string,
  boxes: { [key: number]: { label: string; focalLength: number }[] }
) => {
  console.log();
  console.log(`After "${step}":`);
  Object.keys(boxes).forEach((boxNumber) => {
    const boxStrings = boxes[boxNumber].map((box) => {
      return `[${box.label} ${box.focalLength}]`;
    });
    console.log(`Box ${boxNumber}: ${boxStrings.join(" ")}`);
  });
  console.log();
};

const partTwo = () => {
  let boxes: { [key: number]: { label: string; focalLength: number }[] } = {};

  const lensLabels = new Set<string>();

  // Box up all of the lenses
  for (let i = 0; i < sequence.length; i++) {
    const step = sequence[i];

    // Each step begins with a sequence of letters that indicate
    // the label of the lens on which the step operates.
    // The result of running the HASH algorithm on the label
    // indicates the correct box for that step.
    const label = step.substring(0, 2);
    const operation = step.substring(2, 3);

    // Track the lens label, which is used later on for calculating the focal length.
    lensLabels.add(label);

    // Each step begins with a sequence of letters that indicate
    // the label of the lens on which the step operates.
    // The result of running the HASH algorithm on the label indicates the correct box for that step.
    const boxNumber = hash(label);

    // If needed, initialize the array to make it easier to read to/write from.
    if (!Array.isArray(boxes[boxNumber])) boxes[boxNumber] = [];

    // Find the index of the lens described by the current step in its box.
    const lensIndex = boxes[boxNumber].findIndex((box) => box.label === label);

    if (operation === "-") {
      // If the operation character is a dash (-), go to the relevant box
      // and remove the lens with the given label if it is present in the box.
      // Then, move any remaining lenses as far forward in the box as they can go
      // without changing their order, filling any space made by removing the indicated lens.
      // (If no lens in that box has the given label, nothing happens.)
      if (lensIndex >= 0) {
        console.log(step, `Removing ${label} from box ${boxNumber}`);
        boxes[boxNumber].splice(lensIndex, 1);
      }
    }

    if (operation === "=") {
      // If the operation character is an equals sign (=),
      // it will be followed by a number indicating the focal length
      // of the lens that needs to go into the relevant box
      const focalLength = parseInt(step.substring(3));
      if (isNaN(focalLength)) throw Error("invalid focal length");

      if (lensIndex >= 0) {
        boxes[boxNumber][lensIndex].focalLength = focalLength;
      } else {
        boxes[boxNumber].push({ label, focalLength });
      }
    }

    // logStep(step, boxes);
  }

  //   console.log(boxes);

  // Calculate the focusing power of all of the lenses
  let sum = 0;

  for (const label of lensLabels) {
    const boxNumber = hash(label);
    const lensIndex = boxes[boxNumber].findIndex((box) => box.label === label);
    if (lensIndex < 0) continue;

    const focalLength = boxes[boxNumber][lensIndex].focalLength;
    if (focalLength <= 0) throw Error("invalid focal length");

    const boxAdder = boxNumber + 1;
    const slotAdder = lensIndex + 1;
    const result = boxAdder * slotAdder * focalLength;

    console.log(
      `${label}: ${boxAdder} * ${slotAdder} * ${focalLength} = ${result} `
    );

    sum += result;
  }

  console.log(sum);
};

// partOne();
partTwo();
