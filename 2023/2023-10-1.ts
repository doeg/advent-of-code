import { getInput } from "./utils";

const input = getInput(__filename, true);

interface GraphNode {
  x: number;
  y: number;
  s: string;
}

const lines = input.split("\n");
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;

  const cells = line.split("");
  console.log(cells);
}
