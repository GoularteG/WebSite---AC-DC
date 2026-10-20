import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, chapterAt, chapterVisibility, clamp, distanceAtProgress, roadX, storyCameraOffset, JOURNEY_LENGTH } from '../src/data/journey.js';
import { entries } from '../src/data/book.js';
test('chapter boundaries and end are reachable in both directions', () => {
  assert.equal(chapters.length, 9);
  assert.equal(chapters.filter(chapter => chapter.narrative).length, 8);
  assert.equal(chapters.at(-1).id, 'hell-gate');
  for (const chapter of [...chapters, ...chapters.toReversed()]) assert.equal(chapterAt(chapter.progress).id, chapter.id);
  assert.equal(clamp(-1),0); assert.equal(clamp(2),1);
});
test('story panels appear near their markers and road motion stays continuous in both directions', () => {
  assert.equal(distanceAtProgress(0), 0);
  assert.equal(distanceAtProgress(1), JOURNEY_LENGTH);
  let previous = 0;
  for (let step = 0; step <= 1000; step++) {
    const distance = distanceAtProgress(step / 1000);
    assert.ok(distance >= previous && distance - previous < 2);
    previous = distance;
  }
  assert.equal(chapterVisibility(chapters[0].progress, chapters[0]), 1);
  for (let index = 1; index < 8; index++) {
    const boundary = chapters[index].progress;
    assert.equal(chapterVisibility(boundary, chapters[index - 1]), 0);
    assert.equal(chapterVisibility(boundary, chapters[index]), 1);
    assert.ok(Math.abs(chapterVisibility(boundary - .009, chapters[index - 1]) - .5) < 1e-9);
    assert.ok(Math.abs(chapterVisibility(boundary - .003, chapters[index]) - .5) < 1e-9);
    assert.equal(chapterVisibility(boundary - .003, chapters[index - 1]), 0);
  }
  assert.equal(chapterVisibility(.8, chapters[7]), 1);
  assert.equal(chapterVisibility(chapters.at(-1).progress, chapters.at(-1)), 0);
});
test('road is continuous with gentle bends across the full playable route', () => {
  for(let s=0;s<JOURNEY_LENGTH;s+=.5) { assert.ok(Number.isFinite(roadX(s))); assert.ok(Math.abs(roadX(s+.5)-roadX(s))<.12); }
});
test('camera framing alternates with the chapter side and recenters at the gate', () => {
  assert.equal(storyCameraOffset(0), 0);
  for (let index = 0; index < 8; index++) {
    assert.ok(Math.abs(storyCameraOffset(chapters[index].progress) - (index % 2 ? 1.7 : -1.8)) < 1e-9);
  }
  assert.ok(Math.abs(storyCameraOffset(chapters[8].progress)) < 1e-9);
  let previous = storyCameraOffset(0);
  for (let step = 1; step <= 1000; step++) {
    const current = storyCameraOffset(step / 1000);
    assert.ok(Math.abs(current - previous) < .6);
    previous = current;
  }
});
test('each book entry is a separate extensible page', () => {
  assert.equal(new Set(entries.map(entry=>entry.id)).size,entries.length);
  assert.ok(entries.every(entry=>entry.title && entry.label && entry.paragraphs.length));
});
