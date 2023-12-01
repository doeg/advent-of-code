import fs from 'fs';
import path from 'path';

export const getInput = (filename: string, example?: boolean): string => {
	const basename = path.basename(filename, '.ts');

	const inputFile = `${basename}.txt`;
	if (fs.existsSync(inputFile) && !example) {
		return fs.readFileSync(inputFile, {
			encoding: 'utf8', 
			flag: 'r',
		});
	}

	const exampleFile = `${basename}-example.txt`
	if (fs.existsSync(exampleFile)) {
		return fs.readFileSync(exampleFile, {
			encoding: 'utf8', 
			flag: 'r',
		});
	}
	return basename;
}