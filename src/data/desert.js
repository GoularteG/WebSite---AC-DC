import { roadX } from './journey.js';

const random = (index, salt) => {
  const n = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

// A dry basin: landforms gather in patches with long, quiet stretches between them.
const outcrops = [-38, 86, 204, 361, 486, 582];
export const desertMesas = outcrops.flatMap((center, cluster) =>
  Array.from({ length: cluster % 3 === 1 ? 4 : 3 }, (_, member) => {
    const index = cluster * 7 + member;
    const distance = center + (random(index, 1) - .5) * 69;
    const side = random(index, 2) > .48 ? 1 : -1;
    const width = 10 + random(index, 3) * 24;
    const offset = 67 + random(index, 4) * 63;
    return {
      distance, side, width, offset,
      position: [roadX(distance) + side * offset, -.08, -distance],
      height: 8 + random(index, 5) * 23,
      depth: .58 + random(index, 6) * .72,
      rotation: random(index, 7) * Math.PI * 2,
      tone: index % 5,
      shape: index % 3,
    };
  })
);

const stonePatches = [-38, 20, 83, 171, 226, 309, 391, 472, 548, 607];
export const desertRocks = stonePatches.flatMap((center, patch) =>
  Array.from({ length: 5 + patch % 4 }, (_, member) => {
    const index = patch * 11 + member;
    const distance = center + (random(index, 8) - .5) * 55;
    const side = random(index, 9) > .44 ? 1 : -1;
    const width = .55 + random(index, 10) * 2.55;
    const offset = 25 + random(index, 11) * 30;
    return {
      distance, side, width, offset,
      position: [roadX(distance) + side * offset, -.07, -distance],
      height: .35 + random(index, 12) * 2.25,
      depth: .68 + random(index, 13) * 1.1,
      rotation: random(index, 14) * Math.PI * 2,
      tone: index % 4,
    };
  })
);

const scrubPatches = [-32, 15, 66, 131, 188, 263, 327, 394, 465, 527, 601];
export const desertScrub = scrubPatches.flatMap((center, patch) =>
  Array.from({ length: 8 + patch % 6 }, (_, member) => {
    const index = patch * 19 + member;
    const distance = center + (random(index, 15) - .5) * 47;
    const side = random(index, 16) > .5 ? 1 : -1;
    const offset = 20 + random(index, 17) * 32;
    const height = .3 + random(index, 18) * .8;
    return {
      distance, side, offset,
      position: [roadX(distance) + side * offset, height * .48, -distance],
      width: .38 + random(index, 19) * .72,
      height,
      depth: .7 + random(index, 20) * .6,
      rotation: random(index, 21) * Math.PI * 2,
      tone: index % 4,
    };
  })
);

// Joshua trees are region-specific accents, not a regular roadside fence.
const yuccaGroves = [72, 218, 403, 560];
export const desertYucca = yuccaGroves.flatMap((center, grove) =>
  Array.from({ length: grove === 2 ? 3 : 4 }, (_, member) => {
    const index = grove * 7 + member;
    const distance = center + (random(index, 22) - .5) * 72;
    const side = random(index, 23) > .35 ? 1 : -1;
    const offset = 33 + random(index, 24) * 31;
    return {
      distance, side, offset,
      position: [roadX(distance) + side * offset, -.06, -distance],
      width: .85 + random(index, 25) * .7,
      height: 2.1 + random(index, 26) * 1.8,
      depth: 1,
      rotation: random(index, 27) * Math.PI * 2,
      tone: index % 4,
    };
  })
);
