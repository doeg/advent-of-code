import { getInput } from "./utils";

const input = getInput(__filename, true);

interface Spec {
  destinationStart: number;
  destinationKey: string;
  sourceKey: string;
  sourceStart: number;
  length: number;
}

const parseSeeds = (line: string): { start: number; length: number }[] => {
  const parts = line.substring("seeds: ".length).split(" ");
  const seedRanges: { start: number; length: number }[] = [];
  let i = 0;
  while (i < parts.length - 1) {
    const start = parseInt(parts[i]);
    const length = parseInt(parts[i + 1]);
    seedRanges.push({ start, length });
    i += 2;
  }
  return seedRanges;
};

// Parse the text file

let seedRanges: { start: number; length: number }[] = [];
const specsBySource: { [k: string]: Spec[] } = {
  seed: [],
  soil: [],
  fertilizer: [],
  water: [],
  light: [],
  temperature: [],
  humidity: [],
};

let currentKey: string | null = null;
let currentSourceKey;
let currentDestKey;

const lines = input.split("\n");

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;

  if (line.startsWith("seeds")) {
    seedRanges = parseSeeds(line);
    continue;
  }

  const isTitle = /((?:\w|-)+) map:/.exec(line);
  if (!!isTitle) {
    currentKey = isTitle[1];
    const [sk, dk] = currentKey.split("-to-");
    currentSourceKey = sk;
    currentDestKey = dk;
    continue;
  }

  const parts = line.split(" ").map((i) => parseInt(i));
  console.log(currentSourceKey, currentDestKey, parts);

  specsBySource[currentSourceKey].push({
    destinationKey: currentDestKey,
    sourceKey: currentSourceKey,
    destinationStart: parts[0],
    sourceStart: parts[1],
    length: parts[2],
  });
}

console.log(seedRanges);
console.log(specsBySource);

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

let smallestLocation = Number.MAX_VALUE;

for (let i = 0; i < seedRanges.length; i++) {
  const seedRange = seedRanges[i];
  const seedMin = seedRange.start;
  const seedMax = seedRange.start + seedRange.length;

  // Get all of the seed-to-soil ranges that are covered by this seed range.
  const seedToSoilSpecs = specsBySource["seed"].filter((spec) => {
    return (
      seedMin >= spec.sourceStart || seedMax >= spec.sourceStart + spec.length
    );
  });

  console.log("\n");
  console.log("seed range:", seedRange);
  console.log("covered by", seedToSoilSpecs.length, "seed-to-soil maps");
}

//   for (let j = 0; j < seedToSoilSpecs.length; j++) {
//     // const seedToSoilSpec = seedToSoilSpecs[j];
//     const soil = findLocation(seedMin, seedToSoilSpecs);
//     console.log("\n");
//     console.log("seed range", seedRange);
//     console.log(seedToSoilRanges.length);
//     // const fertilizer = findLocation(soil, specs["soil-to-fertilizer"]);
//     // const water = findLocation(fertilizer, specs["fertilizer-to-water"]);
//     // const light = findLocation(water, specs["water-to-light"]);
//     // const temperature = findLocation(light, specs["light-to-temperature"]);
//     // const humidity = findLocation(
//     //   temperature,
//     //   specs["temperature-to-humidity"]
//     // );
//     // const location = findLocation(humidity, specs["humidity-to-location"]);
//   }
// }

// // Find the smallest location
// let smallestLocation = Number.MAX_VALUE;

// const recurse = (sourceKey: string, sourceValue: number) => {
//   if (sourceKey === "location") {
//     if (sourceValue < smallestLocation) {
//       smallestLocation = sourceValue;
//     }
//     // console.log("done");
//     return;
//   }

//   const specsForSource = specsBySource[sourceKey];

//   for (let i = 0; i < specsForSource.length; i++) {
//     const spec = specsForSource[i];

//     // Out of range, so continue
//     if (sourceValue < spec.sourceStart) {
//       //   console.log("source too big");
//       continue;
//     }

//     const diff = sourceValue - spec.sourceStart;
//     // if (diff > spec.length) {
//     //   console.log("spec too long");
//     //   continue;
//     // }

//     const nextStart = spec.destinationStart + diff;
//     const nextSourceKey = spec.destinationKey;

//     // console.log(sourceKey, sourceValue, "->", nextSourceKey, nextStart);

//     recurse(nextSourceKey, nextStart);
//   }
// };

// for (let i = 0; i < seedRanges.length; i++) {
//   const seedRange = seedRanges[i];
//   const firstSeed = seedRange.start;

//   console.log("testing seed", firstSeed);
//   recurse("seed", firstSeed);

//   // Test each seed in the seed range for seed to soil
//   //   for (let j = 0; j < specsBySource["seed"].length; j++) {
//   // const
//   // recurse()
//   // const seedToSoilSpec = specsBySource["seed"][j];

//   // // Out of range, so continue
//   // if (seedRange.start < seedToSoilSpec.sourceStart) continue;

//   // const diff = seedRange.start - seedToSoilSpec.sourceStart;

//   // // Out of range, so continue
//   // if (diff > seedToSoilSpec.length) continue;

//   // const nextStart = seedToSoilSpec.destinationStart + diff;
//   // console.log(seedRange, nextStart);
//   //   }
//   //   // Recurse through each seed in the range of seeds
//   //   for (let j = 0; j < length; j++) {
//   //     const seed = start + j;
//   //     recurseToLocation("seed", seed);
//   //   }
// }

// console.log(smallestLocation);
