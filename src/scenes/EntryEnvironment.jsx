import { useEffect, useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, BufferGeometry, Float32BufferAttribute, Object3D } from 'three';

// Generated once, shared by the stage deck, and released with the entry scene.
function makeStageDeck() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  let seed = 1973;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const pixels = ctx.createImageData(512, 512);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const grain = 20 + random() * 13;
    pixels.data[i] = grain; pixels.data[i + 1] = grain; pixels.data[i + 2] = grain + 2; pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  // Modular stage panels: fine joints and flush fasteners, rather than asphalt.
  ctx.strokeStyle = '#090a0d'; ctx.lineWidth = 3; ctx.strokeRect(1,1,510,510);
  ctx.fillStyle = '#687078';
  for (const x of [12,500]) for (const y of [12,500]) { ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill(); }
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  map.wrapS = map.wrapT = RepeatWrapping; map.repeat.set(4, 4); map.anisotropy = 4;
  const bump = map.clone(); bump.colorSpace = ''; bump.needsUpdate = true;
  return { map, bump };
}
export const ENTRY_STAGE_LIFT = .48;
export function EntryGround() {
  const textures = useMemo(makeStageDeck, []);
  useEffect(() => () => { textures.map.dispose(); textures.bump.dispose(); }, [textures]);
  return <group name="desert-show-stage">
    <mesh position={[0,.14,0]}>
      <boxGeometry args={[7.8,.5,7.8]}/><meshStandardMaterial color="#101216" roughness={.78} metalness={.35}/>
    </mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.392,0]}>
      <planeGeometry args={[7.8,7.8]}/><meshStandardMaterial map={textures.map} bumpMap={textures.bump} bumpScale={.009} roughness={.48} metalness={.45}/>
    </mesh>
    {/* Aluminium perimeter and touring-stage fascia panels. */}
    {[-1,1].map(side=><group key={side}>
      <mesh position={[side*3.88,.365,0]}><boxGeometry args={[.06,.07,7.8]}/><meshStandardMaterial color="#75787d" roughness={.4} metalness={.8}/></mesh>
      <mesh position={[0,.365,side*3.88]}><boxGeometry args={[7.8,.07,.06]}/><meshStandardMaterial color="#75787d" roughness={.4} metalness={.8}/></mesh>
    </group>)}
    {[-3.1,-1.55,0,1.55,3.1].map(x=><mesh key={x} position={[x,.13,-3.905]}>
      <boxGeometry args={[1.45,.33,.025]}/><meshStandardMaterial color="#202228" roughness={.7} metalness={.3}/>
    </mesh>)}
    {[-1,1].map(side=><mesh key={side} position={[side*3.4,.31,-3.93]}>
      <boxGeometry args={[.34,.025,.015]}/><meshBasicMaterial color="#d07c39"/>
    </mesh>)}
  </group>;
}
function ridgeGeometry(width, height, phase) {
  const geometry = new BufferGeometry(), vertices = [], indices = [];
  for (let i=0;i<=48;i++) {
    const x=(i/48-.5)*width;
    const y=height*(.32+.32*Math.sin(i*.43+phase)**2+.36*Math.sin(i*.17+phase)**4);
    vertices.push(x,-2,0,x,y,0);
    if(i<48){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}
  }
  geometry.setAttribute('position',new Float32BufferAttribute(vertices,3)); geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}
export function EntryBackdrop() {
  const far = useMemo(()=>ridgeGeometry(170,6.5,1.1),[]);
  const near = useMemo(()=>ridgeGeometry(130,4.8,2.7),[]);
  useEffect(()=>()=>{far.dispose();near.dispose();},[far,near]);
  return <group name="layered-desert-horizon">
    <mesh geometry={far} position={[0,0,57]}><meshBasicMaterial color="#623025" fog={false}/></mesh>
    <mesh geometry={near} position={[0,0,36]}><meshBasicMaterial color="#241b1c" fog={false}/></mesh>
  </group>;
}
export function EntryLighting() {
  const target=useMemo(()=>new Object3D(),[]);
  return <>
    <hemisphereLight args={['#a4a5bd','#171116',.38]}/>
    {/* Cool, broad front fill reveals chrome; amber backlight cuts the silhouette. */}
    <directionalLight position={[-6,7,-5]} intensity={1.7} color="#d7e0fa"/>
    <directionalLight position={[5,4,8]} intensity={3.8} color="#ff6b30"/>
    <primitive object={target} position={[0,.7,0]}/>
    <spotLight position={[-3.5,7,-1]} target={target} intensity={190} distance={20} angle={.6} penumbra={1} color="#ffe2ba"/>
  </>;
}
