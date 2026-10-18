import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide } from 'three';
export default function Atmosphere() {
  const sky = useRef();
  useFrame(({ camera }) => sky.current.position.copy(camera.position));
  return <>
    <mesh ref={sky} renderOrder={-1}>
      <sphereGeometry args={[700, 24, 16]} />
      <shaderMaterial side={BackSide} depthWrite={false} uniforms={{}} vertexShader={'varying vec3 vPosition; void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'} fragmentShader={'varying vec3 vPosition; void main(){float h=normalize(vPosition).y; vec3 horizon=vec3(.96,.30,.085); vec3 top=vec3(.065,.035,.065); vec3 c=mix(horizon,top,smoothstep(-.04,.65,h)); float sun=pow(max(0.,dot(normalize(vPosition),normalize(vec3(-.23,.11,-1.)))),620.); c+=vec3(1.,.65,.25)*sun; gl_FragColor=vec4(c,1.);}'} />
    </mesh>
    <fog attach="fog" args={['#b45a38', 70, 255]} />
    <hemisphereLight args={['#ffc58f', '#594347', 2.1]} />
    <directionalLight position={[-30, 35, -80]} intensity={3.4} color="#ffab64" />
    {Array.from({ length: 46 }, (_, i) => {
      const s = i * 25 - 60; const side = i % 2 ? 1 : -1;
      const height = 12 + (Math.sin(i * 13.7) + 1) * 18;
      return <mesh key={i} position={[side * (90 + Math.sin(i) * 30), height / 2 - 4, -s]} rotation={[0, i * .7, .12]}><coneGeometry args={[30 + i % 5 * 5, height, 5]} /><meshStandardMaterial color={i % 3 ? '#624039' : '#81503a'} flatShading /></mesh>;
    })}
  </>;
}
