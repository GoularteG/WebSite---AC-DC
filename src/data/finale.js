import { JOURNEY_LENGTH, clamp } from './journey.js';

export const FINAL_STOP_DISTANCE = JOURNEY_LENGTH;
export const FINAL_GATE_DISTANCE = JOURNEY_LENGTH + 35;
const ramp = (value, start, end) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
// Both directions sample the same world state; there is no one-way timeline.
export const infernoMix = distance => ramp(distance, JOURNEY_LENGTH * .74, JOURNEY_LENGTH * .98);
export const arrivalMix = distance => ramp(distance, JOURNEY_LENGTH * .91, FINAL_STOP_DISTANCE);
