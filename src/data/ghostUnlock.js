import { chapters } from './journey.js';

// Both ends must be reached; flickering around chapter 09 cannot count as a trip.
export const EIGHT_ZONE = chapters[7].progress + .025;
export const NINE_ZONE = chapters[8].progress + .01;
export const initialGhostSequence = { stage: 'find-eight', trips: 0, unlocked: false };

export function advanceGhostSequence(state, progress) {
  if (state.unlocked) return state;
  if (progress <= EIGHT_ZONE) {
    if (state.stage === 'return-eight') {
      const trips = state.trips + 1;
      return { stage: 'approach-nine', trips, unlocked: trips === 4 };
    }
    if (state.stage === 'find-eight') return { ...state, stage: 'approach-nine' };
  }
  if (progress >= NINE_ZONE && state.stage === 'approach-nine') {
    return { ...state, stage: 'return-eight' };
  }
  return state;
}
