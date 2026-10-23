import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { BufferGeometry, Color, Float32BufferAttribute, MeshStandardMaterial, Object3D, IcosahedronGeometry, CylinderGeometry, DoubleSide } from 'three';
import { desertMesas, desertRocks, desertScrub, desertYucca } from '../../data/desert';

const mesaTones = ['#ffffff', '#e9d5c7', '#f3dfc6', '#dcc9c1', '#f7e1ca'];
const rockTones = ['#765348', '#9b674b', '#66463e', '#a77453'];
const scrubTones = ['#796e52', '#68634a', '#8a7555', '#585b47'];
const yuccaTones = ['#5b6046', '#737255', '#515c47', '#867d58'];

function mesaGeometry(shape = 0) {
  const geometry = new BufferGeometry();
  const vertices = [], colors = [];
  const rings = [
    [[0, 1], [.12, 1.04], [.31, .91], [.7, .82], [.92, .79], [1, .7]],
    [[0, 1], [.16, 1.1], [.43, .87], [.69, .7], [.87, .49], [1, .17]],
    [[0, 1], [.15, .88], [.37, .79], [.7, .7], [.92, .57], [1, .51]],
  ][shape];
  const strata = ['#735044', '#8d5f4b', '#a16f52', '#815344', '#b6835d'];
  const segments = 11;
  const point = (ring, segment) => {
    const angle = segment * Math.PI * 2 / segments;
    const irregular = 1 + .09 * Math.sin(angle * (3 + shape) + .7) + .06 * Math.cos(angle * 5 + shape);
    return [Math.cos(angle) * ring[1] * irregular, ring[0], Math.sin(angle) * ring[1] * irregular];
  };
  const triangle = (a, b, c, color) => {
    const tint = new Color(color);
    for (const vertex of [a, b, c]) {
      vertices.push(...vertex);
      colors.push(tint.r, tint.g, tint.b);
    }
  };
  for (let ring = 0; ring < rings.length - 1; ring++) {
    for (let segment = 0; segment < segments; segment++) {
      const a = point(rings[ring], segment), b = point(rings[ring], segment + 1);
      const c = point(rings[ring + 1], segment), d = point(rings[ring + 1], segment + 1);
      triangle(a, c, b, strata[ring]);
      triangle(b, c, d, strata[ring]);
    }
  }
  for (let segment = 0; segment < segments; segment++) {
    triangle([0, 1, 0], point(rings.at(-1), segment + 1), point(rings.at(-1), segment), '#b88660');
  }
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function basinRangeGeometry(side) {
  const vertices = [], colors = [];
  const nearTone = new Color('#805c4d'), crestTone = new Color('#9d745d'), farTone = new Color('#674d49');
  const ridge = distance => {
    const base = roadX(distance) + side * (49 + 9 * Math.sin(distance / 91));
    const rise = 7 + 10 * Math.abs(Math.sin(distance / 104 + side)) + 9 * Math.max(0, Math.sin(distance / 37 + side * 2));
    return [
      [base, -.12, -distance],
      [base + side * (31 + 8 * Math.sin(distance / 65)), rise, -distance],
      [base + side * 96, -.12, -distance],
    ];
  };
  const add = (a, b, c, tone) => {
    vertices.push(...a, ...b, ...c);
    for (let i = 0; i < 3; i++) colors.push(tone.r, tone.g, tone.b);
  };
  for (let distance = -130; distance < 745; distance += 22) {
    const current = ridge(distance), next = ridge(distance + 22);
    add(current[0], current[1], next[0], nearTone);
    add(next[0], current[1], next[1], nearTone);
    add(current[1], current[2], next[1], crestTone);
    add(next[1], current[2], next[2], farTone);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function yuccaGeometry() {
  const positions = [];
  for (let layer = 0; layer < 2; layer++) {
    const count = layer ? 9 : 13;
    for (let index = 0; index < count; index++) {
      const angle = index * Math.PI * 2 / count + layer * .24;
      const dx = Math.cos(angle), dz = Math.sin(angle);
      const spread = layer ? .58 : 1;
      const width = layer ? .095 : .13;
      const left = [dx * .06 - dz * width, .05, dz * .06 + dx * width];
      const right = [dx * .06 + dz * width, .05, dz * .06 - dx * width];
      const shoulder = [dx * spread * .6, layer ? .72 : .46, dz * spread * .6];
      const tip = [dx * spread, layer ? .95 : .25, dz * spread];
      positions.push(...left, ...right, ...shoulder, ...left, ...shoulder, ...tip, ...right, ...tip, ...shoulder);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function scrubGeometry(style) {
  const positions = [];
  const count = style ? 11 : 8;
  for (let index = 0; index < count; index++) {
    const angle = index * Math.PI * 2 / count + style * .32;
    const dx = Math.cos(angle), dz = Math.sin(angle);
    const spread = .5 + .42 * Math.sin(index * 5.3 + style + 1) ** 2;
    const lift = -.12 + .38 * Math.sin(index * 3.1 + 1) ** 2;
    const width = .12 + (index % 3) * .035;
    const base = [dx * .17, -.38, dz * .17];
    const left = [dx * spread * .66 - dz * width, lift, dz * spread * .66 + dx * width];
    const right = [dx * spread * .66 + dz * width, lift, dz * spread * .66 - dx * width];
    const tip = [dx * spread, lift - .12, dz * spread];
    positions.push(...base, ...left, ...right, ...left, ...tip, ...right);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function FormationInstances({ formations, geometry, material, tones }) {
  const mesh = useRef();
  const invalidate = useThree(state => state.invalidate);
  useLayoutEffect(() => {
    const dummy = new Object3D();
    formations.forEach((formation, index) => {
      dummy.position.set(...formation.position);
      dummy.rotation.set(0, formation.rotation, 0);
      dummy.scale.set(formation.width, formation.height, formation.width * formation.depth);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
      mesh.current.setColorAt(index, new Color(tones[formation.tone]));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.instanceColor.needsUpdate = true;
    invalidate();
  }, [formations, tones, invalidate]);
  return <instancedMesh ref={mesh} args={[geometry, material, formations.length]} frustumCulled={false} receiveShadow />;
}

export default function DesertLandscape() {
  const mesas = useMemo(() => [0, 1, 2].map(mesaGeometry), []);
  const mesaGroups = useMemo(() => [0, 1, 2].map(shape => desertMesas.filter(formation => formation.shape === shape)), []);
  const ranges = useMemo(() => [-1, 1].map(basinRangeGeometry), []);
  const rocks = useMemo(() => new IcosahedronGeometry(1, 1), []);
  const scrub = useMemo(() => [0, 1].map(scrubGeometry), []);
  const scrubGroups = useMemo(() => [0, 1].map(shape => desertScrub.filter((_, index) => index % 2 === shape)), []);
  const yuccaLeaves = useMemo(yuccaGeometry, []);
  const yuccaTrunks = useMemo(() => new CylinderGeometry(.08, .16, 1, 7), []);
  const trunks = useMemo(() => desertYucca.map(plant => ({ ...plant, position: [plant.position[0], plant.height * .38, plant.position[2]], width: plant.width * .28, height: plant.height * .76, depth: .55 })), []);
  const crowns = useMemo(() => desertYucca.map(plant => ({ ...plant, position: [plant.position[0], plant.height * .73, plant.position[2]], width: plant.width, height: plant.height * .48, depth: 1 })), []);
  const mesaMaterial = useMemo(() => new MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true, side: DoubleSide }), []);
  const rockMaterial = useMemo(() => new MeshStandardMaterial({ roughness: 1, flatShading: true }), []);
  const plantMaterial = useMemo(() => new MeshStandardMaterial({ roughness: 1, flatShading: true, side: DoubleSide }), []);
  const trunkMaterial = useMemo(() => new MeshStandardMaterial({ color: '#554637', roughness: 1, flatShading: true }), []);
  useEffect(() => () => {
    mesas.forEach(geometry => geometry.dispose()); ranges.forEach(geometry => geometry.dispose());
    rocks.dispose(); scrub.forEach(geometry => geometry.dispose()); yuccaLeaves.dispose(); yuccaTrunks.dispose();
    mesaMaterial.dispose(); rockMaterial.dispose(); plantMaterial.dispose(); trunkMaterial.dispose();
  }, [mesas, ranges, rocks, scrub, yuccaLeaves, yuccaTrunks, mesaMaterial, rockMaterial, plantMaterial, trunkMaterial]);
  return <group name="layered-desert-landscape">
    {ranges.map((geometry, index) => <mesh key={index} geometry={geometry} material={mesaMaterial} receiveShadow />)}
    {mesas.map((geometry, index) => <FormationInstances key={index} formations={mesaGroups[index]} geometry={geometry} material={mesaMaterial} tones={mesaTones} />)}
    <FormationInstances formations={desertRocks} geometry={rocks} material={rockMaterial} tones={rockTones} />
    {scrub.map((geometry, index) => <FormationInstances key={index} formations={scrubGroups[index]} geometry={geometry} material={plantMaterial} tones={scrubTones} />)}
    <FormationInstances formations={trunks} geometry={yuccaTrunks} material={trunkMaterial} tones={['#ffffff','#ffffff','#ffffff','#ffffff']} />
    <FormationInstances formations={crowns} geometry={yuccaLeaves} material={plantMaterial} tones={yuccaTones} />
  </group>;
}
