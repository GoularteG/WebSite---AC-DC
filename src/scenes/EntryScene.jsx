import { Component, Suspense, useRef, useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import Charger from '../components/car/Charger';
import { Landmark } from '../components/roadside/Scenery';

const props = [
  { id:'entry-guitar', kind:'model', modelPath:'/models/guitar-electric.glb', finish:'cherry', distance:-8, side:-1, offset:5, height:5.5, rotation:[0,.35,-.08] },
  { id:'entry-stage', kind:'stage', distance:-13, side:1, offset:3, scale:.85, rotation:[0,Math.PI,0] },
  { id:'entry-bell', kind:'bell', distance:-8, side:1, offset:10, scale:.60, rotation:[0,Math.PI,0] },
];
class EntryBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed ? <div className="scene-fallback">O palco está pronto. Escolha seu caminho abaixo.</div> : this.props.children;}
}
function EntryCamera() {
  const {camera,size,invalidate}=useThree();
  useLayoutEffect(()=>{
    const distance=Math.max(11.6,6.6/(2*Math.tan(Math.PI*21/180)*(size.width/size.height)));
    camera.position.set(distance*.43,2.1+distance*.03,-distance*.90);
    camera.lookAt(0,1.7,0);
    invalidate();
  },[camera,size.width,size.height,invalidate]);
  return null;
}
function Showcase({onReady}) {
  const distance=useRef(0);
  return <>
    <color attach="background" args={['#9c3215']}/>
    <fog attach="fog" args={['#92341e',20,68]}/>
    <mesh><sphereGeometry args={[90,24,16]}/><shaderMaterial side={1} depthWrite={false}
      vertexShader={'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'}
      fragmentShader={'varying vec3 p;void main(){float h=normalize(p).y;vec3 c=mix(vec3(.9,.23,.035),vec3(.045,.017,.026),smoothstep(-.03,.7,h));gl_FragColor=vec4(c,1.);}'}/></mesh>
    <hemisphereLight args={['#ffc495','#30232e',.8]}/>
    <directionalLight position={[-8,9,-4]} intensity={2.2} color="#ffd4a5"/>
    <directionalLight position={[5,5,10]} intensity={3} color="#ff5426"/>
    <Environment resolution={64} environmentIntensity={.45}>
      <color attach="background" args={['#23171a']}/>
      <Lightformer position={[0,5,-6]} scale={[12,4,1]} intensity={2} color="#f5d9b7"/>
      <Lightformer position={[-8,3,5]} rotation={[0,Math.PI/2,0]} scale={[10,4,1]} intensity={2.5} color="#ff5c2e"/>
    </Environment>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.09,0]}><planeGeometry args={[180,180]}/><meshStandardMaterial color="#282126" roughness={.75} metalness={.15}/></mesh>
    <group name="entry-car"><Suspense fallback={null}><Charger distance={distance} onReady={onReady}/></Suspense></group>
    <Suspense fallback={null}>{props.map(asset=><Landmark key={asset.id} asset={asset}/>)}</Suspense>
  </>;
}
export default function EntryScene({onReady}) {
  return <EntryBoundary><Canvas frameloop="demand" dpr={[1,1.3]} camera={{position:[5,2.1,-10.5],fov:42,near:.1,far:200}} gl={{antialias:true,powerPreference:'high-performance'}} onCreated={({camera})=>camera.lookAt(0,1.7,0)} fallback={<div className="scene-fallback">Escolha seu caminho abaixo.</div>}>
    <EntryCamera/><Showcase onReady={onReady}/>
  </Canvas></EntryBoundary>;
}
