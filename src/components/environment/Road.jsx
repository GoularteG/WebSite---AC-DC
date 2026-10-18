import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { roadX } from '../../data/journey';
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
function Ribbon({ offset = 0, width, height, color, start, end }) {
  const geometry = useMemo(() => ribbonGeometry(offset, width, start, end, height), [offset, width, start, end, height]);
  return <mesh geometry={geometry} receiveShadow><meshStandardMaterial color={color} roughness={.83} /></mesh>;
}
export default function Road() {
  return <group>
    <Ribbon width={15} height={-.045} color="#705345" />
    <Ribbon width={11} height={0} color="#28292c" />
    {[-5, 5].map(offset => <Ribbon key={offset} offset={offset} width={.1} height={.015} color="#d6c5a7" />)}
    {[-.13, .13].map(offset => <Ribbon key={offset} offset={offset} width={.09} height={.018} color="#f6b643" />)}
    {Array.from({ length: 110 }, (_, i) => <Ribbon key={i} offset={2.5} width={.09} start={i * 10 - 70} end={i * 10 - 66} height={.02} color="#9c9789" />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.09, -450]} receiveShadow><planeGeometry args={[1600, 2200]} /><meshStandardMaterial color="#4e342c" roughness={1} /></mesh>
  </group>;
}
