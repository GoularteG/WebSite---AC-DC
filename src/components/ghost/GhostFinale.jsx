import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { AnimationMixer, Box3, Vector3 } from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { roadX } from '../../data/journey';

const nearEnough = (camera, position) => camera.position.distanceToSquared(position) < 145 * 145;

function DisplayModel({ object, position, height }) {
  const fit = useMemo(() => {
    object.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(object);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = height / Math.max(size.y, .001);
    return { scale, offset: [-center.x * scale, -bounds.min.y * scale, -center.z * scale] };
  }, [object, height]);
  return <group position={position}>
    <group position={fit.offset} scale={fit.scale}>
      <primitive object={object} />
    </group>
    {children}
  </group>;
}

function DancingBanana({ scene, animations }) {
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const invalidate = useThree(state => state.invalidate);
  const position = useMemo(() => new Vector3(roadX(862) - 10, 0, -862), []);
  useEffect(() => {
    const dance = animations.find(clip => clip.name === 'Emote Boogie Down') ?? animations[0];
    const action = dance && mixer.clipAction(dance);
    action?.play();
    return () => { action?.stop(); mixer.stopAllAction(); };
  }, [animations, mixer]);
  useFrame(({ camera }, delta) => {
    if (!nearEnough(camera, position)) return;
    mixer.update(Math.min(delta, .05));
    invalidate();
  });
  return <DisplayModel object={scene} position={position.toArray()} height={4.1} />;
}

function RocketBall({ scene }) {
  const position = useMemo(() => new Vector3(roadX(884), 0, -884), []);
  const spin = useRef();
  const invalidate = useThree(state => state.invalidate);
  useFrame(({ camera }, delta) => {
    if (!nearEnough(camera, position)) return;
    spin.current.rotation.y += Math.min(delta, .05) * .7;
    invalidate();
  });
  return <group ref={spin} position={position.toArray()}><DisplayModel object={scene} position={[0, 0, 0]} height={2.2} /></group>;
}

function ReaperAndWildCard({ scene }) {
  const figures = useMemo(() => {
    const roots = [];
    scene.traverse(node => {
      if (node.userData.name === 'M_MED_Soldier_Assassin_071.ao' || node.userData.name === 'M_MED_Soldier_Assassin_01.ao.001') roots.push(cloneSkeleton(node));
    });
    return roots;
  }, [scene]);
  return <group>
    {figures.map((figure, index) => {
      const s = 907 + index * 5;
      return <DisplayModel key={index} object={figure} position={[roadX(s) + 11 + index * 4, 0, -s]} height={4.15} />;
    })}
  </group>;
}

export default function GhostFinale() {
  const [banana, ball, duo] = useGLTF(['/models/ghost-banana.glb', '/models/ghost-ball.glb', '/models/ghost-duo.glb']);
  return <group name="ghost-only-finale">
    <DancingBanana scene={banana.scene} animations={banana.animations} />
    <RocketBall scene={ball.scene} />
    <ReaperAndWildCard scene={duo.scene} />
  </group>;
}
