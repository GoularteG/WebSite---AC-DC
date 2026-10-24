import test from 'node:test';
import assert from 'node:assert/strict';
import { basinSurfaceHeight, desertMesas, desertRocks, desertScrub, desertYucca } from '../src/data/desert.js';
import { billboardDistance, chapters, roadX } from '../src/data/journey.js';
import { roadsideLamps } from '../src/data/roadLighting.js';
import { roadsideAssets } from '../src/data/roadsideAssets.js';

test('desert formations reach the verge without entering the driving corridor', () => {
  for (const formation of desertMesas) {
    const gap = Math.abs(formation.position[0] - roadX(formation.distance)) - formation.width;
    assert.ok(gap > 20, `formation at ${formation.distance} has only ${gap.toFixed(1)} units of clearance`);
  }
  for (const stone of desertRocks) {
    const gap = Math.abs(stone.position[0] - roadX(stone.distance)) - stone.width;
    assert.ok(gap > 8.5, `stone at ${stone.distance} has only ${gap.toFixed(1)} units of clearance`);
  }
  assert.ok(desertRocks.some(stone => stone.offset < 20), 'some rocks should be visible near the road');
  assert.ok(basinSurfaceHeight(18, 125) < -.09, 'terrain edge should be hidden beneath the road plane');
  assert.ok(basinSurfaceHeight(41, 125) > -.09, 'the terrain should emerge beyond the verge');
});

test('desert has varied formations on both sides before the inferno', () => {
  assert.ok(desertMesas.length >= 18);
  assert.ok(desertRocks.length >= 60);
  assert.ok(desertMesas.some(formation => formation.side < 0));
  assert.ok(desertMesas.some(formation => formation.side > 0));
  assert.ok(desertMesas.every(formation => formation.distance < 625));
  assert.ok(desertMesas.some(formation => formation.offset - formation.width < 28),
    'large rock formations should be visible from the roadside');
  assert.ok(desertRocks.filter(stone => stone.offset < 20).length >= 80,
    'near-road stones should continue throughout the journey');
  assert.ok(desertScrub.filter(plant => plant.offset < 20).length > 70,
    'foreground vegetation should not be isolated to a few stops');
  assert.deepEqual(new Set(desertMesas.map(formation => formation.shape)), new Set([0, 1, 2]));
});

test('new desert details and lights clear the driving corridor', () => {
  for (const plant of [...desertScrub, ...desertYucca]) {
    const gap = Math.abs(plant.position[0] - roadX(plant.distance)) - plant.width;
    assert.ok(gap > 9, `plant at ${plant.distance} is too close to the road`);
  }
  assert.ok(roadsideLamps.length < 10);
  for (const lamp of roadsideLamps) {
    assert.ok(Math.abs(lamp.position[0] - roadX(lamp.distance)) > 8);
    assert.ok(Math.abs(lamp.head[0] - roadX(lamp.distance)) > 6);
  }
});

test('billboard approach stays clear of posts, exhibits and foreground plants', () => {
  for (const [index, chapter] of chapters.slice(0, 8).entries()) {
    for (const mobile of [false, true]) {
      const distance = billboardDistance(chapter, mobile);
      const side = mobile ? (index === 0 ? -1 : 1) : (index % 2 ? 1 : -1);
      for (const obstacle of [
        ...roadsideLamps.map(lamp => ({ distance: lamp.distance, side: lamp.side })),
        ...roadsideAssets.map(asset => ({ distance: asset.distance, side: asset.side })),
      ]) {
        assert.ok(obstacle.side !== side || distance - obstacle.distance < 0 || distance - obstacle.distance > 30,
          `chapter ${index + 1} ${mobile ? 'mobile' : 'desktop'} has a post or exhibit in front`);
      }
      for (const detail of [...desertRocks, ...desertScrub, ...desertYucca]) {
        if (detail.side !== side || distance - detail.distance < -4 || distance - detail.distance > 28) continue;
        assert.ok(detail.offset - detail.width > 29,
          `chapter ${index + 1} ${mobile ? 'mobile' : 'desktop'} has foreground detail in front`);
      }
    }
  }
});

test('roadside landmarks use a small varied set with room for the driving lane', () => {
  assert.deepEqual(roadsideAssets.map(asset => asset.side), [1, -1, 1, -1, 1]);
  assert.ok(new Set(roadsideAssets.map(asset => asset.group)).size >= 4);
  assert.ok(roadsideAssets.every(asset => asset.offset > 15 && asset.distance < 610));
  assert.ok(roadsideAssets.filter(asset => asset.kind === 'model').every(asset =>
    asset.modelPath === '/models/guitar-electric.glb'));
});
