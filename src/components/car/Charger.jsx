import { useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Box3, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { carAsset } from '../../data/assets';
export default function Charger({ distance, onReady }) {
  const gltf = useGLTF(carAsset.url);
  const wheels = useRef([]);
  const model = useMemo(() => {
    const root = clone(gltf.scene);
    root.rotation.y = carAsset.rotationY;
    root.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(root);
    const size = bounds.getSize(new Vector3());
    root.scale.setScalar(carAsset.length / Math.max(size.x, size.z));
    root.updateMatrixWorld(true);
    const adjusted = new Box3().setFromObject(root);
    const center = adjusted.getCenter(new Vector3());
    // Tire/rim mesh starts at source Z=1.254; exhaust geometry extends below it.
    // Contact is calibrated to the wheel bottom, not the exhaust bounding box.
    root.position.set(-center.x, -adjusted.min.y - .091, -center.z);
    // Presentation changes affect cloned materials only; cached source stays untouched.
    const materials = new Map();
    root.traverse(object => {
      if (object.isLineSegments) object.visible = false; // SketchUp drafting overlays, retained in source
      if (!object.isMesh) return;
      object.castShadow = true; object.receiveShadow = true;
      const tune = original => {
        if (materials.has(original)) return materials.get(original);
        const material = original.clone();
        if (['Charcoal', 'Color_008_1'].includes(material.name)) {
          material.color.set('#35393d'); material.metalness = .65; material.roughness = .25;
        }
        if (material.name === 'Translucent_Glass_Gray_1') {
          material.color.set('#303a40'); material.roughness = .12; material.opacity = .48; material.depthWrite = false;
        }
        if (material.name === 'Color_A06') {
          material.emissive.set('#ff1708'); material.emissiveIntensity = .85;
        }
        material.envMapIntensity = 1.3;
        materials.set(original, material); return material;
      };
      object.material = Array.isArray(object.material) ? object.material.map(tune) : tune(object.material);
    });
    root.userData.ownedMaterials = [...materials.values()];
    return root;
  }, [gltf.scene]);
  useEffect(() => { onReady(); }, [onReady]);
  useEffect(() => () => model.userData.ownedMaterials.forEach(material => material.dispose()), [model]);
  useEffect(() => { wheels.current = carAsset.wheelNames.map(name => model.getObjectByName(name)).filter(Boolean).map(object => ({ object, initial: object.rotation[carAsset.wheelAxis] })); }, [model]);
  useFrame(() => { wheels.current.forEach(({ object, initial }) => { object.rotation[carAsset.wheelAxis] = initial - distance.current / carAsset.wheelRadius; }); });
  return <primitive object={model} dispose={null} />;
}
