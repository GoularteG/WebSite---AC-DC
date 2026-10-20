import history from './history.json' with { type: 'json' };

export const JOURNEY_LENGTH = 720;
export const chapters = [
  ...history.chapters.map((chapter, index) => ({
    ...chapter,
    marker: String(index + 1).padStart(2, '0'),
    progress: .04 + index * .09,
  })),
  { id: 'hell-gate', title: 'THE GATES OF HELL', period: 'Destino final', marker: '09', progress: .88 },
];
export const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const roadX = (distance) => 13 * Math.sin(distance / 110) + 5 * Math.sin(distance / 53);
export const roadHeading = (distance) => Math.atan2(13 / 110 * Math.cos(distance / 110) + 5 / 53 * Math.cos(distance / 53), -1);
// Native scrolling rounds to device pixels; allow a sub-pixel tolerance at each marker.
export const chapterAt = progress => chapters.reduce((current, chapter) => progress >= chapter.progress - .0005 ? chapter : current, chapters[0]);

// The road stays reversible; the car simply eases as it reaches each story marker.
export function distanceAtProgress(progress) {
  const stops = [0, ...chapters.map(chapter => chapter.progress), 1];
  const p = clamp(progress);
  const nextIndex = Math.max(1, stops.findIndex(stop => stop >= p));
  const start = stops[nextIndex - 1];
  const end = stops[nextIndex];
  const t = clamp((p - start) / (end - start));
  const eased = t * t * (3 - 2 * t);
  return (start + (end - start) * eased) * JOURNEY_LENGTH;
}
