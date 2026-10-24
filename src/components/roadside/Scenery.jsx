import { useMemo } from 'react';
import { Shape, Vector2 } from 'three';
import { roadX } from '../../data/journey';
import { sceneryStations } from '../../data/sceneryStations';

const darkMetal = '#211c1a';
function Box({ position, scale, color = darkMetal, metalness = .25, roughness = .55 }) {
  return <mesh position={position} scale={scale} castShadow receiveShadow><boxGeometry /><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} /></mesh>;
}
function Cylinder({ position, rotation, args, color = darkMetal, metalness = .35 }) {
  return <mesh position={position} rotation={rotation} castShadow><cylinderGeometry args={args} /><meshStandardMaterial color={color} metalness={metalness} roughness={.48} /></mesh>;
}

// Original, detailed double-cut guitar silhouette inspired by classic SG instruments.
export function Guitar({ finish = '#a10f19', style = 'sg' }) {
  const body = useMemo(() => {
    const s = new Shape();
    if (style === 'sg') {
      s.moveTo(-.05, -1.18); s.bezierCurveTo(-.72, -1.4, -1.2, -.9, -1.08, -.32);
      s.lineTo(-.72, .2); s.lineTo(-1.03, .92); s.quadraticCurveTo(-.57, 1.02, -.2, .55);
      s.lineTo(.2, .55); s.quadraticCurveTo(.57, 1.02, 1.03, .92); s.lineTo(.72, .2);
      s.bezierCurveTo(1.2, -.9, .72, -1.4, .05, -1.18);
    } else {
      s.moveTo(0, -1.35); s.bezierCurveTo(-1.15, -1.45, -1.5, -.55, -.93, .08);
      s.lineTo(-.65, .42); s.lineTo(-.82, 1.12); s.quadraticCurveTo(-.42, 1.16, -.12, .62);
      s.lineTo(.12, .62); s.quadraticCurveTo(.47, 1.18, .83, 1.08); s.lineTo(.62, .32);
      s.bezierCurveTo(1.38, -.15, 1.1, -1.38, 0, -1.35);
    }
    return s;
  }, [style]);
  const head = useMemo(() => {
    const s = new Shape(); s.moveTo(-.16, 0); s.lineTo(-.2, .28); s.lineTo(-.37, .8);
    s.quadraticCurveTo(0, 1.03, .37, .8); s.lineTo(.2, .28); s.lineTo(.16, 0); s.closePath(); return s;
  }, []);
  return <group rotation={[0, -.12, -.2]}>
    <mesh position={[0, 0, 0]} castShadow><extrudeGeometry args={[body, { depth: .22, bevelEnabled: true, bevelSize: .07, bevelThickness: .06, bevelSegments: 3, curveSegments: 16 }]} /><meshStandardMaterial color={finish} metalness={.48} roughness={.28} /></mesh>
    <Box position={[0, 1.72, .12]} scale={[.19, 3.25, .17]} color="#5b3623" />
    <Box position={[0, 1.72, .22]} scale={[.13, 3.16, .035]} color="#171718" metalness={.05} />
    <mesh position={[0, 3.48, .12]} castShadow><extrudeGeometry args={[head, { depth: .17, bevelEnabled: true, bevelSize: .035, bevelThickness: .025, bevelSegments: 2 }]} /><meshStandardMaterial color="#351f19" /></mesh>
    <Box position={[0, .6, .22]} scale={[.43, .13, .09]} color="#d3c8ad" metalness={.85} />
    <Box position={[0, -1.02, .22]} scale={[.46, .13, .1]} color="#c3b99f" metalness={.85} />
    {[-.27, .27].map((x, i) => <group key={x}>
      <Box position={[x, -.18 + i * .4, .22]} scale={[.13, .46, .09]} color="#c1b39b" metalness={.82} />
      <Box position={[x, -.52 + i * .47, .22]} scale={[.08, .11, .13]} color="#8f8069" />
    </group>)}
    {[-1, 1].flatMap(side => Array.from({ length: 3 }, (_, i) => <group key={`${side}-${i}`}>
      <Box position={[side * .23, 3.04 + i * .25, .13]} scale={[.22, .065, .07]} color="#b7aa91" metalness={.8} />
      <Box position={[side * .34, 3.04 + i * .25, .13]} scale={[.08, .07, .08]} color="#b7aa91" metalness={.8} />
    </group>))}
    {Array.from({ length: 6 }, (_, i) => <Box key={i} position={[(i - 2.5) * .036, .92, .235]} scale={[.009, 4.55, .009]} color="#e5dcc9" metalness={.65} />)}
    {[-.18, .18].map(x => <Cylinder key={x} position={[x, -.1, .3]} rotation={[Math.PI / 2, 0, 0]} args={[.035, .035, .035, 12]} color="#e4d5b7" metalness={.8} />)}
  </group>;
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
function Bell() {
  const profile = useMemo(() => [new Vector2(.12, 1.05), new Vector2(.2, .82), new Vector2(.32, .56), new Vector2(.48, .27), new Vector2(.76, -.12), new Vector2(.93, -.2), new Vector2(.94, -.28)], []);
  return <group>
    <Cylinder position={[0, 1.42, 0]} args={[.17, .21, .38, 20]} color="#8d7650" metalness={.82} />
    <mesh position={[0, 1.17, 0]} castShadow><latheGeometry args={[profile, 32]} /><meshStandardMaterial color="#a6813e" metalness={.86} roughness={.24} side={2} /></mesh>
    <Cylinder position={[0, .68, 0]} args={[.13, .11, 1.02, 24]} color="#aa8846" metalness={.88} />
    <Cylinder position={[0, .12, 0]} args={[.17, .17, .2, 16]} color="#43372a" metalness={.55} />
  </group>;
}
function RoadVinyl() {
  return <group>
    <Box position={[0, 1.53, 0]} scale={[3.1, 2.85, .38]} color="#1b1a1c" metalness={.25} />
    <Box position={[0, .17, .14]} scale={[3.35, .34, .68]} color="#282428" metalness={.42} />
    {[-1.46, 1.46].map(x => <Box key={x} position={[x, 1.55, .22]} scale={[.085, 2.72, .08]} color="#9b8b71" metalness={.78} />)}
    {[.31, 2.83].map(y => <Box key={y} position={[0, y, .22]} scale={[3, .085, .08]} color="#9b8b71" metalness={.78} />)}
    <Cylinder position={[.18, 1.55, .35]} rotation={[Math.PI / 2, 0, 0]} args={[1.08, 1.08, .1, 40]} color="#111114" metalness={.22} />
    {[.47, .7, .89, 1.01].map(radius => <mesh key={radius} position={[.18, 1.55, .41]}><torusGeometry args={[radius, .009, 4, 48]} /><meshStandardMaterial color="#777071" metalness={.5} roughness={.35} /></mesh>)}
    <Cylinder position={[.18, 1.55, .43]} rotation={[Math.PI / 2, 0, 0]} args={[.31, .31, .012, 32]} color="#a32622" metalness={.35} />
    <group position={[.18, 1.55, .45]} scale={.08}><Bolt /></group>
    {[-1.32, 1.32].flatMap(x => [.36, 2.68].map(y => <Cylinder key={`${x}-${y}`} position={[x, y, .29]} rotation={[Math.PI / 2, 0, 0]} args={[.055, .055, .025, 10]} color="#c2b18e" metalness={.8} />))}
  </group>;
}
function Sign({ wide = 4.2 }) {
  return <group>
    <Box position={[0, 2.3, 0]} scale={[.2, 4.6, .22]} color="#6d6251" />
    <Box position={[0, 4.8, .05]} scale={[wide, 1.55, .2]} color="#16191b" />
    <Box position={[0, 4.8, .17]} scale={[wide - .16, 1.37, .045]} color="#3c1b19" />
    <group position={[0, 5.12, .205]} scale={wide / 4.2}><Bolt /></group>
    <Box position={[0, 4.27, .21]} scale={[wide - .6, .035, .02]} color="#e2af4d" metalness={.5} />
    {[-wide * .39, wide * .39].map(x => <group key={x}>
      <Cylinder position={[x, 5.36, .19]} rotation={[Math.PI / 2, 0, 0]} args={[.045, .045, .025, 12]} color="#cfb77f" metalness={.8} />
      <Cylinder position={[x, 4.23, .19]} rotation={[Math.PI / 2, 0, 0]} args={[.045, .045, .025, 12]} color="#cfb77f" metalness={.8} />
    </group>)}
  </group>;
}
function RockFigure({ pose = 0 }) {
  return <group>
    <Box position={[0, .28, 0]} scale={[1.65, .5, 1.1]} color="#262321" />
    <mesh position={[0, 2.8, 0]} castShadow><sphereGeometry args={[.34, 18, 14]} /><meshStandardMaterial color="#b58a69" roughness={.85} /></mesh>
    <mesh position={[0, 1.67, 0]} rotation={[0, 0, pose ? -.12 : .09]} castShadow><capsuleGeometry args={[.44, .85, 5, 12]} /><meshStandardMaterial color={pose ? '#21191a' : '#761b1c'} roughness={.8} /></mesh>
    <Cylinder position={[-.5, 1.88, .16]} rotation={[0, 0, -.65]} args={[.13, .12, 1.05, 10]} color="#b58a69" />
    <Cylinder position={[.5, 1.88, .16]} rotation={[0, 0, .65]} args={[.13, .12, 1.05, 10]} color="#b58a69" />
    <Cylinder position={[-.21, .76, 0]} rotation={[0, 0, -.08]} args={[.16, .13, 1.25, 10]} color="#21191a" />
    <Cylinder position={[.23, .76, 0]} rotation={[0, 0, .08]} args={[.16, .13, 1.25, 10]} color="#21191a" />
    <group position={[-.05, 1.27, .64]} rotation={[0, 0, -.72]} scale={[.3, .34, .3]}><Guitar finish="#a20e18" /></group>
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
function Exhibit({ kind }) {
  if (kind === 'sg') return <group><Guitar /><group position={[-2.2, 0, -1]} scale={.55}><AmpStack /></group><group position={[2, 0, 1]} scale={.78}><RoadVinyl /></group></group>;
  if (kind === 'stage') return <group><LightingTower /><group position={[-3.1, 0, 1]} scale={.76}><AmpStack /></group><group position={[3.1, 0, 1]} scale={.76}><AmpStack /></group></group>;
  if (kind === 'bell') return <group><Box position={[0, 4.9, 0]} scale={[.18, 9.8, .18]} color="#5c5146" /><Box position={[0, 9.65, 0]} scale={[2.8, .2, .22]} color="#9b8b70" /><group position={[0, 8.25, .1]} scale={[1.45, 1.45, 1.45]}><Bell /></group><group position={[-1.5, 0, 0]} scale={.7}><AmpCab /></group></group>;
  if (kind === 'amps') return <group rotation={[0, .18, 0]}><AmpStack /><group position={[-2.6, 0, .25]} scale={.72}><AmpCab /></group><group position={[2.55, 0, .25]} scale={.72}><AmpCab /></group></group>;
  if (kind === 'figure') return <group><group position={[-1.6, 0, 0]}><RockFigure /></group><group position={[1.5, 0, -.6]} scale={.9}><MicrophoneStand /></group><group position={[2.7, 0, .8]} scale={.65}><AmpCab /></group></group>;
  if (kind === 'sign') return <group><Sign /><group position={[-2.8, 0, 1.2]} scale={.56}><RoadVinyl /></group></group>;
  if (kind === 'vinyl') return <group><group position={[-1.6, 0, 0]} scale={1.1}><RoadVinyl /></group><group position={[1.5, 0, -.2]} scale={.68}><AmpStack /></group><group position={[3, 0, 1]} scale={.62}><Guitar finish="#d7b266" style="classic" /></group></group>;
  if (kind === 'guitars') return <group><group position={[-2.3, 0, 0]}><Guitar /></group><group position={[2.2, 0, .5]} rotation={[0, .12, 0]}><Guitar finish="#d2b46c" style="classic" /></group><group position={[0, 0, -1.3]} scale={.7}><AmpStack /></group></group>;
  if (kind === 'mic') return <group><MicrophoneStand /><group position={[-2.5, 0, -.3]} scale={.82}><AmpCab /></group><group position={[2.5, 0, -.4]} scale={.82}><AmpCab /></group></group>;
  return <group><Sign wide={6.2} /><group position={[-3.2, 0, 1.5]}><Guitar /></group><group position={[3.4, 0, 1.3]} scale={.9}><Bell /></group><group position={[0, 0, -1.7]} scale={.82}><AmpStack /></group></group>;
}
export default function Scenery() {
  return <group>
    {sceneryStations.map(({ s, side, kind }) => <group key={s} position={[roadX(s) + side * (kind === 'stage' || kind === 'finale' ? 19 : 15), 0, -s]} rotation={[0, side < 0 ? .12 : -.12, 0]}><Exhibit kind={kind} /></group>)}
  </group>;
}
