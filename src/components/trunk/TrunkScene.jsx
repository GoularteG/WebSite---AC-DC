import SceneReady from '../loading/SceneReady';
import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { CanvasTexture, CatmullRomCurve3, DoubleSide, RepeatWrapping, Shape, SRGBColorSpace, Vector3 } from 'three';
import BookModel from './BookModel';
import GuitarModel from './GuitarModel';
import { InteriorCamera } from './TrunkCamera';
import { SelectableObject } from './ObjectSelection';

function useSurface(kind) {
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
    const ctx=canvas.getContext('2d');
    const logo=(y,size,fill='#d22126',stroke='#e8ddd0')=>{
      ctx.save();ctx.textAlign='center';ctx.font=`italic 900 ${size}px Arial Black`;ctx.lineWidth=5;ctx.strokeStyle=stroke;ctx.fillStyle=fill;
      ctx.strokeText('AC/DC',256,y);ctx.fillText('AC/DC',256,y);ctx.restore();
    };
    if(kind==='carpet'){
      ctx.fillStyle='#303136';ctx.fillRect(0,0,512,512);
      for(let i=0;i<22000;i++){
        const x=(i*97)%512,y=(i*173+Math.floor(i/512)*31)%512;
        ctx.fillStyle=i%5===0?'#55575a':i%2?'#404247':'#25262a';
        ctx.fillRect(x,y,i%7===0?2:1,i%3===0?4:2);
      }
      for(let i=0;i<28;i++){
        ctx.strokeStyle=i%3?'#191b2080':'#69686455';ctx.lineWidth=i%4===0?2:1;
        const x=(i*83)%512,y=(i*137)%512;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+18+(i%5)*8,y+5);ctx.stroke();
      }
    }else if(kind==='rubber'){
      ctx.fillStyle='#111214';ctx.fillRect(0,0,512,512);
      ctx.strokeStyle='#292b2e';ctx.lineWidth=18;
      for(let x=-512;x<1024;x+=46){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-180,512);ctx.stroke();}
    }else if(kind==='black'){
      const glow=ctx.createRadialGradient(256,220,20,256,256,340);glow.addColorStop(0,'#222326');glow.addColorStop(1,'#020203');
      ctx.fillStyle=glow;ctx.fillRect(0,0,512,512);
      ctx.strokeStyle='#35363a';ctx.lineWidth=12;ctx.strokeRect(20,20,472,472);
      logo(238,100,'#161719','#56585b');
      ctx.textAlign='center';ctx.fillStyle='#c5c6c8';ctx.font='700 42px Georgia';ctx.fillText('BACK IN BLACK',256,330);
      ctx.fillStyle='#6f7074';ctx.font='18px Arial';ctx.fillText('1980',256,385);
    }else if(kind==='hell'){
      const fire=ctx.createLinearGradient(0,0,0,512);fire.addColorStop(0,'#171315');fire.addColorStop(.48,'#5e1717');fire.addColorStop(1,'#db6a27');
      ctx.fillStyle=fire;ctx.fillRect(0,0,512,512);
      ctx.strokeStyle='#e2c39b';ctx.lineWidth=8;ctx.strokeRect(18,18,476,476);
      logo(120,82);
      [-120,-60,0,60,120].forEach((x,i)=>{ctx.fillStyle=i===2?'#d7b080':'#171315';ctx.beginPath();ctx.arc(256+x,238+(i%2)*10,32,0,Math.PI*2);ctx.fill();ctx.fillRect(230+x,270+(i%2)*10,52,85);});
      ctx.fillStyle='#f2d3ad';ctx.textAlign='center';ctx.font='700 42px Georgia';ctx.fillText('HIGHWAY TO HELL',256,425);
      ctx.font='17px Arial';ctx.fillText('1979',256,462);
    }else if(kind==='razor'){
      const steel=ctx.createLinearGradient(0,0,512,512);steel.addColorStop(0,'#e6eaec');steel.addColorStop(.32,'#617080');steel.addColorStop(.64,'#d9dfe1');steel.addColorStop(1,'#778590');
      ctx.fillStyle=steel;ctx.fillRect(0,0,512,512);
      ctx.strokeStyle='#922126';ctx.lineWidth=9;ctx.strokeRect(18,18,476,476);
      logo(115,78,'#a91f25','#ebe6dc');
      ctx.fillStyle='#dfe5e7';ctx.strokeStyle='#334351';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(66,230);ctx.lineTo(446,165);ctx.lineTo(424,325);ctx.lineTo(86,370);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#8d1f24';ctx.textAlign='center';ctx.font='700 45px Georgia';ctx.fillText('THE RAZORS EDGE',256,430);
      ctx.fillStyle='#394650';ctx.font='17px Arial';ctx.fillText('1990',256,465);
    }else if(kind==='archive'){
      ctx.fillStyle='#dfd0b0';ctx.fillRect(0,0,512,512);
      ctx.fillStyle='#c8b894';ctx.fillRect(24,24,464,464);
      ctx.fillStyle='#e7d8b9';ctx.fillRect(35,35,442,442);
      ctx.strokeStyle='#7c251d';ctx.lineWidth=9;ctx.strokeRect(35,35,442,442);
      ctx.strokeStyle='#aa8250';ctx.lineWidth=3;ctx.strokeRect(51,51,410,410);
      ctx.textAlign='center';ctx.fillStyle='#9b1f1b';ctx.font='italic 900 70px Arial Black';ctx.fillText('AC/DC',256,126);
      ctx.fillStyle='#4c241d';ctx.font='20px Georgia';ctx.fillText('THE HIGHWAY ARCHIVES',256,173);
      ctx.fillStyle='#291d19';ctx.font='bold 62px Georgia';ctx.fillText('THE MAKING',256,280);ctx.fillText('OF',256,355);
      ctx.fillStyle='#9b1f1b';ctx.font='17px Georgia';ctx.fillText('BASTIDORES DE UMA VIAGEM  •  VOL. 01',256,427);
    }else{
      const data={
        ticket:{bg:'#ba9a68',ink:'#241b13',accent:'#8b1e1f',top:'ACϟDC',main:['WORLD TOUR','ADMIT ONE'],foot:'GENERAL ADMISSION · 1980'},
        setlist:{bg:'#d7d0bd',ink:'#25211d',accent:'#8b1e1f',top:'TONIGHT',main:['HIGHWAY','HELLS BELLS'],foot:'SET LIST · STAGE LEFT'},
        poster:{bg:'#242326',ink:'#d5c5ae',accent:'#9b201d',top:'LIVE',main:['HIGH','VOLTAGE'],foot:'ROCK & ROLL · ALL NIGHT'},
        pass:{bg:'#c9bd9e',ink:'#191919',accent:'#a1251c',top:'BACKSTAGE',main:['ALL ACCESS','CREW'],foot:'LOAD IN · AFTER SHOW'},
        flyer:{bg:'#d0b796',ink:'#322019',accent:'#9a3320',top:'TONIGHT ONLY',main:['LET THERE','BE ROCK'],foot:'DOORS 7 PM · ADMIT ONE'},
      }[kind];
      ctx.fillStyle=data.bg;ctx.fillRect(0,0,512,512);
      ctx.strokeStyle=data.accent;ctx.lineWidth=10;ctx.strokeRect(18,18,476,476);
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

const paint={color:'#141517',metalness:.72,roughness:.27,clearcoat:.85,clearcoatRoughness:.2};
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
function LidArchive() {
  const label=useSurface('archive');
  const patch=useSurface('poster');
  const pass=useSurface('pass');
  return <group position={[0,.98,.18]}>
    <mesh castShadow><boxGeometry args={[.84,.5,.025]}/><meshStandardMaterial map={label} color="#746e65" roughness={.82}/></mesh>
    <mesh position={[-2.15,-.08,.015]} rotation={[0,0,-.09]} castShadow><boxGeometry args={[.5,.68,.024]}/><meshStandardMaterial map={patch} roughness={.74}/></mesh>
    <mesh position={[2.19,-.04,.015]} rotation={[0,0,.07]} castShadow><boxGeometry args={[.47,.63,.024]}/><meshStandardMaterial map={pass} roughness={.8}/></mesh>
  </group>;
}
function TrunkInterior() {
  const carpet=useSurface('carpet');
  return <group>
    <RoundedBox args={[7,.2,4.45]} position={[0,-.12,.1]} radius={.16} smoothness={4} receiveShadow><meshStandardMaterial map={carpet} color="#858487" roughness={1}/></RoundedBox>
    <CarPanel position={[0,.54,-2.12]} args={[7.15,1.25,.25]}/>
    <CarPanel position={[-3.38,.35,.08]} args={[.42,.95,4.25]} radius={.18}/><CarPanel position={[3.38,.35,.08]} args={[.42,.95,4.25]} radius={.18}/>
    {[-1,1].map(side=><group key={side}>
      <RoundedBox position={[side*2.83,.25,-.55]} args={[.92,.75,2.45]} radius={.38} smoothness={6} castShadow receiveShadow><meshStandardMaterial map={carpet} color="#78787c" roughness={1}/></RoundedBox>
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
        <RoundedBox args={[1.12,1.82,.075]} radius={.18} smoothness={5}><meshPhysicalMaterial color={i===2?'#17191c':'#121416'} metalness={.72} roughness={.28} clearcoat={.8}/></RoundedBox>
        <MetalBar position={[0,0,.07]} args={[.055,1.42,.04]} color="#303337"/>
      </group>)}
      <MetalBar position={[0,.02,.12]} args={[6.78,.12,.09]} color="#111317"/>
      <MetalBar position={[0,2.07,.12]} args={[6.72,.1,.08]} color="#25282b"/>
      <LidArchive/>
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
    <AlbumCase kind="black" position={[-.64,.03,-.35]} rotation={[0,-.08,0]}/>
    <AlbumCase kind="hell" position={[.52,.03,-.35]} rotation={[0,.08,0]}/>
    <AlbumCase kind="razor" position={[.03,.12,.62]} rotation={[0,-.06,0]}/>
  </group>;
}
function PaperCard({kind,position,rotation=[0,0,0],size=[.72,1.05]}) {
  const texture=useSurface(kind);
  return <group position={position} rotation={rotation}>
    <mesh castShadow><boxGeometry args={[size[0],.025,size[1]]}/><meshStandardMaterial color="#a89d88" roughness={.9}/></mesh>
    <mesh position={[0,.014,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[size[0]*.96,size[1]*.96]}/><meshStandardMaterial map={texture} roughness={.82}/></mesh>
    <mesh position={[0,.02,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.012,size[1]*.94]}/><meshBasicMaterial color="#766c5c" transparent opacity={.45}/></mesh>
  </group>;
}
function Picks() {
  const pick=useMemo(()=>{
    const shape=new Shape();
    shape.moveTo(0,-.2);
    shape.bezierCurveTo(-.12,-.1,-.18,.13,-.11,.18);
    shape.bezierCurveTo(-.04,.23,.04,.23,.11,.18);
    shape.bezierCurveTo(.18,.13,.12,-.1,0,-.2);
    return shape;
  },[]);
  return <group>
    {[
      [-.24,.03,-.09,'#9e2924'],[.05,.035,.05,'#d7b05c'],[.28,.03,-.1,'#252428'],
    ].map(([x,y,z,color],i)=><mesh key={i} position={[x,y,z]} rotation={[-Math.PI/2,0,i*.45]} scale={.55} castShadow>
      <shapeGeometry args={[pick,12]}/><meshPhysicalMaterial color={color} roughness={.35} clearcoat={.65} side={DoubleSide}/>
    </mesh>)}
  </group>;
}
function Memorabilia() {
  return <group>
    <PaperCard kind="poster" position={[-1.93,.037,-1.05]} rotation={[0,-.18,0]} size={[.9,1.25]}/>
    <PaperCard kind="setlist" position={[-1.05,.065,-1.15]} rotation={[0,.12,0]} size={[.7,1.03]}/>
    <PaperCard kind="pass" position={[1.18,.055,-.58]} rotation={[0,-.12,0]} size={[.66,.96]}/>
    <PaperCard kind="ticket" position={[1.61,.08,-.42]} rotation={[0,.18,0]} size={[.45,.73]}/>
    <PaperCard kind="flyer" position={[2.22,.045,-.55]} rotation={[0,.14,0]} size={[.72,.95]}/>
    <group position={[.76,.025,2.02]}><Picks/></group>
  </group>;
}
function RoadGear() {
  const cable=useMemo(()=>new CatmullRomCurve3(Array.from({length:78},(_,i)=>{
    const t=i/77,a=t*Math.PI*7,r=.28-t*.045;
    return new Vector3(-1.99+Math.cos(a)*r,.075+t*.008,-1.28+Math.sin(a)*r);
  })),[]);
  return <group name="road-gear">
    <mesh castShadow><tubeGeometry args={[cable,100,.028,7,false]}/><meshStandardMaterial color="#151618" roughness={.78}/></mesh>
    <group position={[2.02,.145,-1.46]} rotation={[0,.14,0]}>
      <RoundedBox args={[.78,.22,.48]} radius={.045} smoothness={4} castShadow><meshPhysicalMaterial color="#202227" metalness={.55} roughness={.38}/></RoundedBox>
      <mesh position={[0,.119,.035]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.6,.25]}/><meshBasicMaterial color="#81241e"/></mesh>
      <mesh position={[0,.121,-.15]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.61,.015]}/><meshBasicMaterial color="#e49a52"/></mesh>
      {[-.24,0,.24].map(x=><mesh key={x} position={[x,.16,-.14]} castShadow><cylinderGeometry args={[.045,.052,.09,12]}/><meshStandardMaterial color="#b9b6ad" metalness={.85} roughness={.25}/></mesh>)}
      <mesh position={[0,.17,.13]} castShadow><cylinderGeometry args={[.095,.095,.06,24]}/><meshStandardMaterial color="#bfc0ba" metalness={.78} roughness={.28}/></mesh>
    </group>
  </group>;
}
function ProjectBook() {
  const label=useSurface('archive');
  return <group rotation={[0,-.08,0]}>
    <BookModel length={2.5}/>
    <mesh position={[0,.405,0]} rotation={[-Math.PI/2,0,0]} castShadow>
      <planeGeometry args={[1.13,1.47]}/><meshStandardMaterial map={label} roughness={.48}/>
    </mesh>
    <mesh position={[-.62,.22,0]}><boxGeometry args={[.045,.2,2.43]}/><meshPhysicalMaterial color="#5b1714" roughness={.42} clearcoat={.4}/></mesh>
  </group>;
}
export default function TrunkScene({reduced,onSelect,active,paused,onReady}) {
  return <Canvas shadows frameloop={paused?'never':'demand'} dpr={[1,1.35]} camera={{position:[0,6.8,9.5],fov:42,near:.1,far:60}} gl={{antialias:true,powerPreference:'high-performance'}} aria-hidden="true" fallback={<div className="trunk-webgl-fallback">Explore os objetos pelos botões abaixo.</div>}>
    <Suspense fallback={null}>
    <color attach="background" args={['#090a0c']}/><fog attach="fog" args={['#090a0c',13,23]}/>
    <hemisphereLight args={['#e2e8ef','#171316',1.3]}/>
    <directionalLight castShadow position={[-3,7,6]} intensity={2.6} color="#fff1df" shadow-mapSize={[1024,1024]} shadow-bias={-.0004}/>
    <directionalLight position={[5,3,-2]} intensity={1.25} color="#a5b4c2"/>
    <pointLight position={[0,2.8,2.7]} intensity={4} distance={9} color="#e7a36e" decay={2}/>
    <spotLight castShadow position={[0,5,3]} intensity={17} distance={10} angle={.53} penumbra={.85} color="#ffd6a7" shadow-mapSize={[512,512]}/>
    <Environment resolution={64}><Lightformer intensity={3.5} color="#fff4e5" position={[-2,5,4]} scale={[7,2,1]} rotation={[-.7,0,0]}/><Lightformer intensity={1.5} color="#8da0b5" position={[5,1,-4]} scale={[3,5,1]} rotation={[0,Math.PI,0]}/></Environment>
    <InteriorCamera reduced={reduced}/><TrunkInterior/>
    <group position={[2.08,.02,.85]} scale={.74}><AlbumsObject/></group>
    <group position={[-1.48,.18,.11]} rotation={[-Math.PI/2,0,-.2]}><GuitarModel height={3.5} finish="cherry"/></group>
    <Memorabilia/><RoadGear/>
    <SelectableObject id="book" active={active} onSelect={onSelect} position={[.1,.045,.62]} highlight={[1.28,1.31]}><ProjectBook/></SelectableObject>
    <ContactShadows position={[0,.01,.1]} opacity={.45} scale={7.2} blur={2.5} far={4}/>
    <SceneReady onReady={onReady}/>
    </Suspense>
  </Canvas>;
}
