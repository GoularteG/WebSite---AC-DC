import { useEffect, useMemo } from 'react';
import { Color, DoubleSide, Float32BufferAttribute, MeshStandardMaterial, PlaneGeometry } from 'three';
import { FormationInstances } from '../components/environment/DesertLandscape';
import { creosoteGeometry, desertStoneGeometry, erodedFormationGeometry, rootedYuccaGeometry } from '../components/environment/desertGeometry';
import { cactusGeometry } from '../components/environment/cactusGeometry';

const stoneTones=['#aa8d70','#bca184','#867565','#c0a386'];
const plantTones=['#787e60','#8d8b69','#727b60','#999075'];
const mesaTones=['#b19a82','#9a806b','#baa084','#897364'];
const random=(i,salt)=>{const value=Math.sin(i*127.1+salt*311.7)*43758.5453;return value-Math.floor(value);};
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function entrySandHeight(x,z){
  const rise=smooth(6,28,Math.max(Math.abs(x),Math.abs(z)*.65));
  return -.105+rise*(.5+1.3*Math.sin(x*.09+z*.1)**2+.65*Math.sin(x*.18-z*.07)**2);
}
function scatter(count,salt,width,height){
  return Array.from({length:count},(_,i)=>{
    // Desert surrounds the stage, including the foreground; preserve its footprint.
    const z=-19+random(i,salt)*57;
    const x=(i%2?-1:1)*((z < 7 ? 7 : 4.8)+random(i,salt+1)*23);
    const scale=width*(.55+random(i,salt+2));
    return {position:[x,entrySandHeight(x,z)-.035,z],width:scale,height:height*(.65+random(i,salt+3)),depth:.7+random(i,salt+4)*.35,rotation:random(i,salt+5)*Math.PI*2,tone:i%4};
  });
}
const rocks=scatter(75,13,.6,.45);
const scrub=scatter(68,23,.55,.48);
const yucca=scatter(12,33,.65,1.1);
const cacti=scatter(9,43,.65,2.3);
const formations=[{position:[-25,entrySandHeight(-25,29)-.4,29],width:8,height:6,depth:.65,rotation:.7,tone:1},{position:[27,entrySandHeight(27,35)-.4,35],width:10,height:7,depth:.6,rotation:2.1,tone:2}];

export default function EntryDesert(){
  const assets=useMemo(()=>{
    const terrain=new PlaneGeometry(180,180,120,120);
    terrain.rotateX(-Math.PI/2);terrain.translate(0,0,10);
    const positions=terrain.attributes.position,colors=[],tone=new Color();
    for(let i=0;i<positions.count;i++){
      const x=positions.getX(i),z=positions.getZ(i);
      positions.setY(i,entrySandHeight(x,z));
      const grain=random(i,74)*.035;
      tone.set('#796048').multiplyScalar(.91+grain+.1*Math.sin(x*.16+z*.11));
      colors.push(tone.r,tone.g,tone.b);
    }
    terrain.setAttribute('color',new Float32BufferAttribute(colors,3));terrain.computeVertexNormals();
    return {terrain,rock:desertStoneGeometry(),scrub:creosoteGeometry(),yucca:rootedYuccaGeometry(),cactus:cactusGeometry(),mesa:erodedFormationGeometry(1),sand:new MeshStandardMaterial({vertexColors:true,roughness:1}),stone:new MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true}),plant:new MeshStandardMaterial({vertexColors:true,roughness:1,side:DoubleSide})};
  },[]);
  useEffect(()=>()=>Object.values(assets).forEach(resource=>resource.dispose()),[assets]);
  return <group name="entry-desert-garden">
    <mesh geometry={assets.terrain} material={assets.sand}/>
    <FormationInstances formations={rocks} geometry={assets.rock} material={assets.stone} tones={stoneTones}/>
    <FormationInstances formations={scrub} geometry={assets.scrub} material={assets.plant} tones={plantTones}/>
    <FormationInstances formations={yucca} geometry={assets.yucca} material={assets.plant} tones={plantTones}/>
    <FormationInstances formations={cacti} geometry={assets.cactus} material={assets.stone} tones={plantTones}/>
    <FormationInstances formations={formations} geometry={assets.mesa} material={assets.stone} tones={mesaTones}/>
  </group>;
}
