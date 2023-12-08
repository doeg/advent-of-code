import { getInput } from "./utils";

const input = getInput(__filename, false);

const [instructionInput, , ...lines] = input.split("\n");
const instructions = instructionInput.split("");

// Parse input
type Instructions = { [k: string]: { L: string; R: string } };

const mapObj = lines.reduce((acc, line) => {
  if (!line) return acc;
  const [key, rest] = line.split(" = ");
  const left = rest.substring(1, 4);
  const right = rest.substring(6, 9);
  acc[key] = { L: left, R: right };
  return acc;
}, {} as Instructions);

let i = 0;
let key = "AAA";
let counter = 0;

while (i < instructions.length) {
  if (key === "ZZZ") break;

  counter++;

  const instruction = instructions[i];
  key = mapObj[key][instruction];

  i++;
  if (i >= instructions.length) i = 0;
}

console.log(counter);
