import {useMemo} from 'react';
import {useGLTF} from '@react-three/drei';
import {Box3,Vector3} from 'three';

export const GUITAR_URL='/models/guitar-electric.glb';
export default function GuitarModel({height=3.8,...props}){
  const {scene}=useGLTF(GUITAR_URL);
  const model=useMemo(()=>{
    const root=scene.clone(true);
    // Preserve the supplied front-facing orientation and all mesh transforms.
    root.updateMatrixWorld(true);
    const bounds=new Box3().setFromObject(root);
    root.scale.setScalar(height/bounds.getSize(new Vector3()).y);
    root.updateMatrixWorld(true);
    const center=new Box3().setFromObject(root).getCenter(new Vector3());
    root.position.sub(center);
    return root;
  },[scene,height]);
  return <group name="uploaded-guitar" {...props}><primitive object={model} dispose={null}/></group>;
}
