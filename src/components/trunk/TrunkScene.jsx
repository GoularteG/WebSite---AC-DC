import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox, useCursor } from '@react-three/drei';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import GuitarModel from './GuitarModel';
import { InteriorCamera } from './TrunkCamera';
import { SelectableObject } from './ObjectSelection';

function useSurface(kind) {
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
    const ctx=canvas.getContext('2d');
    if(kind==='carpet'){
      ctx.fillStyle='#252629';ctx.fillRect(0,0,512,512);
      for(let i=0;i<22000;i++){
        const x=(i*97)%512,y=(i*173+Math.floor(i/512)*31)%512;
        ctx.fillStyle=i%5===0?'#4b4c50':i%2?'#303136':'#17181b';
        ctx.fillRect(x,y,i%7===0?2:1,i%3===0?4:2);
      }
    }else if(kind==='rubber'){
      ctx.fillStyle='#111214';ctx.fillRect(0,0,512,512);
      ctx.strokeStyle='#292b2e';ctx.lineWidth=18;
      for(let x=-512;x<1024;x+=46){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-180,512);ctx.stroke();}
    }else{
      const data={
        archive:{bg:'#ded8c9',ink:'#29231e',accent:'#9b251f',top:'HIGHWAY ARCHIVES',main:['THE MAKING','OF'],foot:'DEVELOPMENT FILE · 1973—2026'},
        black:{bg:'#08090a',ink:'#aeb0b2',accent:'#771b20',top:'ACϟDC',main:['BACK','IN BLACK'],foot:'1980 · ARCHIVE EDITION'},
        hell:{bg:'#161011',ink:'#e2cab1',accent:'#a72e20',top:'ACϟDC',main:['HIGHWAY','TO HELL'],foot:'1979 · ARCHIVE EDITION'},
        razor:{bg:'#bcc2c5',ink:'#34404a',accent:'#8e1f23',top:'ACϟDC',main:['THE RAZORS','EDGE'],foot:'1990 · ARCHIVE EDITION'},
      }[kind];
      ctx.fillStyle=data.bg;ctx.fillRect(0,0,512,512);
      ctx.strokeStyle=data.accent;ctx.lineWidth=10;ctx.strokeRect(18,18,476,476);
      if(kind==='razor'){
        const gradient=ctx.createLinearGradient(0,0,512,512);gradient.addColorStop(0,'#edf1f2');gradient.addColorStop(.5,'#667785');gradient.addColorStop(1,'#dce1e2');
        ctx.fillStyle=gradient;ctx.fillRect(35,140,442,190);ctx.strokeStyle='#912027';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(35,330);ctx.lineTo(477,140);ctx.stroke();
      }
      ctx.textAlign='center';ctx.fillStyle=data.accent;ctx.font='700 50px Georgia';ctx.fillText(data.top,256,100);
      ctx.fillStyle=data.ink;ctx.font='700 58px Georgia';data.main.forEach((line,i)=>ctx.fillText(line,256,225+i*70));
      ctx.font='18px Arial';ctx.fillText(data.foot,256,453);
    }
    const result=new CanvasTexture(canvas);result.colorSpace=SRGBColorSpace;
    if(kind==='carpet'||kind==='rubber'){result.wrapS=result.wrapT=RepeatWrapping;result.repeat.set(kind==='carpet'?6:3,kind==='carpet'?4:2);}
    return result;
  },[kind]);
  useEffect(()=>()=>texture.dispose(),[texture]);return texture;
}

