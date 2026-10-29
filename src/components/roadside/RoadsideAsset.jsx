import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Color, DoubleSide, MeshPhysicalMaterial, Vector3 } from 'three';

// A single loader keeps licensed GLBs reusable without coupling road scenery
// to the trunk UI. Source meshes and textures are retained; only the optional
// guitar finish and world-space presentation are adapted.
export default function RoadsideAsset({ asset }) {
  const { scene } = useGLTF(asset.modelPath);
  const model = useMemo(() => {
    const root = scene.clone(true);
    const materials = new Map();
    root.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const source = child.material;
      if (!source) return;
      if (!materials.has(source.uuid)) {
        const finish = asset.finish === 'cherry' && source.name === 'lambert3'
          ? new MeshPhysicalMaterial({ color: new Color('#751018'), side: DoubleSide,
            metalness: .12, roughness: .24, clearcoat: 1, clearcoatRoughness: .09 })
          : source.clone();
        materials.set(source.uuid, finish);
      }
      child.material = materials.get(source.uuid);
    });
    root.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(root);
    root.scale.setScalar(asset.height / bounds.getSize(new Vector3()).y);
    root.updateMatrixWorld(true);
    bounds.setFromObject(root);
    const center = bounds.getCenter(new Vector3());
    root.position.set(-center.x, -bounds.min.y, -center.z);
    root.userData.ownedMaterials = [...materials.values()];
    return root;
  }, [asset, scene]);
  useEffect(() => () => model.userData.ownedMaterials.forEach(material => material.dispose()), [model]);
  return <primitive object={model} dispose={null} />;
}
