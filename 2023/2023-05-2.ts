import { getInput } from "./utils";

const input = getInput(__filename, false);
const [firstLine, ...otherLines] = input.split("\n");

interface Range {
  size: number;
  start: number;
  end: number;
}

interface Spec {
  sourceKey: string; // e.g., "soil"
  sourceStart: number;
  sourceEnd: number;
  destinationStart: number;
  destinationEnd: number;
  destinationKey: string; // e.g., "fertilizer"
  size: number;
}

type SpecsBySource = { [k: string]: Spec[] };

const parseSeedRanges = (line: string): Range[] => {
  const parts = line.substring("seeds: ".length).split(" ");
  const seedRanges: Range[] = [];
  let i = 0;
  while (i < parts.length - 1) {
    const start = parseInt(parts[i]);
    const size = parseInt(parts[i + 1]);
    seedRanges.push({ start, end: start + size, size });
    i += 2;
  }
  return seedRanges;
};

const parseSpecsBySource = (): SpecsBySource => {
  const specsBySource: SpecsBySource = {};

  let sourceKey;
  let destinationKey;

  for (let i = 0; i < otherLines.length; i++) {
    const line = otherLines[i];

    // Skip empty lines
    if (!line) continue;

    // Register a new section of the spec
    const isTitle = /((?:\w|-)+) map:/.exec(line);
    if (!!isTitle) {
      const [sk, dk] = isTitle[1].split("-to-");
      sourceKey = sk;
      destinationKey = dk;
      specsBySource[sourceKey] = [];
      continue;
    }

    const [destinationStart, sourceStart, size] = line
      .split(" ")
      .map((i) => parseInt(i));

    specsBySource[sourceKey].push({
      destinationKey,
      sourceKey,
      destinationStart,
      destinationEnd: destinationStart + size,
      sourceStart,
      sourceEnd: sourceStart + size,
      size,
    });
  }

  Object.keys(specsBySource).forEach((sourceKey) => {
    specsBySource[sourceKey] = specsBySource[sourceKey].sort(
      (a, b) => a.destinationStart - b.destinationStart
    );
  });

  return specsBySource;
};

const findSpecInRangeOfValue = (value: number, specs: Spec[]): Spec | null => {
  return (
    specs.find(
      (s) => s.destinationStart <= value && s.destinationEnd > value
    ) || null
  );
};

const getValue = (value: number, key: string): number => {
  let nextValue = value;
  const specInRange = findSpecInRangeOfValue(value, specsBySource[key]);

  if (specInRange) {
    const offset = value - specInRange.destinationStart;
    nextValue = specInRange.sourceStart + offset;
  }
  return nextValue;
};

// Parse input
const seedRanges = parseSeedRanges(firstLine);
const specsBySource = parseSpecsBySource();

for (let location = 0; location < Number.MAX_VALUE; location++) {
  const humidity = getValue(location, "humidity");
  const temperature = getValue(humidity, "temperature");
  const light = getValue(temperature, "light");
  const water = getValue(light, "water");
  const fertilizer = getValue(water, "fertilizer");
  const soil = getValue(fertilizer, "soil");
  const seed = getValue(soil, "seed");

  const isValidSeed = !!seedRanges.find((s) => {
    return s.start <= seed && s.start + s.size > seed;
  });

  if (isValidSeed) {
    console.log(
      seed,
      soil,
      fertilizer,
      water,
      light,
      temperature,
      humidity,
      location
    );

    console.log(location);
    break;
  }
}
