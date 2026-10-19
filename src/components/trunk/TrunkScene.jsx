import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { Guitar } from '../roadside/Scenery';
import { InteriorCamera } from './TrunkCamera';
import { SelectableObject } from './ObjectSelection';

function useSurface(kind) {
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
    const ctx=canvas.getContext('2d');
    if(kind==='carpet'){
      ctx.fillStyle='#242223';ctx.fillRect(0,0,512,512);
      for(let i=0;i<18000;i++){const x=(i*97)%512,y=(i*173+Math.floor(i/512)*31)%512;ctx.fillStyle=i%3?'#383536':'#181819';ctx.fillRect(x,y,1,3);}
    }else{
      ctx.fillStyle=kind==='book'?'#341d18':kind==='hell'?'#662319':kind==='razor'?'#193541':'#111214';ctx.fillRect(0,0,512,512);
      ctx.strokeStyle='#ac8350';ctx.lineWidth=3;ctx.strokeRect(23,23,466,466);ctx.strokeRect(32,32,448,448);
      ctx.textAlign='center';ctx.fillStyle='#d7bc84';ctx.font='42px "Metal Mania", Georgia';ctx.fillText('ACϟDC',256,104);
      ctx.font='65px "Metal Mania", Georgia';
      const lines=kind==='book'?['THE','MAKING','OF']:kind==='hell'?['HIGHWAY','TO HELL']:kind==='razor'?['THE','RAZORS EDGE']:['BACK','IN BLACK'];
      lines.forEach((line,i)=>ctx.fillText(line,256,220+i*72));
      ctx.font='15px Arial';ctx.fillText(kind==='book'?'THE HIGHWAY ARCHIVES':kind==='hell'?'1979 · THE COLLECTION':kind==='razor'?'1990 · THE COLLECTION':'1980 · THE COLLECTION',256,450);
    }
    const result=new CanvasTexture(canvas);result.colorSpace=SRGBColorSpace;
    if(kind==='carpet'){result.wrapS=result.wrapT=RepeatWrapping;result.repeat.set(5,3);}
    return result;
  },[kind]);
  useEffect(()=>()=>texture.dispose(),[texture]);return texture;
}
function Trim({position,args,color='#7e321d',radius=.05,metalness=.65}) {
  return <RoundedBox position={position} args={args} radius={radius} smoothness={3}>
    <meshStandardMaterial color={color} metalness={metalness} roughness={.33}/>
  </RoundedBox>;
}
function TrunkInterior() {
  const fabric=useSurface('carpet');
  return <group>
    <RoundedBox args={[6.25,.17,3.6]} position={[0,-.1,0]} radius={.12} smoothness={3}><meshStandardMaterial map={fabric} roughness={1}/></RoundedBox>
    <Trim position={[0,.6,-1.8]} args={[6.4,1.35,.2]}/>
    {[-1,1].map(side=><group key={side}>
      <Trim position={[side*3.15,.4,0]} args={[.18,.9,3.6]}/>
      <Trim position={[side*3.2,.91,0]} args={[.07,.07,3.75]} color="#c0b5a7"/>
      <Trim position={[side*3.07,.82,0]} args={[.07,.09,3.6]} color="#17191a" metalness={.1}/>
      <group position={[side*2.55,1,-1.53]} rotation={[.22,0,0]}>
        <Trim position={[0,.65,0]} args={[.07,1.4,.09]} color="#c0b5a7"/>
      </group>
      <RoundedBox position={[side*2.65,.25,-.9]} args={[.65,.65,1.3]} radius={.3} smoothness={4}><meshStandardMaterial map={fabric} roughness={1}/></RoundedBox>
    </group>)}
    <Trim position={[0,.11,1.85]} args={[6.5,.2,.18]} color="#17191a"/>
    <Trim position={[0,.06,1.96]} args={[6.55,.07,.08]} color="#c0b5a7"/>
    <group position={[0,1.2,-1.87]} rotation={[-.24,0,0]}>
      <Trim position={[0,1,0]} args={[6.35,2.1,.16]} radius={.17}/>
      {[-2,0,2].map(x=><group key={x}>
        <Trim position={[x,1,.12]} args={[1.75,1.65,.12]} radius={.16} color="#542419"/>
        <Trim position={[x,1,.2]} args={[1.48,1.4,.05]} radius={.2} color="#92391e"/>
      </group>)}
      <Trim position={[0,.14,.16]} args={[6.05,.12,.1]} color="#d17d43"/>
      <Trim position={[0,1.95,.16]} args={[.4,.18,.12]} color="#a8a39a"/>
    </group>
    <group position={[-1.7,.36,-.87]}>
      <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.57,.19,16,48]}/><meshStandardMaterial color="#151618" roughness={.85}/></mesh>
      <mesh><cylinderGeometry args={[.42,.42,.14,32]}/><meshStandardMaterial color="#6b6d69" metalness={.8} roughness={.3}/></mesh>
      <mesh position={[0,.12,0]}><cylinderGeometry args={[.1,.16,.14,12]}/><meshStandardMaterial color="#b7b3a9" metalness={.85} roughness={.2}/></mesh>
      {Array.from({length:5},(_,i)=><mesh key={i} position={[Math.cos(i*Math.PI*.4)*.27,.1,Math.sin(i*Math.PI*.4)*.27]}><cylinderGeometry args={[.04,.04,.06,8]}/><meshStandardMaterial color="#bbb4a5" metalness={.8}/></mesh>)}
    </group>
  </group>;
}
function BookObject() {
  const cover=useSurface('book');
  return <group rotation={[0,-.12,0]}>
    <Trim position={[0,.16,0]} args={[1.45,.29,1.85]} color="#381e18" radius={.04}/>
    <Trim position={[.025,.18,.01]} args={[1.36,.16,1.74]} color="#bfa985" radius={.015} metalness={0}/>
    <Trim position={[0,.3,0]} args={[1.46,.065,1.86]} color="#381e18" radius={.025}/>
    <mesh position={[0,.336,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[1.43,1.81]}/><meshStandardMaterial map={cover} roughness={.75}/></mesh>
    <Trim position={[-.7,.18,0]} args={[.08,.32,1.84]} color="#8d5e36" radius={.02}/>
  </group>;
}
function RecordCase({index}) {
  const cover=useSurface(['hell','razor','album'][index]);
  return <group position={[-.08*index,.08+index*.075,-index*.07]} rotation={[0,index*.14,0]}>
    <Trim position={[0,0,0]} args={[1.1,.07,1.05]} color={index===1?'#801d17':'#282c30'} radius={.015}/>
    <mesh position={[0,.038,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.98,.97]}/><meshStandardMaterial map={cover} roughness={.35}/></mesh>
  </group>;
}
function RecordsObject() {
  return <group>
    {[0,1,2].map(i=><RecordCase key={i} index={i}/>)}
    <mesh position={[.5,.34,-.1]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.07,.48,64]}/><meshStandardMaterial color="#d1d5d0" metalness={.45} roughness={.25}/></mesh>
    <mesh position={[.5,.345,-.1]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.075,.11,32]}/><meshStandardMaterial color="#73695d" metalness={.7} roughness={.25}/></mesh>
  </group>;
}
export default function TrunkScene({reduced,onSelect,active}) {
  return <Canvas frameloop="demand" dpr={[1,1.25]} camera={{position:[0,7,9],fov:44,near:.1,far:60}} gl={{antialias:true,powerPreference:'low-power'}}
    aria-hidden="true" fallback={<div className="trunk-webgl-fallback">Explore os objetos pelos botões abaixo.</div>}>
    <color attach="background" args={['#111112']}/>
    <hemisphereLight args={['#ffe4bf','#2c2423',2.2]}/><directionalLight position={[2,5,5]} intensity={3} color="#ffd2a4"/>
    <Suspense fallback={null}><Environment resolution={32}><Lightformer intensity={3} color="#fff0da" position={[0,5,3]} scale={[6,3,1]} rotation={[-.7,0,0]}/></Environment></Suspense>
    <InteriorCamera reduced={reduced}/><TrunkInterior/>
    <SelectableObject id="book" active={active} onSelect={onSelect} position={[-1.65,.03,.55]}><BookObject/></SelectableObject>
    <SelectableObject id="records" active={active} onSelect={onSelect} position={[.1,.03,.55]}><RecordsObject/></SelectableObject>
    <SelectableObject id="guitar" active={active} onSelect={onSelect} position={[1.8,.32,.65]}>
      <group rotation={[-Math.PI/2,0,-.12]} scale={.55}><Guitar/></group>
    </SelectableObject>
  </Canvas>;
}
