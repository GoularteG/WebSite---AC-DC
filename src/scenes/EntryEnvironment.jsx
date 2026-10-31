import { useEffect, useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, BufferGeometry, Float32BufferAttribute, Object3D } from 'three';

// Generated once, shared by the whole turnout, and released with the entry scene.
function makeAsphalt() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  let seed = 1973;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const pixels = ctx.createImageData(512, 512);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const grain = 26 + random() * 23;
    pixels.data[i] = grain; pixels.data[i + 1] = grain; pixels.data[i + 2] = grain + 2; pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  // Hairline weathering, with no large repeating motifs.
  for (let n = 0; n < 14; n++) {
    let x = random() * 512, y = random() * 512;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let j = 0; j < 7; j++) { x += (random() - .5) * 24; y += random() * 14; ctx.lineTo(x, y); }
    ctx.strokeStyle = '#14141680'; ctx.lineWidth = .6; ctx.stroke();
  }
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  map.wrapS = map.wrapT = RepeatWrapping; map.repeat.set(9, 12); map.anisotropy = 4;
  const bump = map.clone(); bump.colorSpace = ''; bump.needsUpdate = true;
  return { map, bump };
}
export function EntryGround() {
  const textures = useMemo(makeAsphalt, []);
  useEffect(() => () => { textures.map.dispose(); textures.bump.dispose(); }, [textures]);
  return <group name="desert-turnout">
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.12,0]}>
      <planeGeometry args={[180,180]}/><meshStandardMaterial color="#382b26" roughness={1}/>
    </mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.09,0]}>
      <planeGeometry args={[26,38]}/><meshStandardMaterial map={textures.map} bumpMap={textures.bump} bumpScale={.035} roughness={.6} metalness={.16}/>
    </mesh>
    {/* Worn parking edge lines give the car a believable place to stand. */}
    {[-1,1].map(side => <group key={side}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[side*10.8,-.082,-1]}>
        <planeGeometry args={[.085,30]}/><meshStandardMaterial color="#9c8870" roughness={.95}/>
      </mesh>
      <mesh position={[side*13,-.01,1]}>
        <boxGeometry args={[.18,.18,34]}/><meshStandardMaterial color="#4a3d35" roughness={.95}/>
      </mesh>
    </group>)}
    {/* Tire wear is restrained and stays beneath the vehicle. */}
    {[-.73,.73].map(x => <mesh key={x} rotation={[-Math.PI/2,0,-.38]} position={[x,-.079,1]}>
      <planeGeometry args={[.23,7]}/><meshBasicMaterial color="#080809" transparent opacity={.15} depthWrite={false}/>
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
