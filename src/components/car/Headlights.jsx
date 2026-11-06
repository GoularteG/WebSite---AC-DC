import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DoubleSide,
  Object3D,
  SRGBColorSpace,
} from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { infernoMix } from '../../data/finale';

RectAreaLightUniformsLib.init();

// Exact headlight coordinates measured from charger-1970-original.glb (Mesh 12 lenses & Mesh 10 reflectors):
// Outer-Left:  x = -0.6863, y = 0.5738, z = -2.472
// Inner-Left:  x = -0.5139, y = 0.5738, z = -2.472  -> Left pair center:  x = -0.600, y = 0.574, z = -2.58
// Inner-Right: x =  0.5187, y = 0.5738, z = -2.472
// Outer-Right: x =  0.6911, y = 0.5738, z = -2.472  -> Right pair center: x =  0.605, y = 0.574, z = -2.58
const HEADLIGHT_Y = 0.574;
const LENS_Z = -2.48;
const BEAM_ORIGIN_Z = -2.58;
const LEFT_PAIR_X = -0.6;
const RIGHT_PAIR_X = 0.605;
const BULB_X = [-0.6863, -0.5139, 0.5187, 0.6911];

// Exact rear taillight bar coordinates measured from Mesh 9 (Color_A06) of charger-1970-original.glb:
// Left bar:  x in [-0.8007, -0.1468] (width 0.654m, center -0.474), y in [0.6657, 0.7145] (center 0.690)
// Right bar: x in [ 0.1417,  0.7957] (width 0.654m, center  0.469), y in [0.6652, 0.7145] (center 0.690)
const TAILLIGHT_Y = 0.69;
const TAILLIGHT_Z = 2.524;
const TAILLIGHT_BARS = [
  { key: 'left', x: -0.474, rotY: -0.039 },
  { key: 'right', x: 0.469, rotY: 0.039 },
];

const GROUND_PLANE_WIDTH = 16;
const GROUND_PLANE_LENGTH = 28;

const smoothstep = (min, max, value) => {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return t * t * (3 - 2 * t);
};

const volumetricVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormalView;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormalView = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const volumetricFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormalView;
  varying vec3 vViewDir;
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    // vUv.y = 1.0 at the headlight lens, 0.0 at the far end of the cone
    float dist = 1.0 - vUv.y;

    // Starts right at the headlight lens and fades out in a smooth gradient
    float nearFade = smoothstep(0.0, 0.06, dist);
    float farFade = pow(max(0.0, 1.0 - dist), 2.4);
    float longitudinal = nearFade * farFade;

    // Fresnel edge fade prevents any geometric cylinder lines
    float fresnel = abs(dot(normalize(vNormalView), normalize(vViewDir)));
    float edgeSoftness = pow(fresnel, 2.3);

    float alpha = longitudinal * edgeSoftness * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function createAlignedGroundGradientTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(size, size);
  const { data } = image;

  const halfWidth = GROUND_PLANE_WIDTH / 2;
  const leftOriginU = LEFT_PAIR_X / halfWidth;   // -0.075
  const rightOriginU = RIGHT_PAIR_X / halfWidth; // +0.0756

  for (let py = 0; py < size; py++) {
    // t = 0 right at the front bumper (z = -2.6), t = 1 far ahead (z = -30.6)
    const t = 1 - py / (size - 1);

    const nearFade = smoothstep(0.0, 0.06, t);
    const farFade = Math.pow(Math.max(0, 1 - t), 2.15);
    const longitudinal = nearFade * farFade;

    // Beams start aligned with the left and right headlights and fan out into a soft cone
    const leftCenter = leftOriginU - t * 0.025;
    const rightCenter = rightOriginU + t * 0.025;
    const beamSigma = 0.024 + t * 0.34;

    for (let px = 0; px < size; px++) {
      const u = (px / (size - 1)) * 2 - 1;
      const borderFade = smoothstep(1.0, 0.7, Math.abs(u));

      const dLeft = (u - leftCenter) / beamSigma;
      const dRight = (u - rightCenter) / beamSigma;

      const leftVal = Math.exp(-dLeft * dLeft * 1.9);
      const rightVal = Math.exp(-dRight * dRight * 1.9);

      // Soft overlap between left and right headlight cones
      const lateral = Math.min(1, leftVal * 0.72 + rightVal * 0.72);
      const intensity = Math.min(1, longitudinal * lateral * borderFade);
      const smoothIntensity = intensity * (0.45 + 0.55 * intensity);

      const r = Math.round(255 * Math.min(1, smoothIntensity * 1.05));
      const g = Math.round(226 * smoothIntensity);
      const b = Math.round(172 * Math.pow(smoothIntensity, 1.1));
      const a = Math.round(255 * smoothIntensity * 0.3);

      const idx = (py * size + px) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = a;
    }
  }

  ctx.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

