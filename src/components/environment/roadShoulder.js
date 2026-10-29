import { BufferGeometry, Color, Float32BufferAttribute } from 'three';
import { roadX } from '../../data/journey.js';

// Gravel gives way to a ragged sand verge rather than a ruler-straight brown strip.
export function createRoadShoulder(side) {
  const positions = [], colors = [], indices = [];
  const offsets = [5.45, 6.25, 7.8, 10.8, 14.6, 18.5];
  const heights = [-.032, -.042, -.054, -.068, -.08, -.088];
  const tones = ['#846c58', '#886e58', '#8a7058', '#886c53', '#85674e', '#82634a'];
  const count = 290;
  for (let row = 0; row <= count; row++) {
    const distance = -100 + row * 4;
    offsets.forEach((offset, column) => {
      const variation = column === 0 ? 0 :
        (Math.sin(distance * .091 + column * 2 + side) * .55 + Math.sin(distance * .227 + side) * .28) * (column / 3.5);
      positions.push(roadX(distance) + side * (offset + variation), heights[column], -distance);
      const shade = .97 + .03 * Math.sin(distance * .21 + column * 5 + side);
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
