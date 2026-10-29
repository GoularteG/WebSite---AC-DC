import {useMemo,useEffect} from 'react';
import {useGLTF} from '@react-three/drei';
import {Box3,Color,DoubleSide,MeshPhysicalMaterial,Vector3} from 'three';

export const GUITAR_URL='/models/guitar-electric.glb';
export default function GuitarModel({height=3.8,finish='cherry',...props}){
  const {scene}=useGLTF(GUITAR_URL);
  const model=useMemo(()=>{
    const root=scene.clone(true);
    // Preserve every supplied mesh and transform. Only the finish is adapted.
    const materials=new Map();
    root.traverse(child=>{
      if(!child.isMesh)return;
      child.castShadow=true;child.receiveShadow=true;
      const source=child.material;
      if(!source)return;
      if(!materials.has(source.uuid)){
        const next=finish==='cherry'&&source.name==='lambert3'
          ? new MeshPhysicalMaterial({color:new Color('#751018'),side:DoubleSide,metalness:.12,roughness:.24,clearcoat:1,clearcoatRoughness:.09})
          : source.clone();
        materials.set(source.uuid,next);
      }
      child.material=materials.get(source.uuid);
    });
    root.updateMatrixWorld(true);
    const bounds=new Box3().setFromObject(root);
    root.scale.setScalar(height/bounds.getSize(new Vector3()).y);
    root.updateMatrixWorld(true);
    const center=new Box3().setFromObject(root).getCenter(new Vector3());
    root.position.sub(center);
    root.userData.ownedMaterials=[...materials.values()];
    return root;
  },[scene,height,finish]);
  useEffect(()=>()=>model.userData.ownedMaterials.forEach(material=>material.dispose()),[model]);
  return <group name="uploaded-guitar" {...props}><primitive object={model} dispose={null}/></group>;
}
