import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { BackSide, Color } from 'three';
import { infernoMix } from '../../data/finale';
import DesertLandscape from './DesertLandscape';

const AUDIO_PULSE_EVENT = 'highway:audio-pulse';
const smooth = (start, end, value) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

const skyVertex = `varying vec3 vDirection;
  void main() { vDirection = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;
const skyFragment = `varying vec3 vDirection;
  uniform float dusk; uniform float inferno; uniform float thunder; uniform float pulse;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
               mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
  }
  void main() {
    vec3 dir = normalize(vDirection);
    float h = dir.y;
    vec3 horizon = mix(vec3(.77, .58, .39), vec3(.48, .34, .33), dusk);
    vec3 upper = mix(vec3(.18, .26, .32), vec3(.055, .065, .105), dusk);
    horizon = mix(horizon, vec3(.93, .06, .018), inferno);
    upper = mix(upper, vec3(.13, .008, .02), inferno);
    vec3 color = mix(horizon, upper, smoothstep(-.08, .75, h));

    // Broken cloud bands add depth without transparent planes or particles.
    vec2 cloudUv = vec2(atan(dir.x, -dir.z) * 5.2, h * 13.);
    float cloud = noise(cloudUv) * .63 + noise(cloudUv * 2.1) * .37;
    float band = smoothstep(.05, .18, h) * (1. - smoothstep(.54, .76, h));
    color *= 1. - smoothstep(.53, .78, cloud) * band * mix(.14, .28, dusk);

    float sunDot = dot(dir, normalize(vec3(-.23, .115, -1.)));
    float halo = pow(max(0., sunDot), 60.);
    float disc = pow(max(0., sunDot), 850.);
    color += vec3(1., .39, .12) * (halo * .24 + disc * 1.15) * (1. - dusk * .6);
    color += vec3(.17, .016, .003) * inferno * exp(-abs(h - .025) * 13.);

    // One scroll-positioned strike near the Thunderstruck chapter.
    float boltX = .42 + .035 * sin(h * 31.) + .018 * sin(h * 78.);
    float bolt = (1. - smoothstep(.002, .009, abs(dir.x - boltX)))
      * smoothstep(.09, .12, h) * (1. - smoothstep(.56, .59, h)) * step(dir.z, -.4);
    color += vec3(.6, .76, 1.) * (bolt * 1.5 + .055) * thunder;

    // Bass energy warms only the distant horizon; silence leaves a complete scene.
    color += vec3(.13, .045, .018) * pulse * exp(-abs(h - .05) * 11.);
    gl_FragColor = vec4(color, 1.);
  }`;

export default function Atmosphere({ distance, ghostActive = false, reduced = false }) {
  const sky = useRef(), skyMaterial = useRef(), fog = useRef(), sun = useRef(), ambient = useRef();
  const pulse = useRef(0);
  const invalidate = useThree(state => state.invalidate);
  const uniforms = useMemo(() => ({
    dusk: { value: 0 }, inferno: { value: 0 }, thunder: { value: 0 }, pulse: { value: 0 },
  }), []);
  const colors = useMemo(() => ({
    fogStart: new Color('#b59c84'), fogDusk: new Color('#847579'), fogHell: new Color('#82130b'),
    sunStart: new Color('#ffe0b1'), sunDusk: new Color('#e7a079'), sunHell: new Color('#ff4b16'),
    skyStart: new Color('#c7d4dd'), skyDusk: new Color('#a9abc1'), skyHell: new Color('#f79150'),
    groundStart: new Color('#796047'), groundDusk: new Color('#403b43'), groundHell: new Color('#351522'),
  }), []);
  useEffect(() => {
    const update = event => {
      pulse.current = reduced ? 0 : event.detail;
      invalidate();
    };
    addEventListener(AUDIO_PULSE_EVENT, update);
    return () => removeEventListener(AUDIO_PULSE_EVENT, update);
  }, [invalidate, reduced]);
  useFrame(({ camera }) => {
    const travelled = ghostActive ? -camera.position.z : distance.current;
    const dusk = smooth(95, 550, travelled);
    const inferno = infernoMix(travelled);
    const thunder = reduced ? 0 : smooth(397, 410, travelled) * (1 - smooth(422, 435, travelled));
    sky.current.position.copy(camera.position);
    skyMaterial.current.uniforms.dusk.value = dusk;
    skyMaterial.current.uniforms.inferno.value = inferno;
    skyMaterial.current.uniforms.thunder.value = thunder;
    skyMaterial.current.uniforms.pulse.value = pulse.current * (1 - inferno * .5);
    fog.current.color.copy(colors.fogStart).lerp(colors.fogDusk, dusk).lerp(colors.fogHell, inferno);
    fog.current.far = ghostActive ? 1500 : 325 - inferno * 95;
    sun.current.color.copy(colors.sunStart).lerp(colors.sunDusk, dusk).lerp(colors.sunHell, inferno);
    sun.current.intensity = 2.7 - dusk * .75 + inferno * 1.4;
    ambient.current.color.copy(colors.skyStart).lerp(colors.skyDusk, dusk).lerp(colors.skyHell, inferno);
    ambient.current.groundColor.copy(colors.groundStart).lerp(colors.groundDusk, dusk).lerp(colors.groundHell, inferno);
    ambient.current.intensity = 1.15 - dusk * .1 + inferno * 1.05;
  });
  return <>
    <mesh ref={sky} renderOrder={-1}>
      <sphereGeometry args={[700, 24, 16]} />
      <shaderMaterial ref={skyMaterial} side={BackSide} depthWrite={false} uniforms={uniforms} vertexShader={skyVertex} fragmentShader={skyFragment} />
    </mesh>
    <fog ref={fog} attach="fog" args={['#b59c84', 80, 325]} />
    <hemisphereLight ref={ambient} args={['#c7d4dd', '#796047', 1.15]} />
    <directionalLight ref={sun} position={[-60, 35, -100]} intensity={2.7} color="#ffe0b1" />
    <DesertLandscape />
  </>;
}
