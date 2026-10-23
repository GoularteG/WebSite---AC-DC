import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import { Object3D } from 'three';
import { roadsideLamps } from '../../data/roadLighting';
import { infernoMix } from '../../data/finale';

const metal = <meshStandardMaterial color="#343537" metalness={.78} roughness={.42} />;
const trim = <meshStandardMaterial color="#746f66" metalness={.72} roughness={.36} />;

export default function RoadLighting({ distance, ghostActive }) {
  const lights = useRef([]);
  const targets = useMemo(() => Array.from({ length: 3 }, () => new Object3D()), []);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    lights.current.forEach((light, index) => { if (light) light.target = targets[index]; });
    invalidate();
  }, [targets, invalidate]);
  useFrame(({ camera }) => {
    const s = ghostActive ? -camera.position.z : distance.current;
    const near = [...roadsideLamps].sort((a, b) => Math.abs(a.distance - s) - Math.abs(b.distance - s));
    lights.current.forEach((light, index) => {
      if (!light) return;
      const lamp = near[index];
      const range = Math.abs(lamp.distance - s);
      light.position.set(...lamp.head);
      targets[index].position.set(lamp.head[0] - lamp.side * 2.2, .1, lamp.head[2]);
      // Three actual lamps illuminate the asphalt and the vehicle as they pass.
      light.intensity = Math.max(0, Math.min(1, (28 - range) / 11)) * 190 * (1 - infernoMix(s) * .6);
    });
  }, -1);
  return <group name="desert-road-lighting">
    <Instances limit={roadsideLamps.length}><cylinderGeometry args={[.095, .17, 6.45, 10]} />{metal}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.position[0], 3.225, lamp.position[2]]} />)}
    </Instances>
    <Instances limit={roadsideLamps.length}><cylinderGeometry args={[.31, .35, .34, 12]} />{metal}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.position[0], .17, lamp.position[2]]} />)}
    </Instances>
    <Instances limit={roadsideLamps.length}><boxGeometry args={[2.86, .11, .11]} />{metal}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.position[0] - lamp.side * 1.36, 6.62, lamp.position[2]]} rotation={[0, 0, lamp.side * .07]} />)}
    </Instances>
    <Instances limit={roadsideLamps.length}><boxGeometry args={[.82, .22, .38]} />{trim}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={lamp.head} />)}
    </Instances>
    <Instances limit={roadsideLamps.length}><boxGeometry args={[.68, .025, .3]} /><meshStandardMaterial color="#fff0bc" emissive="#ffb258" emissiveIntensity={2.2} toneMapped={false} />
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.head[0], lamp.head[1] - .13, lamp.head[2]]} />)}
    </Instances>
    <Instances limit={roadsideLamps.length}><cylinderGeometry args={[.15, .15, .07, 12]} />{trim}
      {roadsideLamps.map(lamp => <Instance key={lamp.distance} position={[lamp.position[0], 5.84, lamp.position[2]]} />)}
    </Instances>
    {targets.map((target, index) => <primitive key={index} object={target} />)}
    {targets.map((_, index) => <spotLight key={index} ref={node => { lights.current[index] = node; }} color="#ffd69c" intensity={0} distance={23} angle={.93} penumbra={.72} decay={2} />)}
  </group>;
}
