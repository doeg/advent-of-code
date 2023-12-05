import { getInput } from "./utils";

const input = getInput(__filename, false);

interface Spec {
  destinationStart: number;
  sourceStart: number;
  length: number;
}

let seeds: number[] = [];
const specs: { [k: string]: Spec[] } = {
  "seed-to-soil": [],
  "soil-to-fertilizer": [],
  "fertilizer-to-water": [],
  "water-to-light": [],
  "light-to-temperature": [],
  "temperature-to-humidity": [],
  "humidity-to-location": [],
};

const parseSeeds = (line: string): number[] => {
  return line
    .substring("seeds: ".length)
    .split(" ")
    .map((i) => {
      return parseInt(i);
    });
};

const parseSpec = (line: string): Spec => {};

const lines = input.split("\n");

let currentKey: string | null = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (!line) {
    continue;
  }

  if (line.startsWith("seeds")) {
    seeds = parseSeeds(line);
    continue;
  }

  const isTitle = /((?:\w|-)+) map:/.exec(line);
  if (!!isTitle) {
    currentKey = isTitle[1];
    continue;
  }

  if (!currentKey) {
    console.log(i);
    throw Error("no key");
  }

  const parts = line.split(" ").map((i) => parseInt(i));
  if (!(currentKey in specs)) throw Error(`invalid key ${currentKey}`);
  specs[currentKey].push({
    destinationStart: parts[0],
    sourceStart: parts[1],
    length: parts[2],
  });
}

console.log(seeds);
console.log(specs);

const isInRange = (target: number, start: number, length: number): boolean => {
  return target >= start && target <= start + length;
};

const findLocation = (target: number, specs: Spec[]): number => {
  //   console.log("\n");/
  //   console.log(target, specs);

  let result = target;
  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    const inRange = isInRange(target, spec.sourceStart, spec.length);
    if (inRange) {
      const diff = target - spec.sourceStart;
      console.log("FOUND", target, spec, diff, spec.destinationStart + diff);
      result = spec.destinationStart + diff;
      break;
    }
  }
  return result;
};

interface SeedMap {
  soil: number;
  fertilizer: number;
  water: number;
  light: number;
  temperature: number;
  humidity: number;
  location: number;
}
const seedMaps: {
  [seed: number]: SeedMap;
} = {};

let smallestLocation = -1;
for (let i = 0; i < seeds.length; i++) {
  const seed = seeds[i];
  const soil = findLocation(seed, specs["seed-to-soil"]);
  const fertilizer = findLocation(soil, specs["soil-to-fertilizer"]);
  const water = findLocation(fertilizer, specs["fertilizer-to-water"]);
  const light = findLocation(water, specs["water-to-light"]);
  const temperature = findLocation(light, specs["light-to-temperature"]);
  const humidity = findLocation(temperature, specs["temperature-to-humidity"]);
  const location = findLocation(humidity, specs["humidity-to-location"]);
  console.log(
    "seed",
    seed,
    "soil",
    soil,
    "fertilizer",
    fertilizer,
    "water",
    water,
    "light",
    light,
    "temp",
    temperature,
    "humditiy",
    humidity,
    "location",
    location
  );

  if (smallestLocation < 0) {
    smallestLocation = location;
  } else if (location < smallestLocation) {
    smallestLocation = location;
  }
}

console.log(smallestLocation);
