import { getInput } from "./utils";
import chalk from "chalk";

const doesItFit = (template: string, index: number, size: number): boolean => {
  if (index + size >= template.length) return false;

  const substr = template.substring(index, size);
  const hasEmptySpace = substr.split("").findIndex((s) => s === ".") >= 0;
  if (hasEmptySpace) return false;

  return true;
};

console.log(doesItFit("???.###", 1, 0), true);
console.log(doesItFit("???.###", 2, 0), true);
console.log(doesItFit("???.###", 3, 0), true);
console.log(doesItFit("???.###", 3, 1), true);
console.log(doesItFit("???.###", 3, 4), true);
console.log(doesItFit("???.###", 3, 5), false);

console.log(doesItFit("???.###", 4, 0), false);
console.log(doesItFit("???.###", 12, 0), false);
// console.log();

const countArrangements = (template: string, groups: number[]) => {
  let index = 0;
  let groupIndex = 0;

  while (index < template.length) {
    const group = groups[groupIndex];
    const fitsAtIndex = doesItFit(template, index, group);

    if (fitsAtIndex) {
      console.log("it fits");
      groupIndex++;
    }

    index++;
  }

  console.log();
  console.log(template);
  console.log(groups);
  console.log("group index", groupIndex);

  return 0;
};

const partOne = () => {
  const input = getInput(__filename, true);
  let lines = input.split("\n").filter((l) => !!l);
  lines = [lines[0]]; // FIXME remove this

  let sum = lines.reduce((acc, line) => {
    const parts = line.split(" ");
    const template = parts[0];
    const groups = parts[1].split(",").map((i) => parseInt(i));

    return acc + countArrangements(template, groups);
  }, 0);

  console.log();
  console.log(sum);
};

partOne();
