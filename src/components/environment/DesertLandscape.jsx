import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { BufferGeometry, Color, Float32BufferAttribute, MeshStandardMaterial, Object3D, IcosahedronGeometry } from 'three';
import { desertMesas, desertRocks } from '../../data/desert';

const mesaTones = ['#ffffff', '#e9d5c7', '#f3dfc6', '#dcc9c1', '#f7e1ca'];
const rockTones = ['#765348', '#9b674b', '#66463e', '#a77453'];

function mesaGeometry() {
  const geometry = new BufferGeometry();
  const vertices = [], colors = [];
  const rings = [[0, 1], [.12, 1.04], [.31, .91], [.7, .82], [.92, .79], [1, .7]];
  const strata = ['#735044', '#8d5f4b', '#a16f52', '#815344', '#b6835d'];
  const segments = 11;
  const point = (ring, segment) => {
    const angle = segment * Math.PI * 2 / segments;
    const irregular = 1 + .065 * Math.sin(angle * 3 + .7) + .045 * Math.cos(angle * 5);
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
  const mesas = useMemo(mesaGeometry, []);
  const rocks = useMemo(() => new IcosahedronGeometry(1, 1), []);
  const mesaMaterial = useMemo(() => new MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }), []);
  const rockMaterial = useMemo(() => new MeshStandardMaterial({ roughness: 1, flatShading: true }), []);
  useEffect(() => () => {
    mesas.dispose(); rocks.dispose(); mesaMaterial.dispose(); rockMaterial.dispose();
  }, [mesas, rocks, mesaMaterial, rockMaterial]);
  return <group name="layered-desert-landscape">
    <FormationInstances formations={desertMesas} geometry={mesas} material={mesaMaterial} tones={mesaTones} />
    <FormationInstances formations={desertRocks} geometry={rocks} material={rockMaterial} tones={rockTones} />
  </group>;
}
