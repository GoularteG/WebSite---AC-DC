import {useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {DoubleSide,Object3D} from 'three';
import {createLavaRiver} from './lavaGeometry';
import {roadX} from '../../data/journey';
import {FINAL_GATE_DISTANCE,infernoMix} from '../../data/finale';

const vertex='varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const noise='float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);} float fbm(vec2 p){return noise(p)*.55+noise(p*2.1)*.27+noise(p*4.3)*.18;}';
const lavaFragment='varying vec2 vUv;uniform float travel;uniform float strength;'+noise+'void main(){vec2 p=vec2(vUv.x*9.,vUv.y*.7);float n=fbm(p+vec2(sin(p.y)*.3,travel*.02));float vein=1.-smoothstep(.035,.15,abs(n-.5));float crust=smoothstep(.55,.75,n);vec3 c=mix(vec3(.16,.012,.004),vec3(1.,.19,.006),vein);c=mix(c,vec3(1.,.78,.22),pow(vein,8.)*.8);c=mix(c,vec3(.035,.02,.025),crust);gl_FragColor=vec4(mix(vec3(.045,.012,.01),c,.25+.75*strength)*1.1,1.);}';
const portalFragment='varying vec2 vUv;uniform float travel;uniform float strength;'+noise+'void main(){if(strength<.001){gl_FragColor=vec4(vec3(.12,.003,.006)*1.1,1.);return;}vec2 p=vUv;float n=fbm(vec2(p.x*7.,p.y*5.-travel*.04));float tongues=pow(1.-p.y,1.4)+n*.75;float fire=smoothstep(.48,.87,tongues);vec3 c=mix(vec3(.12,.003,.006),vec3(1.,.13,.005),fire);c=mix(c,vec3(1.,.82,.28),smoothstep(1.,1.3,tongues));gl_FragColor=vec4(mix(vec3(.12,.003,.006),c,strength)*1.1,1.);}';
function MoltenMaterial({travel,strength,portal=false}){
  const material=useRef();
  const uniforms=useMemo(()=>({travel:{value:0},strength:{value:0}}),[]);
  useFrame(()=>{
    material.current.uniforms.travel.value=travel.current;
    material.current.uniforms.strength.value=strength.current;
  });
  return <shaderMaterial ref={material} transparent={false} depthWrite side={DoubleSide} toneMapped={false} uniforms={uniforms} vertexShader={vertex} fragmentShader={portal?portalFragment:lavaFragment}/>;
}
function LavaRiver({side,travel,strength}){
  const geometry=useMemo(()=>createLavaRiver(side),[side]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh name={`lava-river-${side}`} geometry={geometry} frustumCulled={false}><MoltenMaterial travel={travel} strength={strength}/></mesh>;
}
export default function HellLandscape({distance,reduced,ghostActive=false}){
  const travel=useRef(0),strength=useRef(0),rivers=useRef(null),cragsRef=useRef(null);
  useFrame(({camera})=>{
    const s=ghostActive?-camera.position.z:distance.current;
    travel.current=reduced?0:distance.current;
    strength.current=infernoMix(s);
    if(rivers.current)rivers.current.visible=ghostActive||s>240;
  },-1);
  const crags=useMemo(()=>Array.from({length:28},(_,i)=>{
    const side=i%2?1:-1,s=635+i*7;
    return {position:[roadX(s)+side*(13+((i*13)%19)),3+(i%5),-s],scale:[2+(i%3),8+(i%6)*2,3+(i%4)],rotation:[0,i*.8,side*.12]};
  }),[]);
  useLayoutEffect(()=>{
    const dummy=new Object3D();
    crags.forEach((rock,i)=>{
      dummy.position.set(...rock.position);
      dummy.rotation.set(...rock.rotation);
      dummy.scale.set(...rock.scale);
      dummy.updateMatrix();
      cragsRef.current.setMatrixAt(i,dummy.matrix);
    });
    cragsRef.current.instanceMatrix.needsUpdate=true;
    cragsRef.current.computeBoundingSphere();
  },[crags]);
  return <group name="hell-landscape">
    <group ref={rivers}><LavaRiver side={-1} travel={travel} strength={strength}/><LavaRiver side={1} travel={travel} strength={strength}/></group>
    <mesh position={[roadX(FINAL_GATE_DISTANCE),10,-FINAL_GATE_DISTANCE-2]}>
      <planeGeometry args={[18,21]}/><MoltenMaterial portal travel={travel} strength={strength}/>
    </mesh>
    <instancedMesh ref={cragsRef} args={[null,null,crags.length]} matrixAutoUpdate={false}>
      <icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#1c1418" roughness={.98}/>
    </instancedMesh>
  </group>;
}
