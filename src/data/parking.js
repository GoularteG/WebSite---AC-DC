import { roadX } from './journey.js';

export const PARKING_DURATION = 6;
export const PARKING_ADVANCE = 28;
export const PARKING_OFFSET = 7;
const clamp01 = n => Math.max(0, Math.min(1, n));
const smoother = u => u*u*u*(u*(u*6-15)+10);

// Travel continues forward while the lateral curve steers toward the shoulder.
// Its tangent determines yaw: the vehicle cannot slide sideways independently.
export function parkingPose(start, timeline) {
  const motion = clamp01(timeline / .7);
  const u = 1 - (1-motion)**3;
  const s = start + PARKING_ADVANCE*u;
  const slope = (roadX(s+.01)-roadX(s-.01))/.02;
  const lateralSlope = PARKING_OFFSET/PARKING_ADVANCE*30*u*u*(1-u)*(1-u);
  return {
    x:roadX(s)+2.5+PARKING_OFFSET*smoother(u),
    z:-s,
    yaw:-Math.atan(slope+lateralSlope),
    travel:s-start,
    camera:smoother(clamp01((timeline-.7)/.3)),
    follow:smoother(clamp01(timeline/.16)),
  };
}
