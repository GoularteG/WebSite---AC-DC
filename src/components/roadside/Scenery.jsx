import { Suspense, useMemo } from 'react';
import { Shape } from 'three';
import { distanceAtProgress, roadX } from '../../data/journey';
import { roadsideAssets } from '../../data/roadsideAssets';
import RoadsideAsset from './RoadsideAsset';
import HellsBell from './HellsBell';

const darkMetal = '#211c1a';
function Box({ position, scale, color = darkMetal, metalness = .25, roughness = .55 }) {
  return <mesh position={position} scale={scale} castShadow receiveShadow><boxGeometry /><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} /></mesh>;
}
function Cylinder({ position, rotation, args, color = darkMetal, metalness = .35 }) {
  return <mesh position={position} rotation={rotation} castShadow><cylinderGeometry args={args} /><meshStandardMaterial color={color} metalness={metalness} roughness={.48} /></mesh>;
}

function AmpCab({ width = 2.8 }) {
  return <group>
    <Box position={[0, 1.05, 0]} scale={[width, 2.1, 1.45]} color="#201a18" />
    <Box position={[0, 1.05, .74]} scale={[width - .15, 1.92, .045]} color="#4b4036" />
    {[-.68, .68].map(x => <group key={x}>
      <Cylinder position={[x, 1.02, .79]} rotation={[Math.PI / 2, 0, 0]} args={[.43, .43, .08, 24]} color="#171719" />
      <Cylinder position={[x, 1.02, .84]} rotation={[Math.PI / 2, 0, 0]} args={[.25, .25, .025, 24]} color="#74695c" metalness={.1} />
      <Cylinder position={[x, 1.02, .86]} rotation={[Math.PI / 2, 0, 0]} args={[.095, .095, .025, 20]} color="#252326" />
      <Box position={[x, 1.89, .79]} scale={[.56, .045, .035]} color="#b49867" />
    </group>)}
    <Box position={[0, 2.16, .76]} scale={[width - .35, .34, .08]} color="#292523" />
    {[-.75, -.38, 0, .38, .75].map((x, i) => <Cylinder key={x} position={[x, 2.17, .82]} rotation={[Math.PI / 2, 0, 0]} args={[.055, .055, .045, 12]} color={i === 2 ? '#d7a84c' : '#a99572'} metalness={.7} />)}
  </group>;
}
function AmpStack() {
  return <group>
    <AmpCab width={3.2} />
    <group position={[0, 2.25, 0]}>
      <Box position={[0, .35, 0]} scale={[2.7, .7, 1.4]} color="#191717" />
      <Box position={[0, .34, .72]} scale={[2.5, .52, .035]} color="#302c28" />
      {Array.from({ length: 7 }, (_, i) => <Cylinder key={i} position={[(i - 3) * .31, .36, .77]} rotation={[Math.PI / 2, 0, 0]} args={[.045, .045, .04, 12]} color={i === 3 ? '#e9ae43' : '#c1ae8f'} />)}
    </group>
  </group>;
}
function Bolt() {
  const shape = useMemo(() => { const s = new Shape(); [[.25,3.3],[-.9,.1],[-.1,.1],[-.8,-2.7],[1.1,.7],[.2,.7],[.9,3.3]].forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y)); s.closePath(); return s; }, []);
  return <mesh castShadow><extrudeGeometry args={[shape, { depth: .25, bevelEnabled: true, bevelSize: .06, bevelThickness: .04, bevelSegments: 2 }]} /><meshStandardMaterial color="#f6b643" emissive="#ff6012" emissiveIntensity={.65} metalness={.6} roughness={.25} /></mesh>;
}
function MicrophoneStand() {
  return <group>
    <Cylinder position={[0, 2.05, 0]} args={[.035, .055, 4.1, 10]} color="#b7aa95" metalness={.82} />
    {[-1, 1].map(side => <group key={side} rotation={[0, 0, side * .45]}><Cylinder position={[side * .43, .06, 0]} args={[.026, .026, .9, 8]} color="#938674" /></group>)}
    <Cylinder position={[.52, 3.76, 0]} rotation={[0, 0, -Math.PI / 4]} args={[.028, .028, 1.5, 8]} color="#b7aa95" metalness={.82} />
    <Cylinder position={[1.08, 4.3, 0]} rotation={[0, 0, Math.PI / 2]} args={[.12, .12, .5, 16]} color="#251f1d" metalness={.6} />
    <mesh position={[1.34, 4.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><sphereGeometry args={[.15, 16, 12]} /><meshStandardMaterial color="#a99c86" metalness={.8} roughness={.3} /></mesh>
    <Cylinder position={[0, .16, 0]} args={[.1, .12, .18, 12]} color="#26211e" />
  </group>;
}
function LightingTower() {
  return <group>
    {[-2.6, 2.6].map(x => <group key={x}>
      <Box position={[x, 3.3, 0]} scale={[.18, 6.6, .18]} color="#61594e" />
      {[1, 2.7, 4.4].map(y => <Box key={y} position={[x, y, .1]} scale={[.62, .08, .08]} color="#9b8b70" />)}
    </group>)}
    <Box position={[0, 6.3, 0]} scale={[5.3, .18, .2]} color="#9b8b70" />
    {[-1.8, 0, 1.8].map(x => <group key={x} position={[x, 5.95, .12]}><Cylinder args={[.3, .38, .58, 16]} color="#211d1c" /><mesh position={[0, -.3, .05]}><sphereGeometry args={[.24, 16, 12]} /><meshStandardMaterial color="#f08b35" emissive="#ed4c17" emissiveIntensity={1.1} /></mesh></group>)}
    <group position={[0, 4.9, .25]}><Bolt /></group>
  </group>;
}
export function Landmark({ asset, eager = false }) {
  const { kind } = asset;
  return <group name={`roadside-${asset.id}`}
    position={asset.position ?? [roadX(asset.distance) + asset.side * asset.offset, -.08, -asset.distance]}
    rotation={asset.rotation} scale={asset.scale ?? 1}>
    {kind === 'model' && (eager ? <RoadsideAsset asset={asset}/> : <Suspense fallback={null}><RoadsideAsset asset={asset} /></Suspense>)}
    {kind === 'stage' && <group>
      <LightingTower />
      <group position={[-3.3, 0, .4]} scale={.82}><AmpStack /></group>
      <group position={[3.3, 0, -.25]} scale={.9}><AmpStack /></group>
      <group position={[0, 0, 1]}><MicrophoneStand /></group>
    </group>}
    {kind === 'bell' && <group>
      {[-3.7, 3.7].map(x => <Box key={x} position={[x, 4.55, 0]} scale={[.25, 9.1, .35]} color="#27282a" metalness={.72} />)}
      <Box position={[0, 9.1, 0]} scale={[7.8, .42, .55]} color="#3a3430" metalness={.72} />
      {[0,1,2].map(i=><mesh key={i} position={[0,8.65+i*.16,0]} rotation={[0,i%2*Math.PI/2,0]}><torusGeometry args={[.13,.035,6,16]}/><meshStandardMaterial color="#6e6250" metalness={.8} roughness={.45}/></mesh>)}
      {[-1,1].map(side=><Box key={side} position={[side*3.17,8.55,0]} scale={[.13,1.45,.18]} color="#52483a" />)}
      <group position={[0, 3.1, 0]} scale={2.1}><HellsBell /></group>
    </group>}
    {kind === 'amps' && <group>
      {[-3.4, 0, 3.4].map((x, index) => <group key={x} position={[x, 0, index === 1 ? -.55 : .35]}
        rotation={[0, (index - 1) * -.08, 0]} scale={index === 1 ? 1.08 : .86}><AmpStack /></group>)}
    </group>}
  </group>;
}
export default function Scenery({ started, targetProgress }) {
  const position = distanceAtProgress(targetProgress);
  if (!started) return null;
  return <group name="curated-roadside-landmarks">
    {roadsideAssets.filter(asset => asset.distance > position - 100 && asset.distance < position + 210).map(asset => <Landmark key={asset.id} asset={asset} />)}
  </group>;
}
