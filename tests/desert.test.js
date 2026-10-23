import test from 'node:test';
import assert from 'node:assert/strict';
import { desertMesas, desertRocks, desertScrub, desertYucca } from '../src/data/desert.js';
import { roadX } from '../src/data/journey.js';
import { roadsideLamps } from '../src/data/roadLighting.js';

test('desert formations stay clear of the road and roadside billboards', () => {
  for (const formation of [...desertMesas, ...desertRocks]) {
    const gap = Math.abs(formation.position[0] - roadX(formation.distance)) - formation.width;
    assert.ok(gap > 20, `formation at ${formation.distance} has only ${gap.toFixed(1)} units of clearance`);
  }
});

test('desert has varied formations on both sides before the inferno', () => {
  assert.ok(desertMesas.length >= 18);
  assert.ok(desertRocks.length >= 60);
  assert.ok(desertMesas.some(formation => formation.side < 0));
  assert.ok(desertMesas.some(formation => formation.side > 0));
  assert.ok(desertMesas.every(formation => formation.distance < 625));
  assert.deepEqual(new Set(desertMesas.map(formation => formation.shape)), new Set([0, 1, 2]));
});

test('new desert details and lights clear the driving corridor', () => {
  for (const plant of [...desertScrub, ...desertYucca]) {
    const gap = Math.abs(plant.position[0] - roadX(plant.distance)) - plant.width;
    assert.ok(gap > 18, `plant at ${plant.distance} is too close to the road`);
  }
  assert.ok(roadsideLamps.length < 10);
  for (const lamp of roadsideLamps) {
    assert.ok(Math.abs(lamp.position[0] - roadX(lamp.distance)) > 8);
    assert.ok(Math.abs(lamp.head[0] - roadX(lamp.distance)) > 6);
  }
});
