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
  uniform float dusk; uniform float inferno; uniform float thunder; uniform float pulse; uniform float strike; uniform float drift;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
               mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
  }
  void main() {
    vec3 dir = normalize(vDirection);
    float h = dir.y;
    vec3 horizon = mix(vec3(.67, .38, .22), vec3(.43, .16, .13), dusk);
    vec3 upper = mix(vec3(.12, .15, .20), vec3(.035, .026, .06), dusk);
    horizon = mix(horizon, vec3(.93, .06, .018), inferno);
    upper = mix(upper, vec3(.13, .008, .02), inferno);
    vec3 color = mix(horizon, upper, smoothstep(-.08, .75, h));

    // Three noise octaves on the existing sky dome: no cloud meshes or extra passes.
    vec2 cloudUv = vec2(atan(dir.x, -dir.z) * 3.8 + drift, h * 8.);
    float cloud = noise(cloudUv) * .57 + noise(cloudUv * 2.03) * .29 + noise(cloudUv * 4.1) * .14;
    float band = smoothstep(.015, .14, h) * (1. - smoothstep(.72, .96, h));
    float mass = smoothstep(.36, .66, cloud) * band;
    color = mix(color, mix(vec3(.075,.065,.085), vec3(.085,.018,.025), inferno), mass * (.65 + dusk * .22));
    float rim = exp(-abs(cloud - .46) * 32.) * band;
    color += vec3(.26,.075,.018) * rim * (.35 + dusk * .4 + inferno * .5);

    float sunDot = dot(dir, normalize(vec3(-.23, .115, -1.)));
    float halo = pow(max(0., sunDot), 60.);
    float disc = pow(max(0., sunDot), 850.);
    color += vec3(1., .39, .12) * (halo * .24 + disc * 1.15) * (1. - dusk * .6);
    color += vec3(.17, .016, .003) * inferno * exp(-abs(h - .025) * 13.);

    // Angular forked lightning and a local glow inside the cloud bank.
    float boltX = strike + .028 * sin(h * 37.) + .014 * sin(h * 91.);
    float trunk = 1. - smoothstep(.0015, .005, abs(dir.x - boltX));
    float branchX = boltX + (.37 - h) * .39;
    float branch = (1. - smoothstep(.001, .003, abs(dir.x - branchX)))
      * smoothstep(.13,.18,h) * (1. - smoothstep(.34,.38,h));
    float bolt = max(trunk, branch * .65) * smoothstep(.08,.12,h)
      * (1. - smoothstep(.56,.62,h)) * step(dir.z,-.4);
    float glow = exp(-pow((dir.x-strike)*4.,2.) - pow((h-.38)*5.,2.)) * band;
    color += mix(vec3(.50,.60,.82),vec3(.85,.32,.18),inferno*.55)
      * (bolt * 1.25 + glow * .16) * thunder;

    // Bass energy warms only the distant horizon; silence leaves a complete scene.
    color += vec3(.24, .09, .032) * pulse * exp(-abs(h - .09) * 4.2);
    gl_FragColor = vec4(color, 1.);
  }`;

export default function Atmosphere({ distance, ghostActive = false, reduced = false }) {
  const sky = useRef(), skyMaterial = useRef(), fog = useRef(), sun = useRef(), ambient = useRef();
  const pulse = useRef(0);
  const storm = useRef({ flash: 0, lastStrike: -10000, zone: -1, x: .32, energy: 0 });
  const invalidate = useThree(state => state.invalidate);
  const uniforms = useMemo(() => ({
    dusk: { value: 0 }, inferno: { value: 0 }, thunder: { value: 0 }, pulse: { value: 0 }, strike: { value: .32 }, drift: { value: 0 },
  }), []);
  const colors = useMemo(() => ({
    fogStart: new Color('#b59c84'), fogDusk: new Color('#847579'), fogHell: new Color('#82130b'),
    sunStart: new Color('#ffe0b1'), sunDusk: new Color('#e7a079'), sunHell: new Color('#ff4b16'),
    skyStart: new Color('#c7d4dd'), skyDusk: new Color('#a9abc1'), skyHell: new Color('#f79150'),
    groundStart: new Color('#796047'), groundDusk: new Color('#403b43'), groundHell: new Color('#351522'),
  }), []);
  useEffect(() => {
    const update = event => {
      pulse.current = reduced ? 0 : (Number.isFinite(event.detail) ? event.detail : 0);
      invalidate();
    };
    const beat = () => {
      const now = performance.now();
      const state = storm.current;
      if (reduced || document.hidden || now - state.lastStrike < 4200) return;
      state.flash = .55;
      state.lastStrike = now;
      state.x = Math.sin(distance.current * .037) * .48;
      invalidate();
    };
    addEventListener(AUDIO_PULSE_EVENT, update);
    addEventListener('highway:audio-beat', beat);
    return () => { removeEventListener(AUDIO_PULSE_EVENT, update); removeEventListener('highway:audio-beat', beat); };
  }, [invalidate, reduced]);
  useFrame(({ camera }, delta) => {
    const travelled = ghostActive ? -camera.position.z : distance.current;
    const dusk = smooth(95, 550, travelled);
    const inferno = infernoMix(travelled);
    const state = storm.current;
    const zone = Math.floor(Math.max(0, travelled - 65) / 72);
    const now = performance.now();
    if (zone !== state.zone) {
      state.zone = zone;
      if (!reduced && travelled > 65 && now - state.lastStrike > 4200) {
        state.flash = .38 + dusk * .25 + inferno * .18;
        state.lastStrike = now;
        state.x = Math.sin(zone * 2.37) * .5;
      }
    }
    const dt = Math.min(delta, .05);
    state.flash = reduced ? 0 : state.flash * Math.exp(-dt * 7);
    state.energy += ((reduced ? 0 : pulse.current) - state.energy) * (1 - Math.exp(-dt * 9));
    if (state.flash > .003 || Math.abs(state.energy - pulse.current) > .005 && !reduced) invalidate();
    const thunder = state.flash;
    sky.current.position.copy(camera.position);
    skyMaterial.current.uniforms.dusk.value = dusk;
    skyMaterial.current.uniforms.inferno.value = inferno;
    skyMaterial.current.uniforms.thunder.value = thunder;
    skyMaterial.current.uniforms.pulse.value = state.energy * .45 * (1 - inferno * .5);
    skyMaterial.current.uniforms.strike.value = state.x;
    skyMaterial.current.uniforms.drift.value = travelled * .0007;
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
