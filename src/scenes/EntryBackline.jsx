import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { AmpStack, LightingTower, MicrophoneStand } from '../components/roadside/Scenery';
import { entrySandHeight } from './EntryDesert';

function FlightCase({position,rotation=0,scale=1,label}){
  return <group position={position} rotation={[0,rotation,0]} scale={scale}>
    <mesh position={[0,.6,0]}><boxGeometry args={[1.6,1,.95]}/><meshStandardMaterial color="#17191d" roughness={.65} metalness={.18}/></mesh>
    {[-1,1].map(side=><group key={side}>
      <mesh position={[0,.6+side*.47,0]}><boxGeometry args={[1.64,.05,1]}/><meshStandardMaterial color="#89898b" metalness={.85} roughness={.35}/></mesh>
      <mesh position={[side*.78,.6,0]}><boxGeometry args={[.045,1,.99]}/><meshStandardMaterial color="#6c7178" metalness={.8} roughness={.35}/></mesh>
      <mesh position={[side*.5,.66,-.49]}><boxGeometry args={[.1,.19,.035]}/><meshStandardMaterial color="#aca8a0" metalness={.8} roughness={.4}/></mesh>
      {[-.32,.32].map(z=><mesh key={z} position={[side*.61,.09,z]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.095,.095,.07,12]}/><meshStandardMaterial color="#131315" roughness={.8}/></mesh>)}
    </group>)}
    <mesh position={[0,.31,-.485]}><boxGeometry args={[1.48,.1,.025]}/><meshStandardMaterial color="#8d251c" roughness={.75}/></mesh>
    <mesh position={[0,.79,-.493]} rotation={[0,Math.PI,0]}><planeGeometry args={[.9,.24]}/><meshBasicMaterial map={label}/></mesh>
    <mesh position={[0,.52,-.508]}><boxGeometry args={[.31,.065,.06]}/><meshStandardMaterial color="#727579" metalness={.8} roughness={.45}/></mesh>
  </group>;
}
export default function EntryBackline(){
  const label=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#d8c6a7';ctx.fillRect(0,0,512,128);ctx.fillStyle='#281d1b';ctx.textAlign='center';ctx.font='bold 42px Arial';ctx.fillText('AC/DC · LIVE',256,55);ctx.font='23px monospace';ctx.fillText('HIGHWAY TOURING CREW',256,100);
    const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;return texture;
  },[]);
  useEffect(()=>()=>label.dispose(),[label]);
  return <group name="entry-touring-backline">
    <group position={[0,entrySandHeight(0,9),9]} rotation={[0,Math.PI,0]} scale={.78}>
      <LightingTower/>
      <group position={[-3.3,0,.4]} scale={.9}><AmpStack/></group>
      <group position={[3.3,0,-.2]} scale={.82}><AmpStack/></group>
    </group>
    <group position={[3.2,entrySandHeight(3.2,5.8),5.8]} rotation={[0,Math.PI+.3,0]} scale={.65}><MicrophoneStand/></group>
    <FlightCase position={[-5.6,entrySandHeight(-5.6,1.4),1.4]} rotation={.18} scale={.85} label={label}/>
    <FlightCase position={[6,entrySandHeight(6,2.4),2.4]} rotation={-.25} scale={.72} label={label}/>
  </group>;
}
