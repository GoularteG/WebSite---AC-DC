import { useMemo } from 'react';
import { Shape } from 'three';
import { Instances, Instance } from '@react-three/drei';
import { roadX } from '../../data/journey';
function Box({ position, scale, color = '#18191d', metalness = .25, roughness = .55 }) {
  return <mesh position={position} scale={scale} castShadow receiveShadow><boxGeometry /><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} /></mesh>;
}
function Guitar() {
  const shape = useMemo(() => {
    const s = new Shape(); s.moveTo(0, -1.45); s.bezierCurveTo(-1.6, -1.5, -1.65, -.1, -.72, .4); s.lineTo(-.95, 1.2); s.quadraticCurveTo(-.55, 1.2, -.24, .65); s.lineTo(.24, .65); s.quadraticCurveTo(.6, 1.2, .95, 1.2); s.lineTo(.72, .4); s.bezierCurveTo(1.65, -.1, 1.6, -1.5, 0, -1.45); return s;
  }, []);
  return <group rotation={[0, -.2, -.18]}>
    <mesh castShadow><extrudeGeometry args={[shape, { depth: .3, bevelEnabled: true, bevelSize: .09, bevelThickness: .08, bevelSegments: 2, steps: 1, curveSegments: 12 }]} /><meshStandardMaterial color="#a40f17" metalness={.5} roughness={.3} /></mesh>
    <Box position={[0, 2, .12]} scale={[.29, 3.6, .22]} color="#211813" />
    <Box position={[0, 4, .12]} scale={[.52, .8, .24]} color="#17171a" />
    <Box position={[0, -.6, .43]} scale={[.65, .17, .12]} color="#bab6a9" metalness={.9} />
    {[0, .44].map(y => <Box key={y} position={[0, y, .43]} scale={[.57, .22, .1]} color="#c7bfae" metalness={.9} />)}
    {Array.from({ length: 15 }, (_, i) => <Box key={i} position={[0, .9 + i * .19, .25]} scale={[.3, .018, .02]} color="#bbb4a4" />)}
    {Array.from({ length: 6 }, (_, i) => <Box key={i} position={[(i - 2.5) * .038, 1.5, .5]} scale={[.008, 4.3, .008]} color="#ddd2b4" />)}
    {[-1, 1].flatMap(side => [0, 1, 2].map(i => <Box key={`${side}-${i}`} position={[side * .36, 3.8 + i * .2, .12]} scale={[.21, .09, .11]} color="#b5aaa0" />))}
  </group>;
}
function Stack() {
  return <group>
    {[0, 1, 2].map(row => <group key={row} position={[0, row * 2.3, 0]}>
      <Box position={[0, 1.1, 0]} scale={[3.2, 2.15, 1.5]} />
      <Box position={[0, 1.1, .77]} scale={[2.92, 1.9, .06]} color="#44413c" />
      {[-.73, .73].flatMap(x => [.65, 1.55].map(y => <mesh key={`${x}-${y}`} position={[x, y, .83]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.4, .4, .08, 20]} /><meshStandardMaterial color="#131416" roughness={.9} /></mesh>))}
      <Box position={[0, 1.92, .84]} scale={[.7, .06, .04]} color="#d6c5a7" />
    </group>)}
  </group>;
}
function Bolt() {
  const shape = useMemo(() => { const s = new Shape(); [[.25,3.3],[-.9,.1],[-.1,.1],[-.8,-2.7],[1.1,.7],[.2,.7],[.9,3.3]].forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y)); s.closePath(); return s; }, []);
  return <mesh castShadow><extrudeGeometry args={[shape, { depth: .25, bevelEnabled: false }]} /><meshStandardMaterial color="#f6b643" emissive="#ff6012" emissiveIntensity={.65} metalness={.6} roughness={.25} /></mesh>;
}
function Stage() {
  return <group>
    {[-5, 5].map(x => <group key={x}><Box position={[x, 6, 0]} scale={[.22, 12, .22]} color="#6a6260" />{Array.from({length:6},(_,i)=><Box key={i} position={[x, i*2+1, .1]} scale={[.7, .08, .08]} color="#a19380" />)}</group>)}
    <Box position={[0, 12, 0]} scale={[10.2, .3, .3]} color="#a19380" />
    {[-3, 0, 3].map(x => <mesh key={x} position={[x, 11.7, .1]} rotation={[.5,0,0]}><cylinderGeometry args={[.25,.4,.65,12]} /><meshStandardMaterial color="#1a1716" emissive="#f0441b" emissiveIntensity={1.3} /></mesh>)}
    <group position={[0, 7, .2]}><Bolt /></group>
    <group position={[-3, 0, 0]}><Stack /></group><group position={[3, 0, 0]}><Stack /></group>
  </group>;
}
export default function Scenery() {
  return <group>
    {[25, 135, 285, 425, 575, 715, 830].map((s,i)=><group key={s} position={[roadX(s) + (i%2 ? 15 : -14), 3.2, -s]} rotation={[0, i%2 ? -.35 : .35, 0]} scale={1.8}><Guitar /></group>)}
    {[65, 230, 370, 530, 675, 810].map((s,i)=><group key={s} position={[roadX(s) + (i%2 ? -19 : 19), 0, -s]} rotation={[0,i%2?.2:-.2,0]}><Stage /></group>)}
    <Instances limit={170}><boxGeometry args={[.1,1.2,.1]}/><meshStandardMaterial color="#a9967d"/>{Array.from({length:85},(_,i)=>{const s=i*12-30;return [-1,1].map(side=><Instance key={`${i}-${side}`} position={[roadX(s)+side*6.5,.6,-s]}/>);})}</Instances>
    <Instances limit={170}><boxGeometry args={[.18,.2,.05]}/><meshStandardMaterial color="#f6b643"/>{Array.from({length:85},(_,i)=>{const s=i*12-30;return [-1,1].map(side=><Instance key={`${i}-${side}`} position={[roadX(s)+side*6.5,.95,-s+.08]}/>);})}</Instances>
  </group>;
}
