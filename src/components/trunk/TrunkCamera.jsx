import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

import { parkingPose, PARKING_DURATION } from '../../data/parking';

// Normal road transforms are restored by JourneyRig before each frame.
export function ParkingCamera({ phase, car, roadLook, distance, fill, reduced, onParked, onReturned }) {
  const timeline=useRef(0), notified=useRef('');
  const rear=useMemo(()=>new Vector3(),[]), target=useMemo(()=>new Vector3(),[]);
  const follow=useMemo(()=>new Vector3(),[]), base=useMemo(()=>new Vector3(),[]);
  useFrame(({camera,invalidate},dt)=>{
    const goal=phase==='parking'||phase==='trunk'?1:0;
    const step=Math.min(dt,.05)/PARKING_DURATION;
    timeline.current=reduced?goal:MathUtils.clamp(timeline.current+(goal?step:-step),0,1);
    if(Math.abs(timeline.current-goal)<.00001)timeline.current=goal;
    if(timeline.current!==goal)invalidate();
    const t=timeline.current;
    if(t>0){
      const pose=parkingPose(distance.current,t);
      base.copy(car.current.position);
      car.current.position.set(pose.x,.025,pose.z);
      car.current.rotation.y=pose.yaw;
      // First follow the entire maneuver from a wide view, then approach the rear.
      follow.copy(camera.position).addScaledVector(base.subVectors(car.current.position,base),pose.follow);
      follow.x+=1.5*pose.follow; follow.y+=.8*pose.follow;follow.z+=3*pose.follow;
      rear.set(pose.x+Math.sin(pose.yaw)*6.2,2.8,pose.z+Math.cos(pose.yaw)*6.2);
      camera.position.copy(follow).lerp(rear,pose.camera);
      target.set(pose.x,1,pose.z);
      target.lerpVectors(roadLook.current,target,pose.follow);
      rear.set(pose.x+Math.sin(pose.yaw)*1.5,1,pose.z+Math.cos(pose.yaw)*1.5);
      target.lerp(rear,pose.camera);camera.lookAt(target);
      fill.current.position.set(pose.x-1.5,7,pose.z+2);
    }
    if(phase!==notified.current){
      if(phase==='parking'&&t===1){notified.current=phase;onParked();}
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
    const fit=Math.max(8.3,4.15/(Math.tan(Math.PI*22/180)*(size.width/size.height)));
    if(distance.current===null) distance.current=fit*1.12;
    distance.current=reduced?fit:MathUtils.damp(distance.current,fit,5,Math.min(dt,.1));
    if(Math.abs(distance.current-fit)>.001) invalidate();
    camera.position.set(0,.3+distance.current*.65,distance.current*.76);
    camera.lookAt(0,.7,0);
  });
  return null;
}
