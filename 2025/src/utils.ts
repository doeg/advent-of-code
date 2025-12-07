import * as fs from "fs";

export const readLines = async () => {
  const filename = process.argv[2];
  const file = await fs.promises.readFile(filename, "utf8");
  return file.split(/\r?\n/);
};
