import * as fs from "fs";

export const readFile = async () => {
  const filename = process.argv[2];
  return await fs.promises.readFile(filename, "utf8");
};

export const readLines = async () => {
  const file = await readFile();
  return file.split(/\r?\n/);
};
