import { Component, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { MathUtils, Vector3 } from 'three';
import Road from '../components/environment/Road';
import Atmosphere from '../components/environment/Atmosphere';
import InfernoFinale from '../components/environment/InfernoFinale';
import Scenery from '../components/roadside/Scenery';
import { TrunkCamera } from '../components/trunk/TrunkCamera';
import Charger from '../components/car/Charger';
import { carAsset } from '../data/assets';
import { distanceAtProgress, roadX } from '../data/journey';
import { arrivalMix, FINAL_STOP_DISTANCE, infernoMix } from '../data/finale';
const cameraConfig = { position: [2.5, 4.1, 11], fov: 55, near: .1, far: 1000 };
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
function JourneyRig({ phase, onZoomed, onReturned, distance, progress, targetProgress, reduced, onModelError, onModelReady, onArrival, quality }) {
  const invalidate = useThree(state => state.invalidate);
  const width = useThree(state => state.size.width);
  useEffect(() => { invalidate(); }, [phase, targetProgress, reduced, quality, width, invalidate]);
  const car = useRef(), fill = useRef(), arrived = useRef(false);
  const look = useRef(new Vector3()), position = useRef(new Vector3()), finalPosition = useRef(new Vector3());
  useFrame(({ camera }, dt) => {
    const amount = reduced ? 1 : 1 - Math.exp(-Math.min(dt, .05) * 5);
    const targetDistance = distanceAtProgress(progress.current);
    if (phase === 'road') distance.current = MathUtils.lerp(distance.current, targetDistance, amount);
    if (phase === 'road' && Math.abs(distance.current - targetDistance) <= .001) distance.current = targetDistance;
    if (phase === 'road' && !reduced && Math.abs(distance.current - targetDistance) > .001) invalidate();
    const s = distance.current;
    const arrival = arrivalMix(s);
    const sweep = reduced ? 0 : Math.sin(s / 80) * 2.4;
    position.current.set(roadX(s - 8) + 4.2 + sweep, 3.3 + Math.sin(s / 120) * .35, -s + 8.5);
    if (width < 761) position.current.set(roadX(s) + 2.5, 3.6, -s + 10.5);
    // Open the frame at arrival, keeping the original lane/vehicle transform.
    finalPosition.current.set(roadX(s) + (width < 761 ? -2 : -1.8), width < 761 ? 8.5 : 7.4, -s + (width < 761 ? 32 : 22));
    const fov=MathUtils.lerp(55,width<761?65:55,arrival);
    if(Math.abs(camera.fov-fov)>.001){camera.fov=fov;camera.updateProjectionMatrix();}
    position.current.lerp(finalPosition.current, arrival);
    camera.position.copy(position.current);
    look.current.set(roadX(s + 10) + 2.5, 1.2, -s - 10);
    if (width < 761) look.current.set(roadX(s) + 2.5, 1.2, -s - 3);
    finalPosition.current.set(roadX(s + 22) + 1, 6.1, -s - 22);
    look.current.lerp(finalPosition.current, arrival);
    camera.lookAt(look.current);
    car.current.position.set(roadX(s) + 2.5, .025, -s);
    car.current.rotation.y = -Math.atan((roadX(s + .1) - roadX(s - .1)) / .2);
    fill.current.position.set(roadX(s) + 1, 7, -s + 2);
    fill.current.target = car.current;
    fill.current.color.setRGB(1, .77 - infernoMix(s) * .23, .53 - infernoMix(s) * .3);
    const nextArrived = s >= FINAL_STOP_DISTANCE - .4;
    if (arrived.current !== nextArrived) { arrived.current = nextArrived; onArrival(nextArrived); }
  }, -2);
  useEffect(() => { onArrival(false); return () => onArrival(false); }, [onArrival]);
  return <>
    <TrunkCamera phase={phase} car={car} roadLook={look} reduced={reduced} onZoomed={onZoomed} onReturned={onReturned}/>
    <group name="journey-car" ref={car}><ModelBoundary onError={onModelError}><Suspense fallback={null}>{carAsset.url && <Charger distance={distance} onReady={onModelReady} />}</Suspense></ModelBoundary></group>
    <spotLight ref={fill} intensity={220} distance={24} angle={.85} penumbra={.75} decay={2} color="#ffe3c0" castShadow={quality === 'high'} shadow-mapSize={[512,512]} />
  </>;
}
export default function HighwayScene({ phase, onZoomed, onReturned, progress, targetProgress, reduced, quality, onModelError, onModelReady, onArrival }) {
  const distance = useRef(0);
  return <SceneBoundary><Canvas frameloop={phase === 'trunk' ? 'never' : 'demand'} shadows={quality === 'high'} dpr={quality === 'high' ? [1, 1.5] : 1} camera={cameraConfig} gl={{ antialias: quality === 'high', powerPreference: 'high-performance' }} fallback={<div className="scene-fallback">WebGL indisponível. The Making Of continua acessível.</div>}>
    <Atmosphere distance={distance} /><Road distance={distance} /><Scenery />
    <InfernoFinale distance={distance} quality={quality} reduced={reduced} />
    <Environment resolution={64}><color attach="background" args={['#625853']} /><Lightformer intensity={2.5} color="#f6e6d4" scale={[18, 9, 1]} position={[2, 5, 12]} rotation={[0, Math.PI, 0]} /><Lightformer form="rect" intensity={3} color="#ffe4bf" scale={[15, 6, 1]} position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} /><Lightformer intensity={2} color="#ff592d" scale={[20, 4, 1]} position={[-10, 3, -8]} rotation={[0, Math.PI / 2, 0]} /></Environment>
    <JourneyRig phase={phase} onZoomed={onZoomed} onReturned={onReturned} distance={distance} progress={progress} targetProgress={targetProgress} reduced={reduced} quality={quality} onModelError={onModelError} onModelReady={onModelReady} onArrival={onArrival} />
  </Canvas></SceneBoundary>;
}
