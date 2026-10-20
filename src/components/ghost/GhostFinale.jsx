import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { roadX } from '../../data/journey';

const nearEnough = (camera, position) => camera.position.distanceToSquared(position) < 145 * 145;

function RocketBall({ scene }) {
  const position = useMemo(() => new Vector3(roadX(884), 0, -884), []);
  const spin = useRef();
  const invalidate = useThree(state => state.invalidate);
  const fit = useMemo(() => {
    scene.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(scene);
    const center = bounds.getCenter(new Vector3());
    const scale = 2.2 / Math.max(bounds.getSize(new Vector3()).y, .001);
    return { scale, offset: [-center.x * scale, -bounds.min.y * scale, -center.z * scale] };
  }, [scene]);
  useFrame(({ camera }, delta) => {
    if (!spin.current || !nearEnough(camera, position)) return;
    spin.current.rotation.y += Math.min(delta, .05) * .7;
    invalidate();
  });
  return <group ref={spin} position={position.toArray()}>
    <group position={fit.offset} scale={fit.scale}><primitive object={scene} /></group>
  </group>;
}

export default function GhostFinale() {
  const ball = useGLTF('/models/ghost-ball.glb');
  return <group name="ghost-only-finale"><RocketBall scene={ball.scene} /></group>;
}
