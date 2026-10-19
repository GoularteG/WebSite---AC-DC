import test from 'node:test';
import assert from 'node:assert/strict';
import { JOURNEY_LENGTH } from '../src/data/journey.js';
import { arrivalMix, FINAL_GATE_DISTANCE, FINAL_STOP_DISTANCE, infernoMix } from '../src/data/finale.js';

test('the volcanic transition is continuous, bounded and reversible through the last quarter', () => {
  assert.equal(infernoMix(JOURNEY_LENGTH * .7), 0);
  assert.equal(infernoMix(JOURNEY_LENGTH), 1);
  const positions=Array.from({length:1441},(_,i)=>i/2);
  const forward=positions.map(infernoMix);
  const backward=positions.toReversed().map(infernoMix).toReversed();
  assert.deepEqual(forward,backward);
  for(let i=1;i<forward.length;i++) {
    assert.ok(forward[i]>=forward[i-1] && forward[i]<=1);
    assert.ok(forward[i]-forward[i-1]<.005, 'no hard scene cut between scroll samples');
  }
});

test('arrival framing completes before a clear monument beyond the original stopping point', () => {
  assert.equal(FINAL_STOP_DISTANCE,JOURNEY_LENGTH);
  assert.equal(arrivalMix(JOURNEY_LENGTH * .9),0);
  assert.equal(arrivalMix(FINAL_STOP_DISTANCE),1);
  assert.ok(FINAL_GATE_DISTANCE-FINAL_STOP_DISTANCE>20, 'the vehicle stops with space before the monument');
  assert.ok(arrivalMix(FINAL_STOP_DISTANCE-10)>0);
});