const paint={color:'#07080a',metalness:.78,roughness:.18,clearcoat:1,clearcoatRoughness:.12};
function CarPanel({position,args,rotation,radius=.08}) {
  return <RoundedBox position={position} rotation={rotation} args={args} radius={radius} smoothness={4} castShadow receiveShadow>
    <meshPhysicalMaterial {...paint}/>
  </RoundedBox>;
}
function MetalBar({position,args,rotation,color='#777b80'}) {
  return <RoundedBox position={position} rotation={rotation} args={args} radius={.035} smoothness={3} castShadow>
    <meshStandardMaterial color={color} metalness={.9} roughness={.22}/>
  </RoundedBox>;
}
function SpareTire() {
  const rubber=useSurface('rubber');
  return <group position={[0,.83,-1.64]} rotation={[0,0,.04]}>
    <mesh castShadow receiveShadow><torusGeometry args={[.7,.25,22,72]}/><meshStandardMaterial map={rubber} color="#242528" roughness={.92}/></mesh>
    {[.54,.6,.66,.72,.78,.84].map((r,i)=><mesh key={r} position={[0,0,.02+i*.004]}><torusGeometry args={[r,.014,8,72]}/><meshStandardMaterial color="#090a0b" roughness={1}/></mesh>)}
    <mesh position={[0,0,.08]} rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.39,.39,.17,32]}/><meshStandardMaterial color="#777c82" metalness={.88} roughness={.23}/></mesh>
    <mesh position={[0,0,.18]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.13,.18,.11,20]}/><meshStandardMaterial color="#b4b0a6" metalness={.9} roughness={.18}/></mesh>
    {Array.from({length:5},(_,i)=>{const a=i*Math.PI*.4;return <mesh key={i} position={[Math.cos(a)*.26,Math.sin(a)*.26,.18]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.045,.045,.1,10]}/><meshStandardMaterial color="#2d3034" metalness={.8}/></mesh>;})}
  </group>;
}
function LidArchive({active,onSelect}) {
  const [hover,setHover]=useState(false);useCursor(hover);
  const label=useSurface('archive');
  return <group position={[0,.98,.18]} onPointerOver={e=>{e.stopPropagation();setHover(true);}} onPointerOut={()=>setHover(false)} onClick={e=>{e.stopPropagation();onSelect('book');}}>
    <mesh castShadow><boxGeometry args={[1.25,.76,.035]}/><meshStandardMaterial map={label} roughness={.72}/></mesh>
    {(hover||active==='book')&&<mesh position={[0,0,-.025]}><planeGeometry args={[1.38,.89]}/><meshBasicMaterial color="#f0a047" transparent opacity={.75}/></mesh>}
  </group>;
}
function TrunkInterior({active,onSelect}) {
  const carpet=useSurface('carpet');
  return <group>
    <RoundedBox args={[7,.2,4.45]} position={[0,-.12,.1]} radius={.16} smoothness={4} receiveShadow><meshStandardMaterial map={carpet} color="#77787c" roughness={1}/></RoundedBox>
    <CarPanel position={[0,.54,-2.12]} args={[7.15,1.25,.25]}/>
    <CarPanel position={[-3.38,.35,.08]} args={[.42,.95,4.25]} radius={.18}/><CarPanel position={[3.38,.35,.08]} args={[.42,.95,4.25]} radius={.18}/>
    {[-1,1].map(side=><group key={side}>
      <RoundedBox position={[side*2.83,.25,-.55]} args={[.92,.75,2.45]} radius={.38} smoothness={6} castShadow receiveShadow><meshStandardMaterial map={carpet} color="#505155" roughness={1}/></RoundedBox>
      <MetalBar position={[side*3.5,.45,.1]} args={[.07,.08,4.35]} color="#111317"/>
      <MetalBar position={[side*3.32,.8,-1.55]} rotation={[0,0,side*.22]} args={[.08,1.5,.1]}/>
      <MetalBar position={[side*2.93,1.72,-1.87]} rotation={[0,0,side*.15]} args={[.09,1.1,.12]}/>
    </group>)}
    <CarPanel position={[0,.03,2.28]} args={[7.18,.42,.35]} radius={.1}/>
    <MetalBar position={[0,.27,2.12]} args={[6.75,.09,.12]} color="#17191c"/>
    <MetalBar position={[0,.2,2.25]} args={[6.82,.055,.08]} color="#8a8f94"/>
    <group position={[0,1.58,-2.08]} rotation={[-.12,0,0]}>
      <CarPanel position={[0,1.03,0]} args={[7.16,2.35,.2]} radius={.18}/>
      {[-2.75,-1.38,0,1.38,2.75].map((x,i)=><group key={x} position={[x,1.05,.12]}>
        <RoundedBox args={[1.12,1.82,.075]} radius={.18} smoothness={5}><meshPhysicalMaterial color={i===2?'#0d0f12':'#090a0c'} metalness={.72} roughness={.24} clearcoat={.8}/></RoundedBox>
        <MetalBar position={[0,0,.07]} args={[.055,1.42,.04]} color="#303337"/>
      </group>)}
      <MetalBar position={[0,.02,.12]} args={[6.78,.12,.09]} color="#111317"/>
      <MetalBar position={[0,2.07,.12]} args={[6.72,.1,.08]} color="#25282b"/>
      <LidArchive active={active} onSelect={onSelect}/>
    </group>
    <SpareTire/>
    <group position={[0,-.12,2.53]}>
      <RoundedBox args={[7.05,.28,.18]} radius={.08} smoothness={3}><meshPhysicalMaterial {...paint}/></RoundedBox>
      {[-1,1].map(side=><mesh key={side} position={[side*2.15,.12,.1]}><boxGeometry args={[1.65,.18,.08]}/><meshPhysicalMaterial color="#5b080b" emissive="#400206" emissiveIntensity={.45} roughness={.25}/></mesh>)}
      <mesh position={[0,.12,.11]}><boxGeometry args={[1.35,.2,.08]}/><meshStandardMaterial color="#9a9b98" metalness={.8} roughness={.25}/></mesh>
    </group>
  </group>;
}
function AlbumCase({kind,position,rotation}) {
  const cover=useSurface(kind);
  return <group position={position} rotation={rotation}>
    <RoundedBox args={[1.18,.09,1.18]} radius={.025} smoothness={3} castShadow><meshPhysicalMaterial color="#d9dde0" transparent opacity={.38} roughness={.12} transmission={.05}/></RoundedBox>
    <mesh position={[0,.052,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[1.08,1.08]}/><meshStandardMaterial map={cover} roughness={.38}/></mesh>
    <MetalBar position={[-.54,.07,0]} args={[.035,.06,1.05]} color="#afb4b8"/>
  </group>;
}
function AlbumsObject() {
  return <group>
    <AlbumCase kind="black" position={[-.34,.03,.08]} rotation={[0,-.08,0]}/>
    <AlbumCase kind="hell" position={[.05,.095,-.04]} rotation={[0,.09,0]}/>
    <AlbumCase kind="razor" position={[.45,.16,-.12]} rotation={[0,.22,0]}/>
  </group>;
}
export default function TrunkScene({reduced,onSelect,active,paused}) {
  return <Canvas shadows frameloop={paused?'never':'demand'} dpr={[1,1.35]} camera={{position:[0,6.8,9.5],fov:42,near:.1,far:60}} gl={{antialias:true,powerPreference:'high-performance'}} aria-hidden="true" fallback={<div className="trunk-webgl-fallback">Explore os objetos pelos botões abaixo.</div>}>
    <color attach="background" args={['#090a0c']}/><fog attach="fog" args={['#090a0c',13,23]}/>
    <hemisphereLight args={['#e7eef7','#16100d',1.35]}/>
    <directionalLight castShadow position={[-3,7,6]} intensity={3.2} color="#fff1df" shadow-mapSize={[1024,1024]} shadow-bias={-.0004}/>
    <directionalLight position={[5,2,-3]} intensity={1.5} color="#7c9abe"/>
    <pointLight position={[0,2.8,2.7]} intensity={12} distance={9} color="#e7a36e" decay={2}/>
    <Suspense fallback={null}><Environment resolution={64}><Lightformer intensity={3.5} color="#fff4e5" position={[-2,5,4]} scale={[7,2,1]} rotation={[-.7,0,0]}/><Lightformer intensity={1.5} color="#8da0b5" position={[5,1,-4]} scale={[3,5,1]} rotation={[0,Math.PI,0]}/></Environment></Suspense>
    <InteriorCamera reduced={reduced}/><TrunkInterior active={active} onSelect={onSelect}/>
    <SelectableObject id="records" active={active} onSelect={onSelect} position={[2.05,.08,.93]} highlight={[1.05,1.09]}><AlbumsObject/></SelectableObject>
    <SelectableObject id="guitar" active={active} onSelect={onSelect} position={[-.35,.22,.35]} highlight={[1.15,1.19]}>
      <group rotation={[-Math.PI/2,0,1.03]}><Suspense fallback={null}><GuitarModel height={4.45} finish="cherry"/></Suspense></group>
    </SelectableObject>
    <ContactShadows position={[0,.01,.1]} opacity={.55} scale={7.2} blur={2.5} far={4}/>
  </Canvas>;
}
