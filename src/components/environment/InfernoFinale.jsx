import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import { BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, Shape, Vector3 } from 'three';
import { roadX } from '../../data/journey';
import { FINAL_GATE_DISTANCE, FINAL_STOP_DISTANCE, infernoMix } from '../../data/finale';

const gateX = roadX(FINAL_GATE_DISTANCE);
const gateAngle = -Math.atan((roadX(FINAL_GATE_DISTANCE + .1) - roadX(FINAL_GATE_DISTANCE - .1)) / .2);
const hash = seed => { const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };

function Monument({ molten }) {
  const arch = useMemo(() => {
    const shape = new Shape();
    [[-14,0],[-15,13],[-12,21],[-6,25],[0,26],[6,25],[12,21],[15,13],[14,0],[9,0],[9,12],[7,17],[0,21],[-7,17],[-9,12],[-9,0]]
      .forEach(([x,y], i) => i ? shape.lineTo(x,y) : shape.moveTo(x,y));
    shape.closePath(); return shape;
  }, []);
  const seam = useMemo(() => new CatmullRomCurve3([
    [-9,.2],[-9,11.8],[-7,17],[0,21],[7,17],[9,11.8],[9,.2],
  ].map(([x,y]) => new Vector3(x,y,5.7)), false, 'centripetal'), []);
  const bolt = useMemo(() => {
    const s=new Shape(); [[.4,2],[-.8,.1],[0,.1],[-.5,-1.7],[1,.6],[.2,.6],[.7,2]].forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y)); s.closePath(); return s;
  }, []);
  return <group position={[gateX, -.05, -FINAL_GATE_DISTANCE]} rotation={[0,gateAngle,0]}>
    <mesh castShadow receiveShadow>
      <extrudeGeometry args={[arch, { depth: 5, bevelEnabled: true, bevelSize: .45, bevelThickness: .5, bevelSegments: 2, steps: 1 }]} />
      <meshStandardMaterial color="#211b1c" roughness={.94} metalness={.12} />
    </mesh>
    <mesh><tubeGeometry args={[seam, 64, .12, 5, false]} /><meshStandardMaterial ref={molten} color="#ffb15a" emissive="#ff4c0c" emissiveIntensity={2} toneMapped={false} /></mesh>
    {[-1,1].flatMap(side => Array.from({length:5},(_,i) => <mesh key={`${side}-${i}`} position={[side*(11.6 + hash(i+side)*.5),2+i*4.2,2.8]} rotation={[.08*side,.15*side,side*(.06+hash(i)*.1)]} castShadow>
      <dodecahedronGeometry args={[1,0]} /><meshStandardMaterial color={i%2 ? '#302322' : '#1b191b'} roughness={1} />
    </mesh>))}
    <mesh position={[0,23.5,5.65]} rotation={[0,0,-.12]}>
      <extrudeGeometry args={[bolt, {depth:.2,bevelEnabled:false}]} />
      <meshBasicMaterial color="#ffb85d" toneMapped={false} />
    </mesh>
  </group>;
}

function BasaltCliffs() {
  const rocks = useMemo(() => Array.from({length:52},(_,i) => {
    const s=552+hash(i+6)*275, side=i%2?1:-1;
    const height=5+hash(i+30)*17;
    return {position:[roadX(s)+side*(19+hash(i+11)*29),height*.42-2,-s],
      rotation:[hash(i)*.3,hash(i+1)*Math.PI,side*(hash(i+2)-.5)*.5],
      scale:[4+hash(i+3)*5,height,4+hash(i+4)*7], color:i%3?'#272127':'#3b2829'};
  }), []);
  return <Instances limit={52} frames={1} castShadow receiveShadow>
    <icosahedronGeometry args={[1,1]} /><meshStandardMaterial roughness={.98} metalness={.07} />
    {rocks.map((rock,i) => <Instance key={i} {...rock} />)}
  </Instances>;
}

