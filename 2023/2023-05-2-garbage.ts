import { getInput } from "./utils";

const input = getInput(__filename, true);

interface Spec {
  destinationStart: number;
  sourceStart: number;
  length: number;
}

const specs: { [k: string]: Spec[] } = {
  "seed-to-soil": [],
  "soil-to-fertilizer": [],
  "fertilizer-to-water": [],
  "water-to-light": [],
  "light-to-temperature": [],
  "temperature-to-humidity": [],
  "humidity-to-location": [],
};

const parseSeeds = (line: string): { start: number; length: number }[] => {
  const parts = line.substring("seeds: ".length).split(" ");

  //   const seeds: number[] = [];
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

let seedRanges: { start: number; length: number }[] = [];
const lines = input.split("\n");

let currentKey: string | null = null;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (!line) {
    continue;
  }

  if (line.startsWith("seeds")) {
    seedRanges = parseSeeds(line);
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

console.log(seedRanges);
console.log(specs);

let smallestLocation = -1;
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
      //   console.log("FOUND", target, spec, diff, spec.destinationStart + diff);
      result = spec.destinationStart + diff;
      break;
    }
  }
  return result;
};

const tryIt = (seed: number): boolean => {
  const soil = findLocation(seed, specs["seed-to-soil"]);
  const fertilizer = findLocation(soil, specs["soil-to-fertilizer"]);
  const water = findLocation(fertilizer, specs["fertilizer-to-water"]);
  const light = findLocation(water, specs["water-to-light"]);
  const temperature = findLocation(light, specs["light-to-temperature"]);
  const humidity = findLocation(temperature, specs["temperature-to-humidity"]);
  const location = findLocation(humidity, specs["humidity-to-location"]);
  //   console.log(
  //     "seed",
  //     seed,
  //     "soil",
  //     soil,
  //     "fertilizer",
  //     fertilizer,
  //     "water",
  //     water,
  //     "light",
  //     light,
  //     "temp",
  //     temperature,
  //     "humditiy",
  //     humidity,
  //     "location",
  //     location
  //   );

  if (smallestLocation < 0) {
    smallestLocation = location;
    return true;
  } else if (location < smallestLocation) {
    smallestLocation = location;
    return true;
  }
  return false;
};

for (let i = 0; i < seedRanges.length; i++) {
  const seedRange = seedRanges[i];
  for (let i = 0; i < seedRange.length; i++) {
    const seed = seedRange.start + i;
    const found = tryIt(seed);
    if (found) {
      console.log("seed", seed, found);
      break;
    }
  }

  //   const seedToSoilSpec = specs["seed-to-soil"].find((spec) => {
  //     return (
  //       seedRange.start >= spec.sourceStart &&
  //       seedRange.start &&
  //       seedRange.start + seedRange.length <= spec.sourceStart + spec.length
  //     );
  //   });
  //   if (!seedToSoilSpec) {
  //     console.log(seedRange);
  //     console.log(specs["seed-to-soil"]);
  //     throw Error(`Could not find seed to soil spec`);
  //   }
  //   console.log(seedRange, seedToSoilSpec);
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
//       //   console.log("FOUND", target, spec, diff, spec.destinationStart + diff);
//       result = spec.destinationStart + diff;
//       break;
//     }
//   }
//   return result;
// };

// const findSpec = (
//   range: { start: number; length: number },
//   specs: Spec[]
// ): Spec => {
//   return specs.find((spec) => {
//     return (
//       range.start >= spec.sourceStart &&
//       range.start + range.length <= spec.sourceStart + spec.length
//     );
//   });
// };

// let smallestLocation = -1;

// for (let i = 0; i < seedRanges.length; i++) {
//   if (i > 0) break;

//   const seedRange = seedRanges[i];
//   console.log("processing seed range", seedRange);

//   const soilSpec = findSpec(seedRange, specs["seed-to-soil"]);

//   const soilRange = {
//     start: soilSpec.destinationStart,
//     length: soilSpec.length,
//   };
//   console.log("soil range", soilSpec, soilRange);

//   const fertilizerSpec = findSpec(soilRange, specs["soil-to-fertilizer"]);

//   const fertilizerRange = {
//     start: fertilizerSpec.destinationStart,
//     length: fertilizerSpec.length,
//   };
//   console.log("ferrtilizer range", fertilizerSpec);

//   //   for (let j = 0; j < seedRange.length; j++) {
//   //     const seed = seedRange.start + j;
//   //     const soil = findLocation(seed, specs["seed-to-soil"]);
//   //     const fertilizer = findLocation(soil, specs["soil-to-fertilizer"]);
//   //     const water = findLocation(fertilizer, specs["fertilizer-to-water"]);
//   //     const light = findLocation(water, specs["water-to-light"]);
//   //     const temperature = findLocation(light, specs["light-to-temperature"]);
//   //     const humidity = findLocation(
//   //       temperature,
//   //       specs["temperature-to-humidity"]
//   //     );
//   //     const location = findLocation(humidity, specs["humidity-to-location"]);
//   //     // console.log(
//   //     //   "seed",
//   //     //   seed,
//   //     //   "soil",
//   //     //   soil,
//   //     //   "fertilizer",
//   //     //   fertilizer,
//   //     //   "water",
//   //     //   water,
//   //     //   "light",
//   //     //   light,
//   //     //   "temp",
//   //     //   temperature,
//   //     //   "humditiy",
//   //     //   humidity,
//   //     //   "location",
//   //     //   location,
//   //     //   "SMALLEST",
//   //     //   smallestLocation
//   //     // );

//   //     if (smallestLocation < 0) {
//   //       smallestLocation = location;
//   //     } else if (location < smallestLocation) {
//   //       smallestLocation = location;
//   //       break;
//   //     } else {
//   //       //   break;
//   //     }
//   //   }
// }

console.log(smallestLocation);
