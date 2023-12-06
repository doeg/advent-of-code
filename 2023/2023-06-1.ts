// EXAMPLE PART 1
// const times = [7, 15, 30]; // Record times
// const distances = [9, 40, 200]; // Record distances

// PART 1
// const times = [38, 67, 76, 73];
// const distances = [234, 1027, 1157, 1236];

// eXAMPLE PART 2
// const times = [71530];
// const distances = [940200];

// PART 2
const times = [38677673];
const distances = [234102711571236];

let mx = 1;

// For each race
for (let race = 0; race < times.length; race++) {
  console.log("RACE", race);
  const time = times[race];
  const recordDistance = distances[race];

  let ways = 0;
  for (let holdTime = 1; holdTime < time; holdTime++) {
    // Travel time is the amount of time left after the hold time.
    const travelTime = time - holdTime; // ms

    // Hold time is the same as speed; if held for 3mm, then the boat
    // travels for 3mm per millisecondsecond.
    const speed = holdTime; // mm / ms

    const travelDistance = speed * travelTime;
    if (travelDistance > recordDistance) ways++;
  }

  mx *= ways;
  console.log(ways);
}

console.log(mx);
