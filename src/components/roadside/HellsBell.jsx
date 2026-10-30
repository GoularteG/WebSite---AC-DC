import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace, Vector2 } from 'three';

export default function HellsBell() {
  const profile=useMemo(()=>[
    [1.30,.04],[1.38,.10],[1.38,.18],[1.28,.24],[1.16,.32],[1.04,.54],
    [.99,.70],[.95,.95],[.91,1.20],[.83,1.52],[.72,1.76],[.52,1.94],[.12,2.03],[.02,2.03],
    [.02,1.90],[.48,1.82],[.62,1.67],[.73,1.44],[.81,1.16],[.85,.92],[.90,.65],
    [1.02,.40],[1.16,.22],[1.27,.15],[1.30,.04],
  ].map(p=>new Vector2(...p)),[]);
  const badge=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
    const ctx=canvas.getContext('2d');ctx.textAlign='center';ctx.fillStyle='#bba377';
    ctx.font='bold 100px Georgia';ctx.fillText('ACϟDC',256,125);
    ctx.font='bold 30px Georgia';ctx.fillText('HELLS BELLS',256,188);
    const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;return texture;
  },[]);
  useEffect(()=>()=>badge.dispose(),[badge]);
  return <group name="cast-bronze-hells-bell">
    <mesh castShadow receiveShadow><latheGeometry args={[profile,64]}/><meshStandardMaterial color="#66573f" metalness={.72} roughness={.48}/></mesh>
    {[{r:1.35,y:.13,t:.035},{r:1.25,y:.26,t:.022},{r:.94,y:1.16,t:.018},{r:.72,y:1.76,t:.022}].map(({r,y,t})=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[r,t,6,64]}/><meshStandardMaterial color="#8b7854" metalness={.78} roughness={.4}/></mesh>)}
    <mesh position={[0,.95,0]}><cylinderGeometry args={[.959,1.004,.5,32,1,true,-.72,1.44]}/><meshStandardMaterial map={badge} transparent depthWrite={false} roughness={.65} metalness={.5} polygonOffset polygonOffsetFactor={-1}/></mesh>
    <mesh position={[0,2.14,0]}><boxGeometry args={[.43,.26,.29]}/><meshStandardMaterial color="#4e4333" metalness={.8} roughness={.5}/></mesh>
    <mesh position={[0,2.40,0]}><torusGeometry args={[.20,.065,8,24]}/><meshStandardMaterial color="#544b3b" metalness={.8} roughness={.4}/></mesh>
    <mesh position={[0,.85,0]}><cylinderGeometry args={[.065,.08,1.65,12]}/><meshStandardMaterial color="#352e27" metalness={.6} roughness={.55}/></mesh>
    <mesh position={[0,-.02,0]}><sphereGeometry args={[.19,20,12]}/><meshStandardMaterial color="#473b2d" metalness={.7} roughness={.5}/></mesh>
  </group>;
}
