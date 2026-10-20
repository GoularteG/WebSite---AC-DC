import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

// Only the camera moves; JourneyRig retains the original vehicle transform.
export function TrunkCamera({ phase, car, roadLook, reduced, onZoomed, onReturned }) {
  const timeline=useRef(0), notified=useRef('');
  const rear=useMemo(()=>new Vector3(),[]), target=useMemo(()=>new Vector3(),[]);
  useFrame(({camera,invalidate},dt)=>{
    const goal=phase==='zooming'||phase==='trunk'?1:0;
    const step=Math.min(dt,.05)/1.5;
    timeline.current=reduced?goal:MathUtils.clamp(timeline.current+(goal?step:-step),0,1);
    if(Math.abs(timeline.current-goal)<.00001)timeline.current=goal;
    if(timeline.current!==goal)invalidate();
    const t=timeline.current;
    if(t>0){
      const blend=MathUtils.smootherstep(t,0,1);
      const {x,y,z}=car.current.position, angle=car.current.rotation.y;
      rear.set(x+Math.sin(angle)*4.6,y+2.2,z+Math.cos(angle)*4.6);
      camera.position.lerp(rear,blend);
      target.set(x+Math.sin(angle)*1.8,y+1,z+Math.cos(angle)*1.8);
      target.lerpVectors(roadLook.current,target,blend);
      camera.lookAt(target);
    }
    if(phase!==notified.current){
      if(phase==='zooming'&&t===1){notified.current=phase;onZoomed();}
      if(phase==='returning'&&t===0){notified.current=phase;onReturned();}
      if(phase==='road')notified.current='';
    }
  },-1);
  return null;
}

export function InteriorCamera({ reduced }) {
  const size=useThree(s=>s.size), invalidate=useThree(s=>s.invalidate);
  const distance=useRef(null);
  useFrame(({camera},dt)=>{
    const fit=Math.max(8.8,4.3/(Math.tan(Math.PI*22/180)*(size.width/size.height)));
    if(distance.current===null) distance.current=fit*1.12;
    distance.current=reduced?fit:MathUtils.damp(distance.current,fit,5,Math.min(dt,.1));
    if(Math.abs(distance.current-fit)>.001) invalidate();
    camera.position.set(0,.3+distance.current*.65,distance.current*.76);
    camera.lookAt(0,1.03,0);
  });
  return null;
}
