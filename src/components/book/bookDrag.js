// Lock direction at the pressed edge, before a fast drag can cross the spine.
// Pointer Events unify mouse/touch and leave vertical mobile scrolling available.
export function bindBookDrag(flip) {
  const surface = flip.getUI().getDistElement();
  let gesture = null;
  const point = event => {
    const rect = surface.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * surface.clientWidth / rect.width,
      y: (event.clientY - rect.top) * surface.clientHeight / rect.height };
  };
  const down = event => {
    if (!event.isPrimary || event.button !== 0 || flip.getState() !== 'read') return;
    gesture = { id: event.pointerId, origin: point(event), active: false };
  };
  const move = event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const pos = point(event), dx = pos.x - gesture.origin.x, dy = pos.y - gesture.origin.y;
    if (!gesture.active) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) { gesture = null; return; }
      if (Math.abs(dx) < 8) return;
      if (!flip.getFlipController().start(gesture.origin)) { gesture = null; return; }
      flip.startUserTouch(gesture.origin);
      gesture.active = true;
      surface.setPointerCapture(event.pointerId);
    }
    // A portrait sheet has its other half outside the viewport. Map a
    // full-width pull onto the full fold so it can cross the hidden spine.
    const fold = flip.getOrientation() === 'portrait'
      ? { x: gesture.origin.x + dx * 2, y: pos.y } : pos;
    flip.userMove(fold, true);
    if (event.cancelable) event.preventDefault();
  };
  const end = event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    if (gesture.active) flip.userStop(point(event));
    if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
    gesture = null;
  };
  surface.addEventListener('pointerdown', down);
  surface.addEventListener('pointermove', move);
  surface.addEventListener('pointerup', end);
  surface.addEventListener('pointercancel', end);
  return () => {
    surface.removeEventListener('pointerdown', down);
    surface.removeEventListener('pointermove', move);
    surface.removeEventListener('pointerup', end);
    surface.removeEventListener('pointercancel', end);
  };
}
