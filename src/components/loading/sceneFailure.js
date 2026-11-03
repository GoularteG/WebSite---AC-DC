export function hasVisibleSceneFailure(scene) {
  // React Three Fiber always keeps its compatibility message inside <canvas>.
  // That markup is not a rendered failure when WebGL is working.
  return [...(scene?.querySelectorAll('.scene-fallback,.trunk-webgl-fallback') ?? [])]
    .some(node => !node.closest('canvas') && node.getClientRects().length > 0);
}
