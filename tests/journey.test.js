import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, chapterAt, clamp, roadX, JOURNEY_LENGTH } from '../src/data/journey.js';
import { entries } from '../src/data/book.js';
test('chapter boundaries and end are reachable in both directions', () => {
  for (const chapter of [...chapters, ...chapters.toReversed()]) assert.equal(chapterAt(chapter.progress).id, chapter.id);
  assert.equal(clamp(-1),0); assert.equal(clamp(2),1);
});
test('road is continuous with gentle bends across the full playable route', () => {
  for(let s=0;s<JOURNEY_LENGTH;s+=.5) { assert.ok(Number.isFinite(roadX(s))); assert.ok(Math.abs(roadX(s+.5)-roadX(s))<.12); }
});
test('each book entry is a separate extensible page', () => {
  assert.equal(new Set(entries.map(entry=>entry.id)).size,entries.length);
  assert.ok(entries.every(entry=>entry.title && entry.label && entry.paragraphs.length));
});
