import { PageFlip } from 'page-flip/src/PageFlip';
import { Render } from 'page-flip/src/Render/Render';

// page-flip 2.0.7 does not cancel its animation loop in destroy().
// Own the loop so responsive rebuilds and tab changes release it completely.
// Import the source modules so PageFlip and this adapter share the same Render.
const frames = new WeakMap();
Render.prototype.start = function start() {
  this.update();
  let previous = '', wasAnimating = false;
  const tick = time => {
    const bounds = this.getRect();
    const signature = `${this.app.getCurrentPageIndex()}:${bounds.width}:${bounds.height}:${bounds.left}:${bounds.top}:${this.app.getState()}`;
    const active = this.animation !== null || this.app.getState() !== 'read';
    // Repaint folds continuously, but leave textured paper idle between interactions.
    if (active || wasAnimating || signature !== previous) this.render(time);
    else this.timer = time;
    previous = signature;
    wasAnimating = active;
    frames.set(this, requestAnimationFrame(tick));
  };
  frames.set(this, requestAnimationFrame(tick));
};
export class ManagedPageFlip extends PageFlip {
  destroy() {
    cancelAnimationFrame(frames.get(this.getRender()));
    frames.delete(this.getRender());
    // The upstream destructor skips resize cleanup when mouse events are off.
    this.getUI().removeHandlers();
    super.destroy();
  }
}
