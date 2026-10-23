import { roadX } from './journey.js';

const random = (index, salt) => {
  const n = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

// Leave the road, its shoulder and the historical billboards unobstructed.
export const desertMesas = Array.from({ length: 37 }, (_, index) => {
  const distance = -64 + index * 18.5;
  const side = index % 2 ? 1 : -1;
  const width = 9 + random(index, 1) * 15;
  const offset = 52 + random(index, 2) * 53;
  return {
    distance, side, width, offset,
    position: [roadX(distance) + side * offset, -.08, -distance],
    height: 11 + random(index, 3) * 20,
    depth: .65 + random(index, 4) * .55,
    rotation: random(index, 5) * Math.PI * 2,
    tone: index % 5,
  };
});

export const desertRocks = Array.from({ length: 76 }, (_, index) => {
  const distance = -40 + index * 8;
  const side = index % 2 ? 1 : -1;
  const width = 1.6 + random(index, 6) * 3.2;
  const offset = 27 + random(index, 7) * 12;
  return {
    distance, side, width, offset,
    position: [roadX(distance) + side * offset, -.07, -distance],
    height: 1.1 + random(index, 8) * 3.2,
    depth: .65 + random(index, 9) * .75,
    rotation: random(index, 10) * Math.PI * 2,
    tone: index % 4,
  };
});

// Low vegetation breaks up the empty shoulder without blocking the story boards.
export const desertScrub = Array.from({ length: 112 }, (_, index) => {
  const distance = -34 + index * 6.2;
  const side = index % 2 ? 1 : -1;
  const offset = 20 + random(index, 11) * 20;
  const height = .42 + random(index, 13) * .65;
  return {
    distance, side, offset,
    position: [roadX(distance) + side * offset, height * .48, -distance],
    width: .38 + random(index, 12) * .58,
    height,
    rotation: random(index, 14) * Math.PI * 2,
    tone: index % 4,
  };
});

export const desertYucca = Array.from({ length: 27 }, (_, index) => {
  const distance = -12 + index * 25;
  const side = index % 2 ? 1 : -1;
  const offset = 31 + random(index, 15) * 21;
  return {
    distance, side, offset,
    position: [roadX(distance) + side * offset, -.06, -distance],
    width: .9 + random(index, 16) * .7,
    height: 2.2 + random(index, 17) * 1.4,
    rotation: random(index, 18) * Math.PI * 2,
    tone: index % 4,
  };
});
