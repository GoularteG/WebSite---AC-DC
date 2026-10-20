import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, chapterAt, clamp, distanceAtProgress, roadX, JOURNEY_LENGTH } from '../src/data/journey.js';
import { entries } from '../src/data/book.js';
test('chapter boundaries and end are reachable in both directions', () => {
  assert.equal(chapters.length, 9);
  assert.equal(chapters.filter(chapter => chapter.narrative).length, 8);
  assert.equal(chapters.at(-1).id, 'hell-gate');
  for (const chapter of [...chapters, ...chapters.toReversed()]) assert.equal(chapterAt(chapter.progress).id, chapter.id);
  assert.equal(clamp(-1),0); assert.equal(clamp(2),1);
});
test('billboard chapters remain spaced before the final gate and road motion is reversible', () => {
  assert.equal(distanceAtProgress(0), 0);
  assert.equal(distanceAtProgress(1), JOURNEY_LENGTH);
  let previous = 0;
  for (let step = 0; step <= 1000; step++) {
    const distance = distanceAtProgress(step / 1000);
    assert.ok(distance >= previous && distance - previous < 2);
    previous = distance;
  }
  const markers = chapters.slice(0, 8).map(chapter => distanceAtProgress(chapter.progress));
  assert.ok(markers.every((distance, index) => index === 0 || distance - markers[index - 1] > 40));
  assert.ok(markers.at(-1) + 26 < distanceAtProgress(chapters.at(-1).progress));
});
test('road is continuous with gentle bends across the full playable route', () => {
  for(let s=0;s<JOURNEY_LENGTH;s+=.5) { assert.ok(Number.isFinite(roadX(s))); assert.ok(Math.abs(roadX(s+.5)-roadX(s))<.12); }
});
test('each book entry is a separate extensible page', () => {
  assert.equal(new Set(entries.map(entry=>entry.id)).size,entries.length);
  assert.ok(entries.every(entry=>entry.title && entry.label && entry.paragraphs.length));
});
