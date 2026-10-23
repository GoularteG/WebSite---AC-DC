import { roadX } from './journey.js';

// Isolated pullout lights; the open desert between them remains unlit.
const pullouts = [29, 98, 218, 336, 452, 571, 678];
export const roadsideLamps = pullouts.map((distance, index) => {
  const side = index % 2 === 0 ? -1 : 1;
  return {
    distance,
    side,
    position: [roadX(distance) + side * 9.4, 0, -distance],
    head: [roadX(distance) + side * 6.65, 6.55, -distance],
  };
});
