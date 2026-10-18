import { Component, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { MathUtils, Vector3 } from 'three';
import Road from '../components/environment/Road';
import Atmosphere from '../components/environment/Atmosphere';
import Scenery from '../components/roadside/Scenery';
import Charger from '../components/car/Charger';
import { carAsset } from '../data/assets';
import { JOURNEY_LENGTH, roadX } from '../data/journey';
class ModelBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch() { this.props.onError('Não foi possível abrir o modelo. A estrada continua disponível.'); }
  render() { return this.state.error ? null : this.props.children; }
}
export class SceneBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? <div className="scene-fallback"><span>O horizonte continua aqui.</span><p>Não foi possível iniciar a cena 3D. Tente um navegador com WebGL habilitado ou explore The Making Of.</p></div> : this.props.children; }
}
function JourneyRig({ progress, targetProgress, reduced, onModelError, onModelReady, quality }) {
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => { invalidate(); }, [targetProgress, reduced, quality, invalidate]);
  const distance = useRef(0), car = useRef(), fill = useRef();
  const look = useRef(new Vector3()), position = useRef(new Vector3());
  useFrame(({ camera }, dt) => {
    const amount = reduced ? 1 : 1 - Math.exp(-Math.min(dt, .05) * 5);
    distance.current = MathUtils.lerp(distance.current, progress.current * JOURNEY_LENGTH, amount);
    if (!reduced && Math.abs(distance.current - progress.current * JOURNEY_LENGTH) > .001) invalidate();
    const s = distance.current;
    const sweep = reduced ? 0 : Math.sin(s / 80) * 2.4;
    position.current.set(roadX(s - 8) + 4.2 + sweep, 3.3 + Math.sin(s / 120) * .35, -s + 8.5);
    camera.position.copy(position.current);
    look.current.set(roadX(s + 10) + 2.5, 1.2, -s - 10); camera.lookAt(look.current);
    car.current.position.set(roadX(s) + 2.5, .025, -s);
    car.current.rotation.y = -Math.atan((roadX(s + .1) - roadX(s - .1)) / .2);
    fill.current.position.set(roadX(s) + 1, 7, -s + 2);
    fill.current.target = car.current;
  });
  return <>
    <group ref={car}><ModelBoundary onError={onModelError}><Suspense fallback={null}>{carAsset.url && <Charger distance={distance} onReady={onModelReady} />}</Suspense></ModelBoundary></group>
    <spotLight ref={fill} intensity={220} distance={24} angle={.85} penumbra={.75} decay={2} color="#ffe3c0" castShadow={quality === 'high'} shadow-mapSize={[512,512]} />
  </>;
}
export default function HighwayScene({ progress, targetProgress, reduced, quality, onModelError, onModelReady }) {
  return <SceneBoundary><Canvas frameloop="demand" shadows={quality === 'high'} dpr={quality === 'high' ? [1, 1.5] : 1} camera={{ position: [2.5, 4.1, 11], fov: 55, near: .1, far: 1000 }} gl={{ antialias: quality === 'high', powerPreference: 'high-performance' }} fallback={<div className="scene-fallback">WebGL indisponível. The Making Of continua acessível.</div>}>
    <Atmosphere /><Road /><Scenery />
    <Environment resolution={64}><color attach="background" args={['#625853']} /><Lightformer intensity={2.5} color="#f6e6d4" scale={[18, 9, 1]} position={[2, 5, 12]} rotation={[0, Math.PI, 0]} /><Lightformer form="rect" intensity={3} color="#ffe4bf" scale={[15, 6, 1]} position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} /><Lightformer intensity={2} color="#ff592d" scale={[20, 4, 1]} position={[-10, 3, -8]} rotation={[0, Math.PI / 2, 0]} /></Environment>
    <JourneyRig progress={progress} targetProgress={targetProgress} reduced={reduced} quality={quality} onModelError={onModelError} onModelReady={onModelReady} />
  </Canvas></SceneBoundary>;
}
