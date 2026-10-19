import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Color, Float32BufferAttribute, MeshStandardMaterial } from 'three';
import { roadX } from '../../data/journey';
import { infernoMix } from '../../data/finale';
export function ribbonGeometry(offset, width, start = -90, end = 1040, height = 0) {
  const points = [], indices = [];
  const count = Math.ceil((end - start) / 2);
  for (let i = 0; i <= count; i++) {
    const s = start + (end - start) * i / count;
    points.push(roadX(s) + offset - width / 2, height, -s, roadX(s) + offset + width / 2, height, -s);
    if (i < count) { const a = i * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const geometry = new BufferGeometry(); geometry.setAttribute('position', new Float32BufferAttribute(points, 3)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
}
function Ribbon({ offset = 0, width, height, material, start, end }) {
  const geometry = useMemo(() => ribbonGeometry(offset, width, start, end, height), [offset, width, start, end, height]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} material={material} receiveShadow />;
}
export default function Road({ distance }) {
  const palette = useMemo(() => Object.fromEntries(Object.entries({
    shoulder:['#705345','#382126'], asphalt:['#28292c','#1a171c'],
    edge:['#d6c5a7','#c07a55'], center:['#f6b643','#fb8d32'],
    dash:['#9c9789','#70544e'], ground:['#4e342c','#261b21'],
  }).map(([key,[normal,final]]) => [key,{normal:new Color(normal),final:new Color(final),material:new MeshStandardMaterial({color:normal,roughness:.9})}])), []);
  useEffect(() => () => Object.values(palette).forEach(item=>item.material.dispose()), [palette]);
  useFrame(() => {
    const mix = infernoMix(distance.current);
    Object.values(palette).forEach(item=>item.material.color.lerpColors(item.normal,item.final,mix));
  });
  return <group>
    <Ribbon width={15} height={-.045} material={palette.shoulder.material} />
    <Ribbon width={11} height={0} material={palette.asphalt.material} />
    {[-5, 5].map(offset => <Ribbon key={offset} offset={offset} width={.1} height={.015} material={palette.edge.material} />)}
    {[-.13, .13].map(offset => <Ribbon key={offset} offset={offset} width={.09} height={.018} material={palette.center.material} />)}
    {Array.from({ length: 110 }, (_, i) => <Ribbon key={i} offset={2.5} width={.09} start={i * 10 - 70} end={i * 10 - 66} height={.02} material={palette.dash.material} />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.09, -450]} material={palette.ground.material} receiveShadow><planeGeometry args={[1600, 2200]} /></mesh>
  </group>;
}
