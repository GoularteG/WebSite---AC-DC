import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

// Runs after the road rig. Its original camera and car transforms are the base
// on every frame, so reversing the transition restores the same journey pose.
export function ParkingCamera({ phase, car, roadLook, reduced, onParked, onReturned }) {
  const blend=useRef(0), notified=useRef('');
  const position=useMemo(()=>new Vector3(),[]), target=useMemo(()=>new Vector3(),[]);
  useFrame(({camera,invalidate},dt)=>{
    const parking=phase==='parking'||phase==='trunk';
    const goal=parking?1:0;
    blend.current=reduced?goal:MathUtils.damp(blend.current,goal,3.7,Math.min(dt,.1));
    if(Math.abs(blend.current-goal)<.002) blend.current=goal;
    if(blend.current!==goal) invalidate();
    const t=blend.current;
    car.current.position.x+=7*MathUtils.smoothstep(t,0,.65);
    if(t>0){
      const angle=car.current.rotation.y, zoom=MathUtils.smoothstep(t,.25,1);
      position.set(car.current.position.x+Math.sin(angle)*6.2,2.8,car.current.position.z+Math.cos(angle)*6.2);
      camera.position.lerp(position,zoom);
      target.set(car.current.position.x+Math.sin(angle)*1.8,1.05,car.current.position.z+Math.cos(angle)*1.8);
      target.lerpVectors(roadLook.current,target,zoom);
      camera.lookAt(target);
    }
    if(phase!==notified.current){
      if(phase==='parking'&&t===1){notified.current=phase;onParked();}
      if(phase==='returning'&&t===0){notified.current=phase;onReturned();}
      if(phase==='road') notified.current='';
    }
  },-1);
  return null;
}

export function InteriorCamera({ reduced }) {
  const size=useThree(s=>s.size), invalidate=useThree(s=>s.invalidate);
  const distance=useRef(null);
  useFrame(({camera},dt)=>{
    const fit=Math.max(8.3,4.15/(Math.tan(Math.PI*22/180)*(size.width/size.height)));
    if(distance.current===null) distance.current=fit*1.12;
    distance.current=reduced?fit:MathUtils.damp(distance.current,fit,5,Math.min(dt,.1));
    if(Math.abs(distance.current-fit)>.001) invalidate();
    camera.position.set(0,.3+distance.current*.65,distance.current*.76);
    camera.lookAt(0,.7,0);
  });
  return null;
}
