import test from 'node:test';
import assert from 'node:assert/strict';
import { EIGHT_ZONE, NINE_ZONE, advanceGhostSequence, initialGhostSequence } from '../src/data/ghostUnlock.js';

test('four complete 08 → 09 → 08 trips unlock the free camera', () => {
  let state = advanceGhostSequence(initialGhostSequence, EIGHT_ZONE);
  for (let trip = 1; trip <= 4; trip++) {
    state = advanceGhostSequence(state, NINE_ZONE);
    assert.equal(state.unlocked, false);
    state = advanceGhostSequence(state, EIGHT_ZONE);
    assert.equal(state.trips, trip);
    assert.equal(state.unlocked, trip === 4);
  }
  assert.equal(advanceGhostSequence(state, NINE_ZONE), state);
});

test('threshold noise and starting at 09 do not award extra trips', () => {
  let state = advanceGhostSequence(initialGhostSequence, NINE_ZONE);
  assert.equal(state.trips, 0);
  state = advanceGhostSequence(state, EIGHT_ZONE);
  for (const progress of [EIGHT_ZONE, EIGHT_ZONE + .03, NINE_ZONE - .03, EIGHT_ZONE]) {
    state = advanceGhostSequence(state, progress);
  }
  assert.equal(state.trips, 0);
  state = advanceGhostSequence(state, NINE_ZONE);
  for (const progress of [NINE_ZONE, NINE_ZONE - .02, NINE_ZONE]) state = advanceGhostSequence(state, progress);
  assert.equal(state.trips, 0);
  state = advanceGhostSequence(state, EIGHT_ZONE);
  assert.equal(state.trips, 1);
});
