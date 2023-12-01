import { getInput } from "./utils";

const input = getInput(__filename);

const sum = input.split('\n').reduce((acc, line) => {
	const matches = line.match(/(\d)/g);
	if (!matches) return acc;

	const first = parseInt(matches[0]);
	const last = parseInt(matches[matches.length - 1]);
	const n = parseInt(`${first}${last}`);
	return acc + n;
}, 0)

console.log(sum);
