import { getInput } from "./utils";

const input = getInput(__filename, true);
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
  return specsBySource;
};

const findIntersectingSpecs = (source: Range, specs: Spec[]): Spec[] => {
  return specs.filter(({ sourceStart, sourceEnd }) => {
    return sourceStart <= source.start && sourceEnd >= source.end;
  });
};

// Parse input
const seedRanges = parseSeedRanges(firstLine);
const specsBySource = parseSpecsBySource();

const getNextRange = (range: Range, specs: Spec[]): Range => {
  let intersectingSpecs = findIntersectingSpecs(range, specs);
  //  Any source numbers that aren't mapped correspond to the same destination number.
  //  So, seed number 10 corresponds to soil number 10.
  if (intersectingSpecs.length === 0) {
    return range;
  }
  if (intersectingSpecs.length > 1) {
    console.log("!!!!!!!");
    throw Error("too many specs");
  }

  let nextSpec = intersectingSpecs[0];
  let sourceOffset = range.start - nextSpec.sourceStart;
  let nextDestinationStart = nextSpec.destinationStart + sourceOffset;

  let nextRange: Range = {
    start: nextDestinationStart,
    size: range.size,
    end: nextDestinationStart + range.size,
  };

  return nextRange;
};

const sourceMapping = {
  seed: "soil",
  soil: "fertilizer",
  fertilizer: "water",
  water: "light",
  light: "temperature",
  temperature: "humidity",
  humidity: "location",
};

for (let i = 0; i < seedRanges.length; i++) {
  if (i > 0) break;

  let sourceKey = "seed";
  let destinationKey = "soil";

  while (sourceKey !== "location") {
    let seedRange = seedRanges[i];
    let destinationSpecs = specsBySource[sourceKey];
    const nextRange = getNextRange(seedRange, destinationSpecs);
    console.log(sourceKey, " -> ", destinationKey, nextRange);

    // console.log(destinationSpecs);

    sourceKey = destinationKey;
    destinationKey = sourceMapping[destinationKey];
  }
}

// const isInRange = (target: number, start: number, length: number): boolean => {
//   return target >= start && target <= start + length;
// };

// const findLocation = (target: number, specs: Spec[]): number => {
//   //   console.log("\n");/
//   //   console.log(target, specs);

//   let result = target;
//   for (let i = 0; i < specs.length; i++) {
//     const spec = specs[i];
//     const inRange = isInRange(target, spec.sourceStart, spec.length);
//     if (inRange) {
//       const diff = target - spec.sourceStart;
//       console.log("FOUND", target, spec, diff, spec.destinationStart + diff);
//       result = spec.destinationStart + diff;
//       break;
//     }
//   }
//   return result;
// };

// let smallestLocation = Number.MAX_VALUE;

// for (let i = 0; i < seedRanges.length; i++) {
//   const seedRange = seedRanges[i];
//   const seedMin = seedRange.start;
//   const seedMax = seedRange.start + seedRange.length;

//   // Get all of the seed-to-soil ranges that are covered by this seed range.
//   const seedToSoilSpecs = specsBySource["seed"].filter((spec) => {
//     return (
//       seedMin >= spec.sourceStart || seedMax >= spec.sourceStart + spec.length
//     );
//   });

//   console.log("\n");
//   console.log("seed range:", seedRange);
//   console.log("covered by", seedToSoilSpecs.length, "seed-to-soil maps");
// }

// //   for (let j = 0; j < seedToSoilSpecs.length; j++) {
// //     // const seedToSoilSpec = seedToSoilSpecs[j];
// //     const soil = findLocation(seedMin, seedToSoilSpecs);
// //     console.log("\n");
// //     console.log("seed range", seedRange);
// //     console.log(seedToSoilRanges.length);
// //     // const fertilizer = findLocation(soil, specs["soil-to-fertilizer"]);
// //     // const water = findLocation(fertilizer, specs["fertilizer-to-water"]);
// //     // const light = findLocation(water, specs["water-to-light"]);
// //     // const temperature = findLocation(light, specs["light-to-temperature"]);
// //     // const humidity = findLocation(
// //     //   temperature,
// //     //   specs["temperature-to-humidity"]
// //     // );
// //     // const location = findLocation(humidity, specs["humidity-to-location"]);
// //   }
// // }

// // // Find the smallest location
// // let smallestLocation = Number.MAX_VALUE;

// // const recurse = (sourceKey: string, sourceValue: number) => {
// //   if (sourceKey === "location") {
// //     if (sourceValue < smallestLocation) {
// //       smallestLocation = sourceValue;
// //     }
// //     // console.log("done");
// //     return;
// //   }

// //   const specsForSource = specsBySource[sourceKey];

// //   for (let i = 0; i < specsForSource.length; i++) {
// //     const spec = specsForSource[i];

// //     // Out of range, so continue
// //     if (sourceValue < spec.sourceStart) {
// //       //   console.log("source too big");
// //       continue;
// //     }

// //     const diff = sourceValue - spec.sourceStart;
// //     // if (diff > spec.length) {
// //     //   console.log("spec too long");
// //     //   continue;
// //     // }

// //     const nextStart = spec.destinationStart + diff;
// //     const nextSourceKey = spec.destinationKey;

// //     // console.log(sourceKey, sourceValue, "->", nextSourceKey, nextStart);

// //     recurse(nextSourceKey, nextStart);
// //   }
// // };

// // for (let i = 0; i < seedRanges.length; i++) {
// //   const seedRange = seedRanges[i];
// //   const firstSeed = seedRange.start;

// //   console.log("testing seed", firstSeed);
// //   recurse("seed", firstSeed);

// //   // Test each seed in the seed range for seed to soil
// //   //   for (let j = 0; j < specsBySource["seed"].length; j++) {
// //   // const
// //   // recurse()
// //   // const seedToSoilSpec = specsBySource["seed"][j];

// //   // // Out of range, so continue
// //   // if (seedRange.start < seedToSoilSpec.sourceStart) continue;

// //   // const diff = seedRange.start - seedToSoilSpec.sourceStart;

// //   // // Out of range, so continue
// //   // if (diff > seedToSoilSpec.length) continue;

// //   // const nextStart = seedToSoilSpec.destinationStart + diff;
// //   // console.log(seedRange, nextStart);
// //   //   }
// //   //   // Recurse through each seed in the range of seeds
// //   //   for (let j = 0; j < length; j++) {
// //   //     const seed = start + j;
// //   //     recurseToLocation("seed", seed);
// //   //   }
// // }

// // console.log(smallestLocation);
