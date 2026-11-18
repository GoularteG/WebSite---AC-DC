import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import { Object3D } from 'three';
import { roadsideLamps } from '../../data/roadLighting';
import { infernoMix } from '../../data/finale';

const metal = <meshStandardMaterial color="#343537" metalness={.78} roughness={.42} />;
const trim = <meshStandardMaterial color="#746f66" metalness={.72} roughness={.36} />;

function RoadLighting({ distance, ghostActive }) {
  const light = useRef(null);
  const target = useMemo(() => new Object3D(), []);
  const invalidate = useThree(state => state.invalidate);
  useLayoutEffect(() => {
    if (light.current) {
      light.current.target = target;
      target.updateMatrixWorld(true);
      light.current.updateMatrixWorld(true);
    }
    invalidate();
  }, [target, invalidate]);
  useFrame(({ camera }) => {
    if (!light.current) return;
    const s = ghostActive ? -camera.position.z : distance.current;
    let nearest = roadsideLamps[0];
    let minRange = Infinity;
    for (const lamp of roadsideLamps) {
      const range = Math.abs(lamp.distance - s);
      if (range < minRange) {
        minRange = range;
        nearest = lamp;
      }
    }
    light.current.position.set(...nearest.head);
    target.position.set(nearest.head[0] - nearest.side * 2.2, .1, nearest.head[2]);
    light.current.intensity = Math.max(0, Math.min(1, (28 - minRange) / 11)) * 245 * (1 - infernoMix(s) * .6);
  }, -1);
  return <group name="desert-road-lighting">
    <Instances limit={roadsideLamps.length} frames={1}><cylinderGeometry args={[.095, .17, 6.45, 10]} />{metal}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.position[0], 3.225, lamp.position[2]]} />)}
    </Instances>
    <Instances limit={roadsideLamps.length} frames={1}><cylinderGeometry args={[.31, .35, .34, 12]} />{metal}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.position[0], .17, lamp.position[2]]} />)}
    </Instances>
    <Instances limit={roadsideLamps.length} frames={1}><boxGeometry args={[2.86, .11, .11]} />{metal}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.position[0] - lamp.side * 1.36, 6.62, lamp.position[2]]} rotation={[0, 0, lamp.side * .07]} />)}
    </Instances>
    <Instances limit={roadsideLamps.length} frames={1}><boxGeometry args={[.82, .22, .38]} />{trim}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={lamp.head} />)}
    </Instances>
    <Instances limit={roadsideLamps.length} frames={1}><boxGeometry args={[.68, .025, .3]} /><meshStandardMaterial color="#fff0bc" emissive="#ffb258" emissiveIntensity={2.2} toneMapped={false} />
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.head[0], lamp.head[1] - .13, lamp.head[2]]} />)}
    </Instances>
    <Instances limit={roadsideLamps.length} frames={1}><cylinderGeometry args={[.15, .15, .07, 12]} />{trim}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.position[0], 5.84, lamp.position[2]]} />)}
    </Instances>
    <primitive object={target} />
    <spotLight ref={light} target={target} color="#ffd69c" intensity={0} distance={21} angle={.70} penumbra={.72} decay={2} />
  </group>;
}

export default memo(RoadLighting);
