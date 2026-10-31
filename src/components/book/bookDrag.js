// page-flip 2.0.7 is pinned: the same fold controller drives buttons and gestures.
// Horizontal intent is locked before the finger crosses the book's spine.
export function bindBookDrag(flip, { reduced = false } = {}) {
  const surface = flip.getUI().getDistElement();
  let gesture = null;
  const point = event => {
    const rect = surface.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * surface.clientWidth / rect.width,
      y: (event.clientY - rect.top) * surface.clientHeight / rect.height };
  };
  const canTurn = forward => forward
    ? flip.getCurrentPageIndex() < flip.getPageCount() - (flip.getOrientation() === 'portrait' ? 1 : 2)
    : flip.getCurrentPageIndex() > 0;
  const turn = forward => {
    if (!canTurn(forward)) return;
    if (reduced) forward ? flip.turnToNextPage() : flip.turnToPrevPage();
    else forward ? flip.flipNext('bottom') : flip.flipPrev('bottom');
  };
  const release = id => { if (surface.hasPointerCapture(id)) surface.releasePointerCapture(id); };
  const down = event => {
    if (!event.isPrimary || event.button !== 0 || flip.getState() !== 'read') return;
    gesture = { id: event.pointerId, origin: point(event), last: point(event), active: false };
    surface.setPointerCapture(event.pointerId);
  };
  const move = event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const pos = point(event), dx = pos.x - gesture.origin.x, dy = pos.y - gesture.origin.y;
    if (!gesture.active) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { gesture = null; release(event.pointerId); return; }
      if (Math.abs(dx) < 8) return;
      gesture.forward = dx < 0;
      if (!canTurn(gesture.forward)) { gesture = null; release(event.pointerId); return; }
      const rect = flip.getBoundsRect();
      gesture.anchor = { x: gesture.forward ? rect.left + rect.width - 2 : 2,
        y: Math.max(2, Math.min(rect.height - 2, gesture.origin.y)) };
      if (!reduced) {
        if (!flip.getFlipController().start(gesture.anchor)) { gesture = null; release(event.pointerId); return; }
        flip.startUserTouch(gesture.anchor);
      }
      gesture.active = true;
    }
    gesture.last = pos;
    if (!reduced) {
      const gain = flip.getOrientation() === 'portrait' ? 2 : 1;
      flip.userMove({ x: gesture.anchor.x + dx * gain, y: pos.y }, true);
    }
    if (event.cancelable) event.preventDefault();
  };
  const end = (event, cancelled = false) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const saved = gesture;
    gesture = null;
    release(event.pointerId);
    const dx = saved.last.x - saved.origin.x;
    if (saved.active) {
      const commit = !cancelled && Math.abs(dx) >= Math.max(36, surface.clientWidth * .12);
      if (reduced) { if (commit) turn(saved.forward); return; }
      // End touch ownership, then settle the real curved fold in either direction.
      flip.userStop(saved.last, true);
      const controller = flip.getFlipController(), calculation = controller.getCalculation();
      if (!calculation) return;
      const rect = flip.getBoundsRect();
      controller.animateFlippingTo(calculation.getPosition(), {
        x: commit ? -rect.pageWidth : rect.pageWidth,
        y: calculation.getCorner() === 'bottom' ? rect.height : 0,
      }, commit);
    } else if (!cancelled) {
      const ratio = saved.origin.x / surface.clientWidth;
      if (ratio < .23) turn(false);
      else if (ratio > .77) turn(true);
    }
  };
  const up = event => end(event);
  const cancel = event => end(event, true);
  surface.addEventListener('pointerdown', down);
  surface.addEventListener('pointermove', move);
  surface.addEventListener('pointerup', up);
  surface.addEventListener('pointercancel', cancel);
  surface.addEventListener('lostpointercapture', cancel);
  return () => {
    if (gesture) { const id = gesture.id; gesture = null; release(id); }
    surface.removeEventListener('pointerdown', down);
    surface.removeEventListener('pointermove', move);
    surface.removeEventListener('pointerup', up);
    surface.removeEventListener('pointercancel', cancel);
    surface.removeEventListener('lostpointercapture', cancel);
  };
}
