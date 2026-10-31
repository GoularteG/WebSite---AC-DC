import { Component, Suspense, useRef, useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import Charger from '../components/car/Charger';
import SceneReady from '../components/loading/SceneReady';
import Headlights from '../components/car/Headlights';
import { EntryGround, EntryBackdrop, EntryLighting, ENTRY_STAGE_LIFT } from './EntryEnvironment';
import EntryDesert from './EntryDesert';
import { Landmark } from '../components/roadside/Scenery';

// Local stage coordinates: independent of the highway's curves.
const props = [
  { id:'entry-guitar', kind:'model', modelPath:'/models/guitar-electric.glb', finish:'cherry', position:[-4.1,-.105,3.6], height:4.2, rotation:[0,Math.PI-.2,-.12] },
  { id:'entry-amps', kind:'amps', position:[0,-.105,6], scale:.65, rotation:[0,Math.PI,0] },
  { id:'entry-bell', kind:'bell', position:[4.2,-.105,4.8], scale:.46, rotation:[0,Math.PI,0] },
];
class EntryBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed ? <div className="scene-fallback">O palco está pronto. Escolha seu caminho abaixo.</div> : this.props.children;}
}
function EntryCamera() {
  const {camera,size,invalidate}=useThree();
  useLayoutEffect(()=>{
    const aspect=size.width/size.height;
    // Keep a fixed optical axis; rotate the car, not the entire composition.
    const distance=Math.max(12.8, 6.8/(2*Math.tan(Math.PI*18/180)*aspect));
    camera.position.set(0,2.5,distance*-1);
    camera.lookAt(0,1.65,0);
    invalidate();
  },[camera,size.width,size.height,invalidate]);
  return null;
}
function Showcase({onReady}) {
  const distance=useRef(0);
  return <>
    <color attach="background" args={['#180d0c']}/>
    <fog attach="fog" args={['#64291b',25,85]}/>
    <mesh><sphereGeometry args={[90,24,16]}/><shaderMaterial side={1} depthWrite={false}
      vertexShader={'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'}
      fragmentShader={`
        varying vec3 p;
        float hash(vec2 v){return fract(sin(dot(v,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 v){vec2 i=floor(v),f=fract(v);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
        void main(){
          vec3 d=normalize(p);float h=d.y;
          vec3 c=mix(vec3(.95,.26,.045),vec3(.025,.018,.025),smoothstep(-.06,.48,h));
          vec2 uv=vec2(atan(d.x,d.z)*2.,h*24.);
          float cloud=noise(uv)*.65+noise(uv*2.1)*.25+noise(uv*4.2)*.1;
          c*=1.-smoothstep(.38,.72,cloud)*.78*smoothstep(-.04,.12,h);
          gl_FragColor=vec4(c,1.);
        }` }/></mesh>
    <EntryLighting/>
    <Environment resolution={64} environmentIntensity={.6}>
      <color attach="background" args={['#100f17']}/>
      <Lightformer position={[-3,5,-4]} rotation={[.4,0,.3]} scale={[3,7,1]} intensity={3} color="#dce5ff"/>
      <Lightformer position={[-8,3,5]} rotation={[0,Math.PI/2,0]} scale={[8,2,1]} intensity={4} color="#ff5c2e"/>
    </Environment>
    <EntryGround/><EntryDesert/><EntryBackdrop/>
    <group name="entry-car" position={[0,ENTRY_STAGE_LIFT,0]} rotation={[0,-.38,0]}>
      <Charger distance={distance}/>
      <Headlights distance={distance} groundProjection={false}/>
    </group>
    {/* A soft contact patch grounds the car without a real-time shadow pass. */}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.399,0]}>
      <planeGeometry args={[5.6,7.4]}/><shaderMaterial transparent depthWrite={false}
        vertexShader={'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'}
        fragmentShader={'varying vec2 v;void main(){float a=1.-smoothstep(.18,.52,length((v-.5)*vec2(1.2,1.)));gl_FragColor=vec4(0.,0.,0.,a*.72);}'}/>
    </mesh>
    {props.map(asset=><Landmark key={asset.id} asset={asset} eager/>)}
    <SceneReady onReady={onReady}/>
  </>;
}
export default function EntryScene({onReady}) {
  return <EntryBoundary><Canvas frameloop="demand" dpr={[1,1.3]} camera={{position:[5,2.1,-10.5],fov:36,near:.1,far:200}} gl={{antialias:true,powerPreference:'high-performance'}} onCreated={({camera})=>camera.lookAt(0,1.7,0)} fallback={<div className="scene-fallback">Escolha seu caminho abaixo.</div>}>
    <EntryCamera/><Suspense fallback={null}><Showcase onReady={onReady}/></Suspense>
  </Canvas></EntryBoundary>;
}
