import { useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Box3, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { carAsset } from '../../data/assets';
export default function Challenger({ distance }) {
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
    root.position.set(-center.x, -adjusted.min.y + .03, -center.z);
    root.traverse(object => { if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; } });
    return root;
  }, [gltf.scene]);
  useEffect(() => { wheels.current = carAsset.wheelNames.map(name => model.getObjectByName(name)).filter(Boolean).map(object => ({ object, initial: object.rotation[carAsset.wheelAxis] })); }, [model]);
  useFrame(() => { wheels.current.forEach(({ object, initial }) => { object.rotation[carAsset.wheelAxis] = initial - distance.current / carAsset.wheelRadius; }); });
  return <primitive object={model} dispose={null} />;
}
