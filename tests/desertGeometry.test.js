import test from 'node:test';
import assert from 'node:assert/strict';
import { basinTerrainGeometry, creosoteGeometry, desertStoneGeometry, erodedFormationGeometry, rootedYuccaGeometry } from '../src/components/environment/desertGeometry.js';
import { createRoadShoulder } from '../src/components/environment/roadShoulder.js';
import { desertHeight, desertPebbles, desertVergeScrub } from '../src/data/desert.js';
import { roadX } from '../src/data/journey.js';

test('all desert geometry constructors execute with finite renderable buffers', () => {
  const builders = [basinTerrainGeometry, creosoteGeometry, desertStoneGeometry, rootedYuccaGeometry,
    ...[0, 1, 2].map(shape => () => erodedFormationGeometry(shape)),
    ...[-1, 1].map(side => () => createRoadShoulder(side))];
  for (const build of builders) {
    const geometry = build();
    try {
      const count = geometry.attributes.position.count;
      assert.ok(count > 0 && count < 40000);
      for (const attribute of Object.values(geometry.attributes)) {
        assert.ok(attribute.array.every(Number.isFinite), 'non-finite geometry attribute');
        assert.equal(attribute.count, count);
      }
      if (geometry.index) assert.ok(geometry.index.array.every(index => index < count));
      geometry.computeBoundingSphere();
      assert.ok(Number.isFinite(geometry.boundingSphere.radius));
    } finally { geometry.dispose(); }
  }
});

test('desert terrain leaves the road and exhibits level and recedes before the finale', () => {
  for (let distance = -100; distance <= 720; distance += 10) {
    for (const offset of [-18, -10, 0, 10, 18]) assert.equal(desertHeight(offset, distance), -.09);
  }
  for (const offset of [-310, -180, 180, 310]) assert.equal(desertHeight(offset, 690), -.09);
  for (const detail of [...desertPebbles, ...desertVergeScrub]) {
    assert.ok(detail.position.every(Number.isFinite));
    assert.ok(detail.offset - detail.width > 8.5);
    assert.ok(detail.height < .55);
  }
  for (const side of [-1, 1]) {
    const geometry = createRoadShoulder(side);
    try {
      const positions = geometry.attributes.position;
      for (let index = 0; index < positions.count; index++) {
        const distance = -positions.getZ(index);
        assert.ok(Math.abs(positions.getX(index) - roadX(distance)) > 5.4);
      }
    } finally { geometry.dispose(); }
  }
});
