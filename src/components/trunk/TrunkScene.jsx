import { SceneLoading, ScenePending } from '../loading/SceneLoading';
import SceneReady from '../loading/SceneReady';
import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { AdditiveBlending, CanvasTexture, CatmullRomCurve3, DoubleSide, RepeatWrapping, Shape, SRGBColorSpace, Vector3 } from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import BookModel from './BookModel';

RectAreaLightUniformsLib.init();
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
function TrunkInterior() {
  const carpet=useSurface('carpet');
  const taillightGlow=useMemo(()=>{
    const w=256,h=64,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d'),img=ctx.createImageData(w,h),d=img.data;
    const bw=.78,bh=.36;
    for(let py=0;py<h;py++){
      const v=(py/(h-1))*2-1,dy=Math.max(0,Math.abs(v)-bh)/(1-bh);
      for(let px=0;px<w;px++){
        const u=(px/(w-1))*2-1,dx=Math.max(0,Math.abs(u)-bw)/(1-bw);
        const halo=Math.exp(-(dx*dx+dy*dy)*2.8);
        const core=Math.max(0,1-Math.max(0,Math.abs(u)-(bw-.04))/.14)*Math.max(0,1-Math.max(0,Math.abs(v)-(bh-.06))/.22);
        const c=Math.min(1,halo*.75+core),i=(py*w+px)*4;
        d[i]=255;d[i+1]=Math.round(28*halo+105*core);d[i+2]=Math.round(10*halo+42*core);d[i+3]=Math.round(255*c*.96);
      }
    }
    ctx.putImageData(img,0,0);
    const tex=new CanvasTexture(canvas);tex.colorSpace=SRGBColorSpace;return tex;
  },[]);
  useEffect(()=>()=>taillightGlow.dispose(),[taillightGlow]);
  return <group>
    <RoundedBox args={[7,.2,4.45]} position={[0,-.12,.1]} radius={.16} smoothness={4} receiveShadow><meshStandardMaterial map={carpet} color="#858487" roughness={1}/></RoundedBox>
    <CarPanel position={[0,.54,-2.12]} args={[7.15,1.25,.25]}/>
    {/* Upper rear deck filler panel behind the trunk hinge */}
    <CarPanel position={[0,1.08,-2.24]} rotation={[.12,0,0]} args={[7.56,.28,.44]} radius={.09}/>
    {[-1,1].map(side=><group key={side}>
      {/* Sculpted 1970 Dodge Challenger rear quarter panels (inner wall kept at |x|=3.17 so trunk interior clearance is unchanged) */}
      <CarPanel position={[side*3.34,.34,.08]} args={[.34,.94,4.38]} radius={.1}/>
      <CarPanel position={[side*3.66,.31,.06]} args={[.48,.88,4.62]} radius={.2}/>
      <CarPanel position={[side*3.74,.04,.12]} args={[.36,.46,4.68]} radius={.14}/>
      <CarPanel position={[side*3.55,.74,.06]} rotation={[0,0,side*-.14]} args={[.52,.22,4.58]} radius={.09}/>
      <MetalBar position={[side*3.81,.56,.1]} args={[.045,.05,4.62]} color="#22252a"/>
      {/* Quarter panel rear end caps projecting past the recessed Challenger tail panel */}
      <CarPanel position={[side*3.56,.18,2.46]} args={[.44,.74,.38]} radius={.1}/>
      <MetalBar position={[side*3.38,.1,2.6]} args={[.055,.42,.07]} color="#b8bdc2"/>
      {/* Interior carpeted wheel arch housing */}
      <RoundedBox position={[side*2.83,.25,-.55]} args={[.92,.75,2.45]} radius={.38} smoothness={6} castShadow receiveShadow><meshStandardMaterial map={carpet} color="#78787c" roughness={1}/></RoundedBox>
      {/* Trunk rain gutter channel & rubber weatherstrip seal */}
      <MetalBar position={[side*3.22,.76,.1]} args={[.08,.07,4.28]} color="#101114"/>
      <MetalBar position={[side*3.5,.45,.1]} args={[.07,.08,4.35]} color="#111317"/>
      <MetalBar position={[side*3.32,.8,-1.55]} rotation={[0,0,side*.22]} args={[.08,1.5,.1]}/>
      <MetalBar position={[side*2.93,1.72,-1.87]} rotation={[0,0,side*.15]} args={[.09,1.1,.12]}/>
    </group>)}
    {/* Rear trunk sill, weatherstrip seal & central trunk latch striker */}
    <CarPanel position={[0,.03,2.28]} args={[7.18,.42,.35]} radius={.1}/>
    <MetalBar position={[0,.27,2.12]} args={[6.52,.09,.12]} color="#101114"/>
    <MetalBar position={[0,.2,2.25]} args={[6.82,.055,.08]} color="#8a8f94"/>
    <group position={[0,.24,2.18]}>
      <MetalBar position={[0,0,0]} args={[.36,.1,.12]} color="#9da2a8"/>
      <mesh position={[0,.02,0]}><boxGeometry args={[.14,.08,.08]}/><meshStandardMaterial color="#0e1013" roughness={.8}/></mesh>
      <MetalBar position={[0,.045,-.02]} args={[.05,.08,.07]} color="#cfd3d7"/>
    </group>
    <group position={[0,1.58,-2.08]} rotation={[-.12,0,0]}>
      <CarPanel position={[0,1.03,0]} args={[7.16,2.35,.2]} radius={.18}/>
      {[-2.75,-1.38,0,1.38,2.75].map((x,i)=><group key={x} position={[x,1.05,.12]}>
        <RoundedBox args={[1.12,1.82,.075]} radius={.18} smoothness={5}><meshPhysicalMaterial color={i===2?'#17191c':'#121416'} metalness={.72} roughness={.28} clearcoat={.8}/></RoundedBox>
        <MetalBar position={[0,0,.07]} args={[.055,1.42,.04]} color="#303337"/>
      </group>)}
      <MetalBar position={[0,.02,.12]} args={[6.78,.12,.09]} color="#111317"/>
      <MetalBar position={[0,2.07,.12]} args={[6.72,.1,.08]} color="#25282b"/>
    </group>
    <SpareTire/>
    {/* 1970 Dodge Challenger Recessed Full-Width Tail Lamp Panel */}
    <group position={[0,-.12,2.52]}>
      <CarPanel position={[0,.22,-.04]} args={[6.92,.44,.22]} radius={.08}/>
      <RoundedBox position={[0,.22,.03]} args={[6.68,.36,.1]} radius={.04} smoothness={3}><meshStandardMaterial color="#0b0c0f" metalness={.45} roughness={.55}/></RoundedBox>
      <MetalBar position={[0,.395,.07]} args={[6.72,.04,.06]} color="#c8cdd2"/>
      <MetalBar position={[0,.045,.07]} args={[6.72,.04,.06]} color="#c8cdd2"/>
      {[-1,1].map(side=><group key={side} position={[side*1.92,.22,.07]}>
        <mesh><boxGeometry args={[2.56,.23,.065]}/><meshBasicMaterial color="#ff2008" toneMapped={false}/></mesh>
        <mesh position={[0,.01,.005]}><boxGeometry args={[2.48,.195,.072]}/><meshBasicMaterial color="#ff5830" toneMapped={false}/></mesh>
        <mesh position={[0,.016,.01]}><boxGeometry args={[2.38,.12,.078]}/><meshBasicMaterial color="#ff855c" toneMapped={false}/></mesh>
        {/* Integrated backup / reverse lamp segment on the inner side of each Challenger taillight */}
        <mesh position={[-side*1.04,.01,.014]}><boxGeometry args={[.3,.125,.08]}/><meshBasicMaterial color="#ffe7cc" toneMapped={false}/></mesh>
        {/* Characteristic 1970 Challenger vertical taillight lens ribs */}
        {[-1.02,-.61,-.2,.2,.61,1.02].map(x=><mesh key={x} position={[x,0,.045]}><boxGeometry args={[.03,.235,.03]}/><meshStandardMaterial color="#181214" metalness={.75} roughness={.3}/></mesh>)}
        <mesh position={[0,.11,.085]} rotation={[-.95,0,0]} renderOrder={2}><planeGeometry args={[2.72,.46]}/><meshBasicMaterial map={taillightGlow} transparent opacity={.78} blending={AdditiveBlending} depthWrite={false} toneMapped={false}/></mesh>
        <mesh position={[0,.12,.095]} rotation={[-.95,0,0]} renderOrder={2}><planeGeometry args={[3.02,.62]}/><meshBasicMaterial map={taillightGlow} transparent opacity={.44} blending={AdditiveBlending} depthWrite={false} toneMapped={false}/></mesh>
        <mesh position={[0,.165,-.085]} rotation={[-Math.PI/2,0,0]} renderOrder={2}><planeGeometry args={[2.54,.2]}/><meshBasicMaterial map={taillightGlow} transparent opacity={.18} blending={AdditiveBlending} depthWrite={false} toneMapped={false}/></mesh>
        <rectAreaLight position={[0,.08,.12]} rotation={[.35,0,0]} width={2.45} height={.16} intensity={2.05} color="#ff1a0a"/>
      </group>)}
      {/* Challenger central brushed-metal DODGE divider panel between the taillights */}
      <group position={[0,.22,.075]}>
        <mesh><boxGeometry args={[1.22,.25,.075]}/><meshStandardMaterial color="#aeb3b8" metalness={.88} roughness={.22}/></mesh>
        <mesh position={[0,0,.006]}><boxGeometry args={[1.1,.15,.08]}/><meshStandardMaterial color="#16181c" metalness={.5} roughness={.45}/></mesh>
        <mesh position={[0,0,.012]}><boxGeometry args={[.92,.055,.084]}/><meshBasicMaterial color="#d92312" toneMapped={false}/></mesh>
      </group>
      {/* 1970 Dodge Challenger Full-Width Chrome Rear Bumper, Wrap-Around Ends & Vertical Bumper Guards */}
      <group position={[0,0,0]}>
        <MetalBar position={[0,-.01,.11]} args={[7.18,.07,.12]} color="#181a1e"/>
        <RoundedBox position={[0,.015,.19]} rotation={[.18,0,0]} args={[7.56,.085,.18]} radius={.03} smoothness={3} castShadow receiveShadow>
          <meshPhysicalMaterial color="#dce1e6" metalness={.95} roughness={.12} clearcoat={1} clearcoatRoughness={.08}/>
        </RoundedBox>
        <RoundedBox position={[0,-.055,.24]} args={[7.62,.19,.14]} radius={.045} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial color="#d4d9df" metalness={.95} roughness={.13} clearcoat={1} clearcoatRoughness={.1}/>
        </RoundedBox>
        <RoundedBox position={[0,-.13,.21]} rotation={[-.22,0,0]} args={[7.52,.08,.13]} radius={.025} smoothness={3}>
          <meshStandardMaterial color="#aeb4bc" metalness={.92} roughness={.18}/>
        </RoundedBox>
        {/* Wrap-around chrome bumper corner ends hugging the rear quarter panels */}
        {[-1,1].map(side=><RoundedBox key={`bumper-end-${side}`} position={[side*3.74,-.045,.04]} rotation={[0,side*.08,0]} args={[.18,.21,.48]} radius={.05} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial color="#d4d9df" metalness={.95} roughness={.13} clearcoat={1} clearcoatRoughness={.1}/>
        </RoundedBox>)}
        {/* Central bumper license-plate step recess */}
        <MetalBar position={[0,-.055,.26]} args={[1.18,.18,.08]} color="#bfc5cc"/>
        <mesh position={[0,-.055,.285]}><boxGeometry args={[.96,.13,.05]}/><meshStandardMaterial color="#121417" metalness={.4} roughness={.65}/></mesh>
        {/* Vertical chrome & rubber bumper guards (bumperettes) */}
        {[-1,1].map(side=><group key={`bumperette-${side}`} position={[side*.88,-.03,.29]}>
          <RoundedBox args={[.15,.28,.11]} radius={.035} smoothness={3} castShadow>
            <meshPhysicalMaterial color="#e0e5ea" metalness={.96} roughness={.11} clearcoat={1}/>
          </RoundedBox>
          <RoundedBox position={[0,0,.042]} args={[.085,.23,.04]} radius={.015} smoothness={2}>
            <meshStandardMaterial color="#141518" roughness={.85} metalness={.15}/>
          </RoundedBox>
        </group>)}
      </group>
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
    <AlbumCase kind="black" position={[-.72,.045,-.52]} rotation={[0,-.08,0]}/>
    <AlbumCase kind="hell" position={[.76,.045,.14]} rotation={[0,.09,0]}/>
    <AlbumCase kind="razor" position={[-.62,.045,.88]} rotation={[0,-.06,0]}/>
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
function CassetteTape({position,rotation=[0,0,0],scale=1.22}) {
  return <group position={position} rotation={rotation} scale={scale}>
    <RoundedBox position={[0,.024,0]} args={[.48,.048,.3]} radius={.014} smoothness={3} castShadow><meshStandardMaterial color="#1b1c20" roughness={.55} metalness={.2}/></RoundedBox>
    <mesh position={[0,.05,-.02]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.41,.18]}/><meshStandardMaterial color="#e49a52" roughness={.75}/></mesh>
    <mesh position={[0,.051,-.07]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.38,.045]}/><meshBasicMaterial color="#9b201d"/></mesh>
    <mesh position={[0,.052,-.02]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.24,.065]}/><meshStandardMaterial color="#121316" roughness={.4}/></mesh>
    {[-.085,.085].map(x=><mesh key={x} position={[x,.053,-.02]}><cylinderGeometry args={[.026,.026,.008,16]}/><meshStandardMaterial color="#e6dec8" roughness={.5}/></mesh>)}
  </group>;
}
function Drumsticks({position,rotation=[0,0,0]}) {
  const sticks=[
    {pos:[0,.038,0],rot:[0,.26,Math.PI/2]},
    {pos:[.02,.088,.02],rot:[.02,-.3,Math.PI/2]},
  ];
  return <group position={position} rotation={rotation}>
    {sticks.map((s,i)=><group key={i} position={s.pos} rotation={s.rot}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[.024,.035,1.16,16]}/><meshStandardMaterial color="#e8c285" roughness={.42}/></mesh>
      <mesh position={[0,-.35,0]} castShadow><cylinderGeometry args={[.037,.037,.36,16]}/><meshStandardMaterial color="#a81e1b" roughness={.55}/></mesh>
      {[-.18,-.51].map(y=><mesh key={y} position={[0,y,0]}><cylinderGeometry args={[.038,.038,.026,16]}/><meshBasicMaterial color="#f0e7d5"/></mesh>)}
      <mesh position={[0,.35,0]}><cylinderGeometry args={[.026,.028,.04,14]}/><meshBasicMaterial color="#1f1916"/></mesh>
      <mesh position={[0,.59,0]} scale={[1,1.45,1]} castShadow><sphereGeometry args={[.031,14,12]}/><meshStandardMaterial color="#f4d89e" roughness={.38}/></mesh>
    </group>)}
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
      [-.09,.03,-.06,'#9e2924'],[.04,.035,.04,'#d7b05c'],[.12,.03,-.05,'#252428'],
    ].map(([x,y,z,color],i)=><mesh key={i} position={[x,y,z]} rotation={[-Math.PI/2,0,i*.45]} scale={.55} castShadow>
      <shapeGeometry args={[pick,12]}/><meshPhysicalMaterial color={color} roughness={.35} clearcoat={.65} side={DoubleSide}/>
    </mesh>)}
  </group>;
}
function Memorabilia() {
  return <group>
    <PaperCard kind="setlist" position={[-2.02,.114,.44]} rotation={[0,.12,0]} size={[.56,.8]}/>
    <CassetteTape position={[-1.25,.103,.42]} rotation={[0,.24,0]}/>
    <Drumsticks position={[-1.28,.103,1.26]} rotation={[0,Math.PI/2+.08,0]}/>
    <PaperCard kind="ticket" position={[1.26,.114,-.02]} rotation={[0,.16,0]} size={[.42,.64]}/>
    <PaperCard kind="pass" position={[2.02,.114,.06]} rotation={[0,-.12,0]} size={[.5,.72]}/>
    <group position={[2.24,.105,1.72]}><Picks/></group>
  </group>;
}
function CablePlug({position,rotation=[0,0,0]}) {
  return <group position={position} rotation={rotation}>
    {/* Rubber strain relief boot wrapping directly around cable endpoint at x=0 */}
    <mesh position={[0,0,0]} rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.034,.042,.11,14]}/><meshStandardMaterial color="#18191c" roughness={.65}/></mesh>
    {/* Knurled chrome P10 barrel */}
    <mesh position={[.115,0,0]} rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.044,.044,.13,16]}/><meshStandardMaterial color="#c6cbd0" metalness={.9} roughness={.2}/></mesh>
    {/* Red collar ring */}
    <mesh position={[.06,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.045,.045,.022,16]}/><meshBasicMaterial color="#a81e1b"/></mesh>
    {/* P10 1/4" jack shaft & tip */}
    <mesh position={[.235,0,0]} rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.018,.018,.12,12]}/><meshStandardMaterial color="#e2c675" metalness={.92} roughness={.16}/></mesh>
    <mesh position={[.27,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.019,.019,.018,12]}/><meshBasicMaterial color="#151618"/></mesh>
    <mesh position={[.305,0,0]} scale={[1.3,1,1]} castShadow><sphereGeometry args={[.02,12,10]}/><meshStandardMaterial color="#e2c675" metalness={.92} roughness={.16}/></mesh>
  </group>;
}
function CoiledCable({center,radius=.29,turns=5.5,tubeRadius=.031,color='#262930',rotOffset=0}) {
  const {curve,startPlug,endPlug}=useMemo(()=>{
    const pts=[],total=76;
    const a0=rotOffset,r0=radius;
    const p0=new Vector3(center[0]+Math.cos(a0)*r0,center[1],center[2]+Math.sin(a0)*r0);
    const tx0=Math.sin(a0),tz0=-Math.cos(a0);
    const startPos=new Vector3(p0.x+tx0*.2,center[1],p0.z+tz0*.2);
    const startMid=new Vector3(p0.x+tx0*.1,center[1],p0.z+tz0*.1);
    pts.push(startPos,startMid);
    for(let i=0;i<=total;i++){
      const t=i/total,a=rotOffset+t*Math.PI*2*turns,r=radius-t*.045;
      pts.push(new Vector3(center[0]+Math.cos(a)*r,center[1]+t*.012,center[2]+Math.sin(a)*r));
    }
    const a1=rotOffset+Math.PI*2*turns;
    const p1=pts[pts.length-1];
    const tx1=-Math.sin(a1),tz1=Math.cos(a1);
    const endMid=new Vector3(p1.x+tx1*.1,p1.y,p1.z+tz1*.1);
    const endPos=new Vector3(p1.x+tx1*.2,p1.y,p1.z+tz1*.2);
    pts.push(endMid,endPos);
    return {
      curve:new CatmullRomCurve3(pts),
      startPlug:{pos:[startPos.x,startPos.y,startPos.z],rot:[0,Math.atan2(-tz0,tx0),0]},
      endPlug:{pos:[endPos.x,endPos.y,endPos.z],rot:[0,Math.atan2(-tz1,tx1),0]},
    };
  },[center,radius,turns,rotOffset]);
  return <group>
    <mesh castShadow receiveShadow><tubeGeometry args={[curve,110,tubeRadius,8,false]}/><meshStandardMaterial color={color} roughness={.48} metalness={.16}/></mesh>
    <CablePlug position={startPlug.pos} rotation={startPlug.rot}/>
    <CablePlug position={endPlug.pos} rotation={endPlug.rot}/>
  </group>;
}
function RoadGear() {
  return <group name="road-gear">
    <CoiledCable center={[-2.24,.146,1.38]} radius={.26} turns={5.5} tubeRadius={.032} color="#282b32" rotOffset={1.1}/>
    <group position={[1.82,.215,-1.46]} rotation={[0,.14,0]}>
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
  return <group rotation={[0,-.06,0]} scale={.78}>
    <BookModel length={2.5}/>
    <mesh position={[0,.405,0]} rotation={[-Math.PI/2,0,0]} castShadow>
      <planeGeometry args={[1.13,1.47]}/><meshStandardMaterial map={label} roughness={.48}/>
    </mesh>
    <mesh position={[-.62,.22,0]}><boxGeometry args={[.045,.2,2.43]}/><meshPhysicalMaterial color="#5b1714" roughness={.42} clearcoat={.4}/></mesh>
  </group>;
}
export default function TrunkScene({reduced,onSelect,active,paused,onReady}) {
  return <Canvas shadows frameloop={paused?'never':'demand'} dpr={[1,1.35]} camera={{position:[0,6.8,9.5],fov:42,near:.1,far:60}} gl={{antialias:true,powerPreference:'high-performance',toneMappingExposure:1.1}} aria-hidden="true" fallback={<div className="trunk-webgl-fallback">Explore os objetos pelos botões abaixo.</div>}>
    <SceneLoading><Suspense fallback={<ScenePending/>}>
    <color attach="background" args={['#090a0c']}/><fog attach="fog" args={['#090a0c',13,23]}/>
    <hemisphereLight args={['#e2e8ef','#171316',1.3]}/>
    <directionalLight castShadow position={[-3,7,6]} intensity={2.6} color="#fff1df" shadow-mapSize={[1024,1024]} shadow-bias={-.0004}/>
    <directionalLight position={[5,3,-2]} intensity={1.25} color="#a5b4c2"/>
    <pointLight position={[0,2.8,2.7]} intensity={4} distance={9} color="#e7a36e" decay={2}/>
    <spotLight castShadow position={[0,5,3]} intensity={17} distance={10} angle={.53} penumbra={.85} color="#ffd6a7" shadow-mapSize={[512,512]}/>
    <Environment resolution={64}><Lightformer intensity={3.5} color="#fff4e5" position={[-2,5,4]} scale={[7,2,1]} rotation={[-.7,0,0]}/><Lightformer intensity={1.5} color="#8da0b5" position={[5,1,-4]} scale={[3,5,1]} rotation={[0,Math.PI,0]}/></Environment>
    <InteriorCamera reduced={reduced}/><TrunkInterior/>
    <group position={[1.84,.1,1.05]} scale={.56}><AlbumsObject/></group>
    <group position={[-.06,.26,-.66]} rotation={[-Math.PI/2,0,-Math.PI/2+.06]}><GuitarModel height={4.15} finish="cherry"/></group>
    <Memorabilia/><RoadGear/>
    <SelectableObject id="book" active={active} onSelect={onSelect} position={[.02,.103,.82]} highlight={[1.02,1.05]}><ProjectBook/></SelectableObject>
    <ContactShadows position={[0,.101,.1]} opacity={.45} scale={7.2} blur={2.5} far={4}/>
    <SceneReady onReady={onReady}/>
    </Suspense></SceneLoading>
  </Canvas>;
}
