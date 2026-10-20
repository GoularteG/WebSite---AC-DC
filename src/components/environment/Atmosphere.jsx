import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, Color } from 'three';
import { infernoMix } from '../../data/finale';
import { roadX } from '../../data/journey';
export default function Atmosphere({ distance, ghostActive = false }) {
  const sky = useRef(), skyMaterial = useRef(), fog = useRef(), sun = useRef(), ambient = useRef();
  const uniforms = useMemo(() => ({ inferno: { value: 0 } }), []);
  const colors = useMemo(() => ['#b45a38','#82130b','#ffab64','#ff4b16','#ffc58f','#f79150','#594347','#351522'].map(c=>new Color(c)), []);
  useFrame(({ camera }) => {
    const mix = infernoMix(ghostActive ? -camera.position.z : distance.current);
    sky.current.position.copy(camera.position);
    skyMaterial.current.uniforms.inferno.value = mix;
    fog.current.color.lerpColors(colors[0],colors[1],mix);
    fog.current.far = ghostActive ? 1500 : 255 - mix * 25;
    sun.current.color.lerpColors(colors[2],colors[3],mix);
    ambient.current.color.lerpColors(colors[4],colors[5],mix);
    ambient.current.groundColor.lerpColors(colors[6],colors[7],mix);
  });
  return <>
    <mesh ref={sky} renderOrder={-1}>
      <sphereGeometry args={[700, 24, 16]} />
      <shaderMaterial ref={skyMaterial} side={BackSide} depthWrite={false} uniforms={uniforms} vertexShader={'varying vec3 vPosition; void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}'} fragmentShader={'varying vec3 vPosition; uniform float inferno; void main(){vec3 dir=normalize(vPosition);float h=dir.y; vec3 horizon=mix(vec3(.96,.30,.085),vec3(1.,.018,.006),inferno); vec3 top=mix(vec3(.065,.035,.065),vec3(.12,.002,.012),inferno); vec3 c=mix(horizon,top,smoothstep(-.04,.65,h)); float sun=pow(max(0.,dot(dir,normalize(vec3(-.23,.11,-1.)))),620.); c+=mix(vec3(1.,.65,.25),vec3(1.,.16,.025),inferno)*sun; c+=vec3(.3,.025,.006)*inferno*exp(-abs(h-.035)*12.); gl_FragColor=vec4(c,1.);}'} />
    </mesh>
    <fog ref={fog} attach="fog" args={['#b45a38', 70, 255]} />
    <hemisphereLight ref={ambient} args={['#ffc58f', '#594347', 2.1]} />
    <directionalLight ref={sun} position={[-30, 35, -80]} intensity={3.4} color="#ffab64" />
    {Array.from({ length: 46 }, (_, i) => {
      const s = i * 25 - 60; const side = i % 2 ? 1 : -1;
      const height = 12 + (Math.sin(i * 13.7) + 1) * 18;
      return <mesh key={i} position={[roadX(s) + side * (95 + Math.sin(i) * 12), height / 2 - 4, -s]} rotation={[0, i * .7, .12]}><coneGeometry args={[30 + i % 5 * 5, height, 5]} /><meshStandardMaterial color={i % 3 ? '#624039' : '#81503a'} flatShading /></mesh>;
    })}
  </>;
}
