import { BufferGeometry, Color, Float32BufferAttribute } from 'three';
import { roadX } from '../../data/journey.js';

// Gravel gives way to a ragged sand verge rather than a ruler-straight brown strip.
export function createRoadShoulder(side) {
  const positions = [], colors = [], indices = [];
  const offsets = [5.45, 6.15, 7.5, 10.5, 14.5, 18.2];
  const heights = [-.035, -.038, -.047, -.06, -.075, -.105];
  const tones = ['#665c50', '#7d6d58', '#97806a', '#9b7e60', '#92765b', '#8d7158'];
  const count = 290;
  for (let row = 0; row <= count; row++) {
    const distance = -100 + row * 4;
    offsets.forEach((offset, column) => {
      const variation = column === 0 || column === 5 ? 0 :
        Math.sin(distance * .091 + column * 2 + side) * .42 + Math.sin(distance * .227 + side) * .2;
      positions.push(roadX(distance) + side * (offset + variation), heights[column], -distance);
      const shade = .95 + .05 * Math.sin(distance * .29 + column * 7 + side);
      const color = new Color(tones[column]).multiplyScalar(shade);
      colors.push(color.r, color.g, color.b);
      if (row < count && column < offsets.length - 1) {
        const a = row * offsets.length + column, b = a + offsets.length;
        if (side > 0) indices.push(a, a + 1, b, a + 1, b + 1, b);
        else indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    });
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
