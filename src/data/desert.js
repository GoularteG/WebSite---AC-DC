import { billboardDistance, chapters, roadX } from './journey.js';

const random = (index, salt) => {
  const n = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
const smooth = (a, b, value) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// A shared surface keeps plants and stones rooted in the alluvial fans. The
// driving/exhibit corridor stays level; the basin sinks away before the finale.
export function desertHeight(offset, distance) {
  const lateral = Math.abs(offset);
  const side = Math.sign(offset);
  const fade = smooth(-145, -105, distance) * (1 - smooth(610, 680, distance));
  const fan = smooth(18, 66, lateral) * (2.15 + .85 * Math.sin(distance * .037 + lateral * .053)
    + .3 * Math.sin(distance * .081 - lateral * .11));
  const ridge = Math.exp(-Math.pow((lateral - 189) / 54, 2))
    * (22 + 12 * Math.sin(distance * .022 + side * 1.7) + 7 * Math.sin(distance * .063 + side));
  const farRidge = Math.exp(-Math.pow((lateral - 310) / 48, 2))
    * (35 + 15 * Math.sin(distance * .016 - side * 2) + 9 * Math.sin(distance * .049));
  const drainage = .5 + .5 * Math.abs(Math.sin(distance * .097 + lateral * .041));
  return -.09 + fade * smooth(18, 60, lateral) * (fan + (ridge + farRidge) * (.82 + drainage * .18));
}
// Sink the first metres of the basin below the flat road plane. Its visible
// edge then follows the irregular fan height instead of drawing a straight seam.
export function basinSurfaceHeight(offset, distance) {
  const lateral = Math.abs(offset);
  const edge = 1 - smooth(18, 35 + 4.5 * Math.sin(distance * .043 + Math.sign(offset)), lateral);
  const ripple = .75 + .25 * Math.sin(distance * .083 + lateral * .17);
  return desertHeight(offset, distance) - .32 * edge * ripple;
}
const rooted = (distance, side, offset, burial = .03) =>
  [roadX(distance) + side * offset, Math.max(-.09, basinSurfaceHeight(side * offset, distance)) - burial, -distance];

// Keep the nearer, larger pieces away from the chapter boards on both layouts.
const boards = chapters.slice(0, 8).flatMap((chapter, index) => [
  { distance: billboardDistance(chapter), side: index % 2 ? 1 : -1 },
  { distance: billboardDistance(chapter, true), side: index === 0 ? -1 : 1 },
]);
const clearOfBoard = (distance, side, offset, radius = 0) =>
  boards.every(board => board.side !== side || board.distance - distance < -4
    || board.distance - distance > 28 || offset - radius > 29);

// Asymmetric groups have a dominant butte and smaller broken spurs, with open
// stretches between. Their foot slopes connect to the basin rather than float.
const outcrops = [-34, 88, 212, 355, 477, 574];
export const desertMesas = outcrops.flatMap((center, cluster) =>
  Array.from({ length: cluster % 3 === 1 ? 4 : 3 }, (_, member) => {
    const index = cluster * 7 + member;
    const distance = center + (member - 1) * 22 + (random(index, 1) - .5) * 15;
    const side = member === 3 ? (cluster % 2 ? 1 : -1) : (cluster % 2 ? -1 : 1);
    const width = member === 1 ? 26 + random(index, 3) * 9 : 15 + random(index, 3) * 13;
    // Keep the silhouette behind the exhibits, but let the rock wall visibly
    // approach the road instead of reading as a distant backdrop.
    const offset = width + 23 + random(index, 4) * 18 + (member === 0 ? 5 : 0);
    return {
      distance, side, width, offset,
      position: rooted(distance, side, offset, .4),
      height: member === 1 ? 20 + random(index, 5) * 15 : 10 + random(index, 5) * 17,
      depth: .55 + random(index, 6) * .38,
      rotation: random(index, 7) * Math.PI * 2,
      tone: index % 5,
      shape: index % 3,
    };
  })
);

// Small angular stones follow a few dry washes; tiny satellite fragments make
// each patch read as weathered geology instead of evenly scattered pebbles.
const stonePatches = [-38, 20, 83, 140, 171, 226, 274, 309, 353, 391, 432, 472, 518, 548, 599];
export const desertRocks = stonePatches.flatMap((center, patch) => {
  const side = patch % 3 === 0 ? -1 : 1;
  return Array.from({ length: 12 + patch % 4 }, (_, member) => {
    const index = patch * 17 + member;
    const distance = center + (random(index, 8) - .5) * 37;
    const spread = 12 + random(patch, 11) * 12 + (random(index, 9) - .5) * 7;
    const width = member < 4 ? 1.6 + random(index, 10) * 1.65 : .32 + random(index, 10) * 1.05;
    const roadsideSpread = Math.max(11.5 + width, spread);
    const safeSpread = clearOfBoard(distance, side, roadsideSpread, width) ? roadsideSpread : 32 + width + random(index, 43) * 6;
    return {
      distance, side, width, offset: safeSpread,
      position: rooted(distance, side, safeSpread, .1),
      height: width * (.45 + random(index, 12) * .6),
      depth: .68 + random(index, 13) * .3,
      rotation: random(index, 14) * Math.PI * 2,
      tone: index % 4,
      shape: index % 3,
    };
  });
});

const scrubPatches = [-32, 15, 66, 107, 131, 188, 234, 263, 327, 363, 394, 465, 503, 527, 591];
export const desertScrub = scrubPatches.flatMap((center, patch) =>
  Array.from({ length: 12 + patch % 6 }, (_, member) => {
    const index = patch * 23 + member;
    const distance = center + (random(index, 15) - .5) * 47;
    const side = random(index, 16) > .5 ? 1 : -1;
    const nearby = 11 + random(index, 17) * 17;
    const offset = clearOfBoard(distance, side, nearby, 1.4) ? nearby : 32 + random(index, 44) * 8;
    return {
      distance, side, offset,
      position: rooted(distance, side, offset),
      width: .48 + random(index, 19) * .88,
      height: .35 + random(index, 18) * .65,
      depth: .75 + random(index, 20) * .24,
      rotation: random(index, 21) * Math.PI * 2,
      tone: index % 4,
    };
  })
);

// Ground-growing Mojave yucca: short fibrous core and a crown rooted at soil
// level, rather than a palm-like rosette balanced on a thin pole.
const yuccaGroves = [28, 105, 168, 218, 325, 403, 485, 556];
export const desertYucca = yuccaGroves.flatMap((center, grove) =>
  Array.from({ length: grove === 2 ? 5 : 4 }, (_, member) => {
    const index = grove * 7 + member;
    const distance = center + (random(index, 22) - .5) * 58;
    const side = random(index, 23) > .45 ? 1 : -1;
    const nearby = 12 + random(index, 24) * 17;
    const offset = clearOfBoard(distance, side, nearby, 1.5) ? nearby : 32 + random(index, 45) * 8;
    return {
      distance, side, offset,
      position: rooted(distance, side, offset),
      width: .62 + random(index, 25) * .65,
      height: .6 + random(index, 26) * .85,
      depth: .9,
      rotation: random(index, 27) * Math.PI * 2,
      tone: index % 4,
    };
  })
);

// Small foreground detail supplies parallax without competing with the exhibits.
const vergePatches = [-22, 63, 125, 181, 240, 301, 418, 478, 537, 596];
export const desertPebbles = vergePatches.flatMap((center, patch) =>
  Array.from({ length: 24 }, (_, member) => {
    const index = patch * 29 + member;
    const distance = center + (random(index, 31) - .5) * 33;
    const side = random(index, 32) > .5 ? 1 : -1;
    const offset = 9 + random(index, 33) * 8;
    const width = .07 + random(index, 34) * .17;
    return { distance, side, offset, width,
      position: rooted(distance, side, offset, .015),
      height: width * (.35 + random(index, 35) * .5), depth: .7,
      rotation: random(index, 36) * Math.PI * 2, tone: index % 4 };
  })
);
export const desertVergeScrub = vergePatches.flatMap((center, patch) =>
  Array.from({ length: 5 }, (_, member) => {
    const index = patch * 11 + member;
    const distance = center + (random(index, 37) - .5) * 22;
    const side = random(index, 38) > .5 ? 1 : -1;
    const offset = 10.8 + random(index, 39) * 1.8;
    return { distance, side, offset,
      position: rooted(distance, side, offset, .005),
      width: .3 + random(index, 40) * .28, height: .26 + random(index, 41) * .25,
      depth: .8, rotation: random(index, 42) * Math.PI * 2, tone: index % 4 };
  })
);

// Sparse colonies: leave exhibit approaches and the volcanic finale open.
export const desertCacti = Array.from({length:32},(_,index)=>{
  const cluster=Math.floor(index/2), distance=-10+cluster*38+(index%2)*7;
  const side=cluster%2?1:-1, offset=13+random(index,93)*13+(index%2)*6;
  return {distance,side,offset,position:rooted(distance,side,offset,.06),width:.75+random(index,94)*.4,
    height:.65+random(index,95)*.65,depth:.9,rotation:random(index,96)*1.5-.75,tone:index%4};
}).filter(plant=>clearOfBoard(plant.distance,plant.side,plant.offset,1.3));
