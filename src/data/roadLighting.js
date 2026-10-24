import { roadX } from './journey.js';

// Isolated pullout lights; the open desert between them remains unlit.
const pullouts = [
  { distance: 67, side: 1 }, { distance: 139, side: -1 },
  { distance: 218, side: -1 }, { distance: 336, side: 1 },
  { distance: 452, side: -1 }, { distance: 571, side: 1 },
  { distance: 678, side: -1 },
];
export const roadsideLamps = pullouts.map(({ distance, side }) => {
  return {
    distance,
    side,
    position: [roadX(distance) + side * 9.4, 0, -distance],
    head: [roadX(distance) + side * 6.65, 6.55, -distance],
  };
});
