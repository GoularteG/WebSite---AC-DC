import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, CanvasTexture, RepeatWrapping, SRGBColorSpace, Color, Float32BufferAttribute, MeshStandardMaterial } from 'three';
import { roadX } from '../../data/journey';
import { infernoMix } from '../../data/finale';
import { createRoadShoulder } from './roadShoulder';
export function ribbonGeometry(offset, width, start = -90, end = 1040, height = 0) {
  const points = [], indices = [], uvs = [];
  const count = Math.ceil((end - start) / 2);
  for (let i = 0; i <= count; i++) {
    const s = start + (end - start) * i / count;
    uvs.push(0,s/9,1,s/9);
    points.push(roadX(s) + offset - width / 2, height, -s, roadX(s) + offset + width / 2, height, -s);
    if (i < count) { const a = i * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const geometry = new BufferGeometry(); geometry.setAttribute('position', new Float32BufferAttribute(points, 3)); geometry.setAttribute('uv',new Float32BufferAttribute(uvs,2)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
}
function Ribbon({ offset = 0, width, height, material, start, end }) {
  const geometry = useMemo(() => ribbonGeometry(offset, width, start, end, height), [offset, width, start, end, height]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} material={material} receiveShadow />;
}
export default function Road({ distance, ghostActive = false }) {
  const shoulderGeometries = useMemo(() => [-1, 1].map(createRoadShoulder), []);
  const shoulderMaterial = useMemo(() => new MeshStandardMaterial({ vertexColors: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }), []);
  useEffect(() => () => { shoulderGeometries.forEach(geometry => geometry.dispose()); shoulderMaterial.dispose(); }, [shoulderGeometries, shoulderMaterial]);
  const asphaltTexture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#999994';ctx.fillRect(0,0,512,512);
    let seed=23;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(let i=0;i<42000;i++){const v=Math.floor(92+random()*100);ctx.fillStyle='rgb('+v+','+v+','+v+')';ctx.fillRect(random()*512,random()*512,1+random()*1.4,1);}
    ctx.lineWidth=1.2;ctx.strokeStyle='#434342';
    for(let i=0;i<8;i++){let x=random()*512,y=random()*512;ctx.beginPath();ctx.moveTo(x,y);for(let j=0;j<7;j++){x+=(random()-.5)*33;y+=random()*14;ctx.lineTo(x,y);}ctx.stroke();}
    for(const x of [91,158,354,421]){const g=ctx.createLinearGradient(x-16,0,x+16,0);g.addColorStop(0,'#11111100');g.addColorStop(.5,'#11111120');g.addColorStop(1,'#11111100');ctx.fillStyle=g;ctx.fillRect(x-16,0,32,512);}
    const texture=new CanvasTexture(canvas);texture.wrapS=texture.wrapT=RepeatWrapping;texture.colorSpace=SRGBColorSpace;texture.anisotropy=4;return texture;
  },[]);
  const desertTexture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#ead9c7';ctx.fillRect(0,0,512,512);
    let seed=41;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(let i=0;i<125;i++){
      const x=random()*512,y=random()*512,r=12+random()*65;
      const dust=ctx.createRadialGradient(x,y,0,x,y,r);
      dust.addColorStop(0,i%3?'#67483920':'#fff5d919');dust.addColorStop(1,'#ffffff00');
      ctx.fillStyle=dust;ctx.fillRect(x-r,y-r,r*2,r*2);
    }
    for(let i=0;i<11000;i++){
      const v=Math.floor(90+random()*90);
      ctx.fillStyle=`rgba(${v},${Math.floor(v*.77)},${Math.floor(v*.6)},.13)`;
      ctx.fillRect(random()*512,random()*512,1.5,1.5);
    }
    const texture=new CanvasTexture(canvas);texture.wrapS=texture.wrapT=RepeatWrapping;
    texture.repeat.set(9,13);texture.colorSpace=SRGBColorSpace;texture.anisotropy=4;return texture;
  },[]);
  useEffect(()=>()=>{asphaltTexture.dispose();desertTexture.dispose();},[asphaltTexture,desertTexture]);

  const palette = useMemo(() => Object.fromEntries(Object.entries({
    shoulder:['#705345','#382126'], asphalt:['#28292c','#1a171c'],
    edge:['#d6c5a7','#c07a55'], center:['#f6b643','#fb8d32'],
    dash:['#9c9789','#70544e'], ground:['#8d7158','#261b21'],
  }).map(([key,[normal,final]]) => [key,{normal:new Color(normal),final:new Color(final),material:new MeshStandardMaterial({color:normal,roughness:.9})}])), []);
  const paletteItems = useMemo(() => Object.values(palette), [palette]);
  palette.asphalt.material.map=asphaltTexture;
  palette.asphalt.material.bumpMap=asphaltTexture;palette.asphalt.material.bumpScale=.025;
  palette.ground.material.map=desertTexture;
  palette.ground.material.bumpMap=desertTexture;palette.ground.material.bumpScale=.035;palette.ground.material.polygonOffset=true;palette.ground.material.polygonOffsetFactor=2;palette.ground.material.polygonOffsetUnits=2;
  useEffect(() => () => paletteItems.forEach(item=>item.material.dispose()), [paletteItems]);
  useFrame(({ camera }) => {
    const mix = infernoMix(ghostActive ? -camera.position.z : distance.current);
    paletteItems.forEach(item=>item.material.color.lerpColors(item.normal,item.final,mix));
    shoulderMaterial.color.setRGB(1 - mix * .65, 1 - mix * .73, 1 - mix * .69);
  });
  return <group>
    {shoulderGeometries.map((geometry, index) => <mesh key={index} geometry={geometry} material={shoulderMaterial} receiveShadow />)}
    <Ribbon width={11} height={0} material={palette.asphalt.material} />
    {[-5, 5].map(offset => <Ribbon key={offset} offset={offset} width={.1} height={.015} material={palette.edge.material} />)}
    {[-.13, .13].map(offset => <Ribbon key={offset} offset={offset} width={.09} height={.018} material={palette.center.material} />)}
    {[-5.35,5.35].map(offset=><Ribbon key={offset} offset={offset} width={.18} height={.008} material={palette.shoulder.material}/>)}

    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.09, -450]} material={palette.ground.material} receiveShadow><planeGeometry args={[1600, 2200]} /></mesh>
  </group>;
}
