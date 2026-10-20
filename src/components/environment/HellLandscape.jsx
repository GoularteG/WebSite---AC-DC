import {useState,useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {Instances,Instance,Html} from '@react-three/drei';
import {CanvasTexture,TextureLoader,SRGBColorSpace} from 'three';
import {ribbonGeometry} from './Road';
import {roadX} from '../../data/journey';
import {FINAL_GATE_DISTANCE,infernoMix} from '../../data/finale';

const photoUrl='https://upload.wikimedia.org/wikipedia/commons/9/9e/ACDC_In_Tacoma_2009.jpg';
const vertex='varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const noise='float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);} float fbm(vec2 p){return noise(p)*.55+noise(p*2.1)*.27+noise(p*4.3)*.18;}';
const lavaFragment='varying vec2 vUv;uniform float travel;uniform float strength;'+noise+'void main(){vec2 p=vec2(vUv.x*9.,vUv.y*.7);float n=fbm(p+vec2(sin(p.y)*.3,travel*.02));float vein=1.-smoothstep(.035,.15,abs(n-.5));float crust=smoothstep(.55,.75,n);vec3 c=mix(vec3(.16,.012,.004),vec3(1.,.19,.006),vein);c=mix(c,vec3(1.,.78,.22),pow(vein,8.)*.8);c=mix(c,vec3(.035,.02,.025),crust);gl_FragColor=vec4(c,strength);}';
const portalFragment='varying vec2 vUv;uniform float travel;uniform float strength;'+noise+'void main(){vec2 p=vUv;float n=fbm(vec2(p.x*7.,p.y*5.-travel*.04));float tongues=pow(1.-p.y,1.4)+n*.75;float fire=smoothstep(.48,.87,tongues);vec3 c=mix(vec3(.12,.003,.006),vec3(1.,.13,.005),fire);c=mix(c,vec3(1.,.82,.28),smoothstep(1.,1.3,tongues));gl_FragColor=vec4(c,strength);}';
function MoltenMaterial({travel,strength,portal=false}){
  const material=useRef();
  const uniforms=useMemo(()=>({travel:{value:0},strength:{value:0}}),[]);
  useFrame(()=>{
    material.current.uniforms.travel.value=travel.current;
    material.current.uniforms.strength.value=strength.current;
    if(portal) material.current.depthWrite=strength.current>.98;
  });
  return <shaderMaterial ref={material} transparent depthWrite={false} toneMapped={false} uniforms={uniforms} vertexShader={vertex} fragmentShader={portal?portalFragment:lavaFragment}/>;
}
function LavaRiver({side,travel,strength}){
  const geometry=useMemo(()=>ribbonGeometry(side*34,48,608,850,-.025),[side]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry}><MoltenMaterial travel={travel} strength={strength}/></mesh>;
}
function BandPhoto(){
  const [texture,setTexture]=useState(null),[failed,setFailed]=useState(false);
  const invalidate=useThree(state=>state.invalidate);
  useEffect(()=>{
    let active=true;
    const image=new TextureLoader().load(photoUrl,loaded=>{
      if(!active)return;
      loaded.colorSpace=SRGBColorSpace;setTexture(loaded);invalidate();
    },undefined,()=>{if(active){setFailed(true);invalidate();}});
    return ()=>{active=false;image.dispose();};
  },[invalidate]);
  if(failed)return <Html center transform position={[0,0,.28]} distanceFactor={10}><a className="band-photo-fallback" href="https://commons.wikimedia.org/wiki/File:ACDC_In_Tacoma_2009.jpg" target="_blank" rel="noreferrer">AC/DC<br/><small>Ver foto original ↗</small></a></Html>;
  if(!texture)return null;
  return <mesh position={[0,0,.26]}><planeGeometry args={[9,9*473/600]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
function BandMonument(){
  const title=useMemo(()=>{
    const c=document.createElement('canvas');c.width=1024;c.height=128;
    const ctx=c.getContext('2d');ctx.fillStyle='#171313';ctx.fillRect(0,0,1024,128);
    ctx.fillStyle='#e9b469';ctx.textAlign='center';ctx.font='72px "Metal Mania", serif';ctx.fillText('AC/DC — HIGHWAY TO HELL',512,87);
    const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;return t;
  },[]);
  useEffect(()=>()=>title.dispose(),[title]);
  const s=FINAL_GATE_DISTANCE-22;
  return <group name="band-photo-before-gate" position={[roadX(s)-12,8.7,-s]} rotation={[0,.12,0]}>
    <mesh><boxGeometry args={[9.6,9.5,.45]}/><meshStandardMaterial color="#191719" metalness={.6} roughness={.4}/></mesh>
    <BandPhoto/>
    <mesh position={[0,4.13,.26]}><planeGeometry args={[9,1.125]}/><meshBasicMaterial map={title} toneMapped={false}/></mesh>
    {[-4.7,4.7].map(x=><mesh key={x} position={[x,0,.26]}><boxGeometry args={[.055,9.5,.06]}/><meshBasicMaterial color="#ec7726"/></mesh>)}
    {[-3.7,3.7].map(x=><mesh key={x} position={[x,-6,0]}><boxGeometry args={[.35,7,.5]}/><meshStandardMaterial color="#29272b" metalness={.6}/></mesh>)}
  </group>;
}
export default function HellLandscape({distance,reduced,ghostActive=false}){
  const travel=useRef(0),strength=useRef(0);
  useFrame(({camera})=>{travel.current=reduced?0:distance.current;strength.current=ghostActive?infernoMix(-camera.position.z):infernoMix(distance.current);},-1);
  const crags=useMemo(()=>Array.from({length:28},(_,i)=>{
    const side=i%2?1:-1,s=635+i*7;
    return {position:[roadX(s)+side*(13+((i*13)%19)),3+(i%5),-s],scale:[2+(i%3),8+(i%6)*2,3+(i%4)],rotation:[0,i*.8,side*.12]};
  }),[]);
  return <group name="hell-landscape">
    <LavaRiver side={-1} travel={travel} strength={strength}/><LavaRiver side={1} travel={travel} strength={strength}/>
    <mesh position={[roadX(FINAL_GATE_DISTANCE),10,-FINAL_GATE_DISTANCE-2]}>
      <planeGeometry args={[18,21]}/><MoltenMaterial portal travel={travel} strength={strength}/>
    </mesh>
    <BandMonument/>
    <Instances limit={28} frames={1}><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#1c1418" roughness={.98}/>
      {crags.map((rock,i)=><Instance key={i} {...rock}/>)}
    </Instances>
  </group>;
}
