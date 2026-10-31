import test from 'node:test';
import assert from 'node:assert/strict';
import { bindBookDrag } from '../src/components/book/bookDrag.js';

function setup({ page = 0, portrait = false, reduced = false } = {}) {
  const handlers = new Map(), captured = new Set(), actions = [];
  const width = portrait ? 360 : 900;
  const surface = {
    clientWidth: width, clientHeight: 650,
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height: 650 }),
    addEventListener: (name, fn) => handlers.set(name, fn),
    removeEventListener: name => handlers.delete(name),
    setPointerCapture: id => captured.add(id), hasPointerCapture: id => captured.has(id),
    releasePointerCapture: id => captured.delete(id),
  };
  const controller = {
    start: () => true,
    getCalculation: () => ({ getPosition: () => ({ x: 90, y: 300 }), getCorner: () => 'bottom' }),
    animateFlippingTo: (_from, _to, commit) => actions.push(commit ? 'commit' : 'rollback'),
  };
  const flip = {
    getUI: () => ({ getDistElement: () => surface }), getState: () => 'read',
    getOrientation: () => portrait ? 'portrait' : 'landscape', getCurrentPageIndex: () => page, getPageCount: () => 8,
    getBoundsRect: () => ({ left: portrait ? -width : 0, width: portrait ? width*2 : width, pageWidth: portrait ? width : width/2, height: 650 }),
    getFlipController: () => controller,
    startUserTouch: () => actions.push('start'), userMove: () => actions.push('fold'), userStop: () => actions.push('stop'),
    flipNext: () => actions.push('next'), flipPrev: () => actions.push('previous'),
    turnToNextPage: () => actions.push('next-instant'), turnToPrevPage: () => actions.push('previous-instant'),
  };
  const cleanup = bindBookDrag(flip, { reduced });
  const send = (name, x, y = 300) => handlers.get(name)?.({ clientX: x, clientY: y, pointerId: 1, isPrimary: true, button: 0, cancelable: true, preventDefault() {} });
  return { actions, send, cleanup, handlers, captured, width };
}

test('edge taps advance and middle text taps leave the page in place', () => {
  const s = setup();
  s.send('pointerdown', 450); s.send('pointerup', 450); assert.deepEqual(s.actions, []);
  s.send('pointerdown', 890); s.send('pointerup', 890); assert.deepEqual(s.actions, ['next']);
  s.cleanup(); assert.equal(s.handlers.size, 0); assert.equal(s.captured.size, 0);
});

test('first and last spread cannot turn past the book boundaries', () => {
  const first = setup(); first.send('pointerdown', 10); first.send('pointerup', 10); assert.deepEqual(first.actions, []);
  const last = setup({page:6}); last.send('pointerdown', 890); last.send('pointerup', 890); assert.deepEqual(last.actions, []);
});

test('a short portrait swipe commits without crossing the hidden spine', () => {
  const s = setup({portrait:true});
  s.send('pointerdown', 300); s.send('pointermove', 225); s.send('pointerup', 225);
  assert.equal(s.actions.at(-1), 'commit'); assert.equal(s.captured.size, 0);
});

test('pointer cancellation rolls back the fold and releases capture', () => {
  const s = setup({portrait:true,page:2});
  s.send('pointerdown', 300); s.send('pointermove', 200); s.send('pointercancel', 200);
  assert.equal(s.actions.at(-1), 'rollback'); assert.equal(s.captured.size, 0);
});

test('vertical motion preserves reading while reduced motion still supports swipes', () => {
  const s = setup({portrait:true,reduced:true,page:1});
  s.send('pointerdown', 200); s.send('pointermove', 203, 220); s.send('pointerup', 203, 220); assert.deepEqual(s.actions, []);
  s.send('pointerdown', 150); s.send('pointermove', 230); s.send('pointerup', 230); assert.deepEqual(s.actions, ['previous-instant']);
});