// Rectangular SDF (Signed Distance Field) glow texture:
// Constant brightness along the entire horizontal bar width, with a soft rectangular box-fade at the 4 edges.
function createTaillightGlowTexture() {
  const width = 256;
  const height = 64;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(width, height);
  const { data } = image;

  const boxHalfW = 0.76;
  const boxHalfH = 0.34;

  for (let py = 0; py < height; py++) {
    const v = (py / (height - 1)) * 2 - 1;
    const dy = Math.max(0, Math.abs(v) - boxHalfH) / (1 - boxHalfH);

    for (let px = 0; px < width; px++) {
      const u = (px / (width - 1)) * 2 - 1;
      const dx = Math.max(0, Math.abs(u) - boxHalfW) / (1 - boxHalfW);

      // Rectangular distance from the uniform inner bar
      const distSq = dx * dx + dy * dy;
      const halo = Math.exp(-distSq * 3.1);

      // Crisp inner rectangular plateau (uniform across the entire width of the lamp)
      const coreX = 1 - smoothstep(boxHalfW - 0.04, boxHalfW + 0.09, Math.abs(u));
      const coreY = 1 - smoothstep(boxHalfH - 0.08, boxHalfH + 0.18, Math.abs(v));
      const core = coreX * coreY;

      const combined = Math.min(1, halo * 0.72 + core * 0.96);

      const r = 255;
      const g = Math.round(24 * halo + 92 * core);
      const b = Math.round(8 * halo + 32 * core);
      const a = Math.round(255 * combined * 0.94);

      const idx = (py * width + px) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = a;
    }
  }

  ctx.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export default function Headlights({ distance, groundProjection = true }) {
  const leftSpot = useRef();
  const rightSpot = useRef();
  const leftTarget = useMemo(() => new Object3D(), []);
  const rightTarget = useMemo(() => new Object3D(), []);
  const baseColor = useMemo(() => new Color('#ffe9bf'), []);
  const hellColor = useMemo(() => new Color('#ffb870'), []);

  const groundTexture = useMemo(() => createAlignedGroundGradientTexture(), []);
  const taillightGlowTexture = useMemo(() => createTaillightGlowTexture(), []);

  const beamConeGeo = useMemo(() => {
    const beamLength = 22;
    // Top radius 0.11m matches the recessed grille height ( stays below the 0.702m hood edge )
    const cone = new CylinderGeometry(0.11, 2.2, beamLength, 36, 1, true);
    cone.translate(0, -beamLength / 2, 0);
    return cone;
  }, []);

  const beamUniforms = useMemo(
    () => ({
      uColor: { value: new Color('#ffebc2') },
      uOpacity: { value: 0.13 },
    }),
    []
  );

  useEffect(() => {
    if (leftSpot.current) leftSpot.current.target = leftTarget;
    if (rightSpot.current) rightSpot.current.target = rightTarget;
  }, [leftTarget, rightTarget]);

  useEffect(
    () => () => {
      groundTexture.dispose();
      taillightGlowTexture.dispose();
      beamConeGeo.dispose();
    },
    [groundTexture, taillightGlowTexture, beamConeGeo]
  );

  useFrame(() => {
    const s = distance?.current ?? 0;
    const mix = infernoMix(s);
    if (leftSpot.current && rightSpot.current) {
      leftSpot.current.color.lerpColors(baseColor, hellColor, mix * 0.6);
      rightSpot.current.color.lerpColors(baseColor, hellColor, mix * 0.6);
    }
  });

  // Slight downward pitch so the beam stays below the hood line and sweeps the asphalt
  const beamPitch = Math.PI / 2 - 0.022;

  return (
    <group name="charger-headlights">
      {/* Targets aligned straight ahead of each headlight pair */}
      <primitive object={leftTarget} position={[LEFT_PAIR_X - 0.35, -0.35, -36]} />
      <primitive object={rightTarget} position={[RIGHT_PAIR_X + 0.35, -0.35, -36]} />

      {/* Left & Right SpotLights positioned at the exact headlight grille coordinates */}
      <spotLight
        ref={leftSpot}
        position={[LEFT_PAIR_X, HEADLIGHT_Y, BEAM_ORIGIN_Z]}
        intensity={95}
        distance={72}
        angle={0.68}
        penumbra={1}
        decay={1.55}
        color="#ffe9bf"
      />
      <spotLight
        ref={rightSpot}
        position={[RIGHT_PAIR_X, HEADLIGHT_Y, BEAM_ORIGIN_Z]}
        intensity={95}
        distance={72}
        angle={0.68}
        penumbra={1}
        decay={1.55}
        color="#ffe9bf"
      />

      {/* Emissive headlight lenses placed at the exact 4 bulb centers of the 3D Charger model */}
      {BULB_X.map(x => (
        <mesh key={x} position={[x, HEADLIGHT_Y, LENS_Z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.02, 16]} />
          <meshBasicMaterial color="#fff2d0" transparent opacity={0.85} toneMapped={false} />
        </mesh>
      ))}

      {/* Left & Right volumetric cones anchored inside the left and right headlight bezels */}
      {[LEFT_PAIR_X, RIGHT_PAIR_X].map((x, idx) => (
        <mesh
          key={`cone-${x}`}
          geometry={beamConeGeo}
          position={[x, HEADLIGHT_Y, BEAM_ORIGIN_Z]}
          rotation={[beamPitch, (idx === 0 ? 1 : -1) * 0.012, 0]}
          renderOrder={2}
        >
          <shaderMaterial
            vertexShader={volumetricVertexShader}
            fragmentShader={volumetricFragmentShader}
            uniforms={beamUniforms}
            transparent
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
      ))}

      {/* Rear Taillights Assembly: two uniform rectangular tail bars, strictly bounded inside the rear bezel so no light leaks to the sides */}
      <group name="charger-taillights">
        {TAILLIGHT_BARS.map(({ key, x, rotY }) => (
          <group key={key} position={[x, TAILLIGHT_Y, TAILLIGHT_Z]} rotation={[0, rotY, 0]}>
            {/* Outer rectangular crimson taillight lens */}
            <mesh>
              <boxGeometry args={[0.65, 0.054, 0.016]} />
              <meshBasicMaterial color="#ff2008" toneMapped={false} />
            </mesh>
            {/* Uniform full-width inner bright rectangular filament bar */}
            <mesh position={[0, 0, 0.002]}>
              <boxGeometry args={[0.62, 0.03, 0.018]} />
              <meshBasicMaterial color="#ff6e48" toneMapped={false} />
            </mesh>
            {/* Tight rectangular halo glow bounded strictly inside the rear bezel (width 0.70m stays within |x| <= 0.824m < 0.884m fender edge) */}
            <mesh position={[0, 0, 0.014]} renderOrder={2}>
              <planeGeometry args={[0.7, 0.14]} />
              <meshBasicMaterial
                map={taillightGlowTexture}
                transparent
                opacity={0.94}
                blending={AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            {/* Subtle rectangular reflection on the sloped lower bumper lip right below the taillight */}
            <mesh position={[0, -0.035, 0.025]} rotation={[-0.78, 0, 0]} renderOrder={2}>
              <planeGeometry args={[0.64, 0.046]} />
              <meshBasicMaterial
                map={taillightGlowTexture}
                transparent
                opacity={0.18}
                blending={AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            {/* Subtle rectangular reflection on the upper recessed bezel overhang */}
            <mesh position={[0, 0.031, 0.022]} rotation={[0.72, 0, 0]} renderOrder={2}>
              <planeGeometry args={[0.64, 0.032]} />
              <meshBasicMaterial
                map={taillightGlowTexture}
                transparent
                opacity={0.11}
                blending={AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            {/* Outward-only (+Z) low-intensity rectangular area light so light never bleeds forward into the side panels */}
            <rectAreaLight
              position={[0, 0, 0.015]}
              rotation={[0.38, Math.PI, 0]}
              width={0.6}
              height={0.045}
              intensity={2.2}
              color="#ff1a0a"
            />
          </group>
        ))}
      </group>

      {/* Ground light projection starting right at the front bumper (z = -2.6) aligned with both headlights */}
      {groundProjection && <mesh
        position={[0, 0.008, -(2.6 + GROUND_PLANE_LENGTH / 2)]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1}
      >
        <planeGeometry args={[GROUND_PLANE_WIDTH, GROUND_PLANE_LENGTH]} />
        <meshBasicMaterial
          map={groundTexture}
          transparent
          opacity={0.5}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>}
    </group>
  );
}
