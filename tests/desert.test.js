import test from 'node:test';
import assert from 'node:assert/strict';
import { desertMesas, desertRocks } from '../src/data/desert.js';
import { roadX } from '../src/data/journey.js';

test('desert formations stay clear of the road and roadside billboards', () => {
  for (const formation of [...desertMesas, ...desertRocks]) {
    const gap = Math.abs(formation.position[0] - roadX(formation.distance)) - formation.width;
    assert.ok(gap > 20, `formation at ${formation.distance} has only ${gap.toFixed(1)} units of clearance`);
  }
});

test('desert has varied formations on both sides before the inferno', () => {
  assert.ok(desertMesas.length >= 30);
  assert.ok(desertRocks.length >= 60);
  assert.ok(desertMesas.some(formation => formation.side < 0));
  assert.ok(desertMesas.some(formation => formation.side > 0));
  assert.ok(desertMesas.every(formation => formation.distance < 625));
});
