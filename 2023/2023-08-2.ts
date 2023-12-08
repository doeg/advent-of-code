import { getInput } from "./utils";

const input = getInput(__filename, false);

const [instructionInput, , ...lines] = input.split("\n");
const instructions = instructionInput.split("");

type Instructions = {
  [k: string]: {
    L: string;
    R: string;
    // count: number;

    // The number of steps in each loop
    // loopCount: number;
  };
};

const mapObj = lines.reduce((acc, line) => {
  if (!line) return acc;
  const [key, rest] = line.split(" = ");
  const left = rest.substring(1, 4);
  const right = rest.substring(6, 9);
  acc[key] = { L: left, R: right };
  return acc;
}, {} as Instructions);

// console.log(instructions);
// console.log(mapObj);
// console.log();

const loops: { [startNode: string]: string[] } = {};

const startNodes = Object.keys(mapObj).filter((k) => k.charAt(2) === "A");

startNodes.forEach((node) => {
  let instructionCounter = 0;

  let currentPath: string[] = [];
  let currentKey = node;

  while (instructionCounter < instructions.length) {
    const instruction = instructions[instructionCounter];
    const nextNode = mapObj[currentKey][instruction];

    // We found a loop so we're done.
    // if (currentPath.indexOf(nextNode) >= 0) {
    //   break;
    // }

    currentPath.push(nextNode);
    currentKey = nextNode;

    if (nextNode.charAt(2) === "Z") {
      break;
    }
    instructionCounter++;
    if (instructionCounter >= instructions.length) {
      instructionCounter = 0;
    }
  }

  loops[node] = currentPath;
});

console.log(loops);
console.log("done");

console.log("calculate the LCM for these");
Object.values(loops).forEach((l) => {
  console.log(l.length);
});

// const endNodes = Object.keys(mapObj).filter((k) => k.charAt(2) === "Z");

// Walk each starting node, "**A", to figure out how long the paths are
// to each end node, "**Z". Bail when encountering a path to an existing end node
// 'cuz the path will definitely be longer.

// let steps = 0;
// let i = 0;
// console.log(currentNodes);

// while (i < instructions.length) {
//   const isDone = currentNodes.every((k) => k.charAt(2) === "Z");
//   if (isDone) {
//     console.log("done");
//     break;
//   }

//   const instruction = instructions[i];
//   let nextNodes = currentNodes.map((k) => {
//     // Increase counter
//     mapObj[k].count = mapObj[k].count + 1;

//     return mapObj[k][instruction];
//   });
//   currentNodes = nextNodes;
//   console.log(steps + 1, instruction, nextNodes);

//   steps++;

//   i++;
//   if (i >= instructions.length) i = 0;
// }

// console.log(mapObj);
// console.log(steps);
