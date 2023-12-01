import { getInput } from "./utils";

const input = getInput(__filename);

const NUMBERS = [
	'one', 'two','three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
]

const getInt = (str: string): number => {
	const int = parseInt(str);
	if (!isNaN(int)) return int;

	const idx = NUMBERS.indexOf(str);
	if (idx < 0) throw Error(`invalid number ${str}`);
	return idx + 1;
}

const sum = input.split('\n').reduce((acc, line) => {
	const re = new RegExp(`(\\\d|${NUMBERS.join('|')})`, 'y');
	
	const matches: string[] = [];

	let lastIndex = 0;
	while (lastIndex < line.length) {
		re.lastIndex = lastIndex;
		lastIndex++;

		const match = re.exec(line);
		if (!match?.length) continue;

		matches.push(match[0]);
	}

	const first = getInt(matches[0]);
	const last = getInt(matches[matches.length - 1]);
	const n = parseInt(`${first}${last}`);

	return acc + n;
}, 0)

console.log(sum);
