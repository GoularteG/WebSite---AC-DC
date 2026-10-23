import { roadX } from './journey.js';

// Sparse, staggered fixtures leave room for the historical boards and exhibits.
export const roadsideLamps = Array.from({ length: 17 }, (_, index) => {
  const distance = 18 + index * 42;
  const side = index % 2 === 0 ? -1 : 1;
  return {
    distance,
    side,
    position: [roadX(distance) + side * 9.4, 0, -distance],
    head: [roadX(distance) + side * 6.65, 6.55, -distance],
  };
});
