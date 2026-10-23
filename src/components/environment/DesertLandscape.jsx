import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Color, DoubleSide, MeshStandardMaterial, Object3D } from 'three';
import { desertMesas, desertRocks, desertScrub, desertYucca, desertPebbles, desertVergeScrub } from '../../data/desert';
import { basinTerrainGeometry, creosoteGeometry, desertStoneGeometry, erodedFormationGeometry, rootedYuccaGeometry } from './desertGeometry';

const mesaTones = ['#ffffff', '#e3d7c8', '#eee0ca', '#d8cec4', '#f3e6d1'];
const rockTones = ['#a48c71', '#bc9d78', '#998878', '#c3aa86'];
const scrubTones = ['#a6a282', '#8e987a', '#b1a280', '#9a9e80'];
const yuccaTones = ['#a3ad8c', '#b0b598', '#8f9f89', '#b8b394'];
const mesaGroups = [0, 1, 2].map(shape => desertMesas.filter(formation => formation.shape === shape));

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
    mesh.current.computeBoundingSphere();
    invalidate();
  }, [formations, tones, invalidate]);
  return <instancedMesh ref={mesh} args={[geometry, material, formations.length]} receiveShadow />;
}

export default function DesertLandscape() {
  const assets = useMemo(() => ({
    mesas: [0,1,2].map(erodedFormationGeometry),
    basin: basinTerrainGeometry(),
    rocks: desertStoneGeometry(),
    scrub: creosoteGeometry(),
    yucca: rootedYuccaGeometry(),
    stoneMaterial: new MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }),
    terrainMaterial: new MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
    plantMaterial: new MeshStandardMaterial({ vertexColors: true, roughness: 1, side: DoubleSide }),
  }), []);
  useEffect(() => () => {
    assets.mesas.forEach(geometry => geometry.dispose());
    for (const [key, resource] of Object.entries(assets)) if (key !== 'mesas') resource.dispose();
  }, [assets]);
  return <group name="mojave-basin-landscape">
    <mesh geometry={assets.basin} material={assets.terrainMaterial} receiveShadow />
    {mesaGroups.map((formations, shape) => <FormationInstances key={shape} formations={formations} geometry={assets.mesas[shape]} material={assets.stoneMaterial} tones={mesaTones} />)}
    <FormationInstances formations={desertRocks} geometry={assets.rocks} material={assets.stoneMaterial} tones={rockTones} />
    <FormationInstances formations={desertPebbles} geometry={assets.rocks} material={assets.stoneMaterial} tones={rockTones} />
    <FormationInstances formations={desertScrub} geometry={assets.scrub} material={assets.plantMaterial} tones={scrubTones} />
    <FormationInstances formations={desertVergeScrub} geometry={assets.scrub} material={assets.plantMaterial} tones={scrubTones} />
    <FormationInstances formations={desertYucca} geometry={assets.yucca} material={assets.plantMaterial} tones={yuccaTones} />
  </group>;
}
