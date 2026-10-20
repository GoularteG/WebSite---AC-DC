import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Euler, MathUtils, Vector3 } from 'three';
import { roadX } from '../../data/journey';

const OVERVIEW = new Vector3(roadX(360), 820, -360);
const OVERVIEW_LOOK = new Vector3(roadX(360), 0, -385);
const UP = new Vector3(0, 1, 0);
const MOVEMENT_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight']);
const FLIGHT_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export default function GhostCamera({ controls, onExit, reduced }) {
  const { camera, gl, invalidate } = useThree();
  const transition = useRef(false);
  const target = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const lookTarget = useMemo(() => new Vector3(), []);
  const direction = useMemo(() => new Vector3(), []);
  const forward = useMemo(() => new Vector3(), []);
  const right = useMemo(() => new Vector3(), []);
  const yaw = useRef(0), pitch = useRef(0);
  const dragging = useRef(null);

  useEffect(() => {
    const canvas = gl.domElement;
    const oldFar = camera.far;
    const oldTouchAction = canvas.style.touchAction;
    camera.far = 1800;
    camera.updateProjectionMatrix();
    canvas.style.touchAction = 'none';

    const showOverview = () => {
      target.copy(OVERVIEW);
      if (reduced) {
        camera.position.copy(OVERVIEW);
        camera.lookAt(OVERVIEW_LOOK);
        const rotation = new Euler().setFromQuaternion(camera.quaternion, 'YXZ');
        yaw.current = rotation.y;
        pitch.current = MathUtils.clamp(rotation.x, -1.54, 1.54);
        transition.current = false;
        invalidate();
        return;
      }
      camera.getWorldDirection(direction);
      look.copy(camera.position).addScaledVector(direction, 30);
      lookTarget.copy(OVERVIEW_LOOK);
      transition.current = true;
      invalidate();
    };
    controls.current.invalidate = invalidate;
    controls.current.overview = showOverview;
    showOverview();

    const onKeyDown = event => {
      if (event.code === 'Escape') { event.preventDefault(); onExit(); return; }
      if (!MOVEMENT_KEYS.has(event.code)) return;
      event.preventDefault();
      controls.current.pressed.add(event.code);
      invalidate();
    };
    const onKeyUp = event => {
      if (!MOVEMENT_KEYS.has(event.code)) return;
      controls.current.pressed.delete(event.code);
      event.preventDefault();
    };
    const onPointerDown = event => {
      if (event.button !== 0) return;
      dragging.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = event => {
      if (!dragging.current || dragging.current.id !== event.pointerId || transition.current) return;
      const dx = event.clientX - dragging.current.x;
      const dy = event.clientY - dragging.current.y;
      dragging.current.x = event.clientX;
      dragging.current.y = event.clientY;
      yaw.current -= dx * .0032;
      pitch.current = MathUtils.clamp(pitch.current - dy * .0032, -1.54, 1.54);
      camera.quaternion.setFromEuler(new Euler(pitch.current, yaw.current, 0, 'YXZ'));
      invalidate();
    };
    const onPointerUp = event => {
      if (dragging.current?.id === event.pointerId) dragging.current = null;
    };
    const onWheel = event => {
      event.preventDefault();
      if (transition.current) return;
      camera.getWorldDirection(direction);
      camera.position.addScaledVector(direction, Math.sign(event.deltaY) * Math.min(38, Math.abs(event.deltaY) * .13));
      camera.position.x = MathUtils.clamp(camera.position.x, -260, 260);
      camera.position.y = MathUtils.clamp(camera.position.y, 2, 1000);
      camera.position.z = MathUtils.clamp(camera.position.z, -1050, 120);
      invalidate();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.style.touchAction = oldTouchAction;
      camera.far = oldFar;
      camera.updateProjectionMatrix();
      controls.current.pressed.clear();
      controls.current.invalidate = null;
      controls.current.overview = null;
      transition.current = false;
      invalidate();
    };
  }, [camera, controls, direction, gl, invalidate, look, lookTarget, onExit, reduced, target]);

  useFrame((_, dt) => {
    if (transition.current) {
      const step = 1 - Math.exp(-Math.min(dt, .05) * 2.4);
      camera.position.lerp(target, step);
      look.lerp(lookTarget, step);
      camera.lookAt(look);
      if (camera.position.distanceTo(target) < .5 && look.distanceTo(lookTarget) < .5) {
        camera.position.copy(target);
        camera.lookAt(lookTarget);
        transition.current = false;
        const rotation = new Euler().setFromQuaternion(camera.quaternion, 'YXZ');
        yaw.current = rotation.y;
        pitch.current = MathUtils.clamp(rotation.x, -1.54, 1.54);
      } else invalidate();
      return;
    }
    const keys = controls.current.pressed;
    if (!FLIGHT_KEYS.some(key => keys.has(key))) return;
    forward.set(0, 0, -1).applyAxisAngle(UP, yaw.current);
    right.set(forward.z * -1, 0, forward.x);
    const speed = (27 + camera.position.y * .11) * (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 3.5 : 1) * Math.min(dt, .05);
    if (keys.has('KeyW') || keys.has('ArrowUp')) camera.position.addScaledVector(forward, speed);
    if (keys.has('KeyS') || keys.has('ArrowDown')) camera.position.addScaledVector(forward, -speed);
    if (keys.has('KeyD') || keys.has('ArrowRight')) camera.position.addScaledVector(right, speed);
    if (keys.has('KeyA') || keys.has('ArrowLeft')) camera.position.addScaledVector(right, -speed);
    if (keys.has('KeyE')) camera.position.y += speed;
    if (keys.has('KeyQ')) camera.position.y -= speed;
    camera.position.x = MathUtils.clamp(camera.position.x, -260, 260);
    camera.position.y = MathUtils.clamp(camera.position.y, 2, 1000);
    camera.position.z = MathUtils.clamp(camera.position.z, -1050, 120);
    invalidate();
  });
  return null;
}
