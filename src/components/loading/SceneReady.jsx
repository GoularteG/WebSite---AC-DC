import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

// Signal after committed assets have had a frame to render, including GPU upload.
export default function SceneReady({ onReady }) {
  const invalidate = useThree(state => state.invalidate);
  const frames = useRef(0), pending = useRef(0), complete = useRef(false);
  useEffect(() => { invalidate(); return () => cancelAnimationFrame(pending.current); }, [invalidate]);
  useFrame(() => {
    if (complete.current) return;
    if (++frames.current < 2) { invalidate(); return; }
    complete.current = true;
    pending.current = requestAnimationFrame(() => onReady?.());
  });
  return null;
}