function LavaChannels({ material }) {
  const channels = useMemo(() => {
    const points=[], indices=[];
    // Incandescent fissures stay outside the asphalt and follow the curved road.
    for(let side of [-1,1]) for(let branch=0;branch<4;branch++) {
      const base=points.length/3;
      for(let i=0;i<=44;i++) {
        const s=550+i*6, offset=side*(9+branch*9+Math.sin(i*.83+branch*1.7)*(branch*1.5+.8)+(hash(i*3+branch+6)-.5)*(1.5+branch*2));
        const width=.12+branch*.12+hash(i+branch)*.35;
        points.push(roadX(s)+offset-width,.035,-s,roadX(s)+offset+width,.035,-s);
        if(i<44) {const a=base+i*2; indices.push(a,a+1,a+2,a+1,a+3,a+2);}
      }
    }
    const geometry=new BufferGeometry(); geometry.setAttribute('position',new Float32BufferAttribute(points,3)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
  }, []);
  return <>
    <mesh geometry={channels}><meshStandardMaterial ref={material} color="#fa7d24" emissive="#ee3908" emissiveIntensity={1.7} roughness={.7} toneMapped={false} /></mesh>
    {[3,5,7].map(offset => <mesh key={offset} position={[roadX(FINAL_STOP_DISTANCE+offset),.027,-FINAL_STOP_DISTANCE-offset]}>
      <boxGeometry args={[10.5,.015,.06]} /><meshBasicMaterial color="#ff963b" toneMapped={false} />
    </mesh>)}
  </>;
}

const smokeVertex = 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const smokeFragment = `varying vec2 vUv; uniform float strength; uniform float travel;
  void main(){vec2 p=vUv-.5; float fog=exp(-dot(p,p)*14.);
    float detail=.7+.18*sin(vUv.x*19.+sin(vUv.y*15.+travel))+.12*cos(vUv.y*26.-travel);
    gl_FragColor=vec4(.28,.19,.19,fog*detail*strength*.19);}`;
function Atmospherics({ distance, quality, reduced }) {
  const clouds=useRef(), particles=useRef();
  const smokeUniforms=useMemo(()=>({strength:{value:0},travel:{value:0}}),[]);
  const emberUniforms=useMemo(()=>({strength:{value:0},travel:{value:0}}),[]);
  const points=useMemo(()=>{
    const values=[]; const count=quality==='high'?64:28;
    for(let i=0;i<count;i++) {const s=625+hash(i+4)*160;values.push(roadX(s)+(hash(i+7)-.5)*39,1+hash(i+8)*15,-s);}
    return new Float32Array(values);
  },[quality]);
  useFrame(({camera})=>{
    const strength=infernoMix(distance.current);
    const travel=reduced?0:distance.current*.07;
    particles.current.material.uniforms.strength.value=strength;
    particles.current.material.uniforms.travel.value=travel;
    clouds.current.children.forEach(cloud=>{
      cloud.quaternion.copy(camera.quaternion);
      cloud.material.uniforms.strength.value=strength;
      cloud.material.uniforms.travel.value=travel;
    });
  });
  return <>
    <group ref={clouds}>{Array.from({length:6},(_,i)=>{
      const s=656+i*25;
      return <mesh key={i} position={[roadX(s)+(i%2?19:-18),5+(i%3)*2,-s]} scale={[26,13,1]} renderOrder={1}>
        <planeGeometry /><shaderMaterial transparent depthWrite={false} uniforms={smokeUniforms} vertexShader={smokeVertex} fragmentShader={smokeFragment} />
      </mesh>;
    })}</group>
    <points ref={particles} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]} /></bufferGeometry>
      <shaderMaterial transparent depthWrite={false} uniforms={emberUniforms}
        vertexShader={'uniform float travel; uniform float strength; varying float alpha; void main(){vec3 p=position; p.y+=sin(travel+position.x)*.5; vec4 view=modelViewMatrix*vec4(p,1.);alpha=strength*(1.-smoothstep(80.,165.,-view.z));gl_PointSize=clamp(100./max(1.,-view.z),1.,3.);gl_Position=projectionMatrix*view;}'}
        fragmentShader={'varying float alpha; void main(){float glow=1.-smoothstep(.1,.5,length(gl_PointCoord-.5));gl_FragColor=vec4(1.,.35,.08,glow*alpha*.75);}'} />
    </points>
  </>;
}

// Fixed world geometry; the existing vehicle/camera traversal supplies the parallax.
// No extra lights, shadow maps, textures, bloom passes or perpetual animation loop.
export default function InfernoFinale({ distance, quality, reduced }) {
  const world=useRef(), molten=useRef(), lava=useRef();
  useFrame(()=>{
    const mix=infernoMix(distance.current);
    world.current.visible=distance.current>270;
    molten.current.emissiveIntensity=.8+mix*1.7;
    lava.current.emissiveIntensity=.45+mix*1.35;
  });
  return <group ref={world}>
    <BasaltCliffs /><LavaChannels material={lava} /><Monument molten={molten} />
    <Atmospherics distance={distance} quality={quality} reduced={reduced} />
  </group>;
}
