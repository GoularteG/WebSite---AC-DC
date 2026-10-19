import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';

export const BOOK_URL='/models/book-encyclopedia.glb';

export default function BookModel({length=2.55,...props}) {
  const {scene}=useGLTF(BOOK_URL);
  const model=useMemo(()=>{
    const root=scene.clone(true);
    root.traverse(child=>{
      if(!child.isMesh)return;
      child.castShadow=true;
      child.receiveShadow=true;
      if(child.material){
        child.material=child.material.clone();
        child.material.roughness=.56;
        child.material.metalness=.04;
      }
    });
    root.updateMatrixWorld(true);
    const bounds=new Box3().setFromObject(root);
    root.scale.setScalar(length/bounds.getSize(new Vector3()).z);
    root.updateMatrixWorld(true);
    const centered=new Box3().setFromObject(root);
    const center=centered.getCenter(new Vector3());
    root.position.sub(center);
    root.position.y-=centered.min.y-center.y;
    return root;
  },[scene,length]);
  return <group name="uploaded-encyclopedia-book" {...props}><primitive object={model} dispose={null}/></group>;
}

useGLTF.preload(BOOK_URL);
