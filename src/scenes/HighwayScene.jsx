import { Component, Suspense, lazy, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { MathUtils, Vector3 } from 'three';
import Road from '../components/environment/Road';
import Atmosphere from '../components/environment/Atmosphere';
import InfernoFinale from '../components/environment/InfernoFinale';
import Scenery from '../components/roadside/Scenery';
import RoadLighting from '../components/roadside/RoadLighting';
import HistoryBillboards from '../components/roadside/HistoryBillboards';
import GhostCamera from '../components/ghost/GhostCamera';
import { TrunkCamera } from '../components/trunk/TrunkCamera';
import Charger from '../components/car/Charger';
import Headlights from '../components/car/Headlights';
import { carAsset } from '../data/assets';
import { distanceAtProgress, roadX } from '../data/journey';
import { arrivalMix, FINAL_STOP_DISTANCE, infernoMix } from '../data/finale';
const cameraConfig = { position: [2.5, 4.1, 11], fov: 55, near: .1, far: 1000 };
const GhostFinale = lazy(() => import('../components/ghost/GhostFinale'));
class ModelBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch() { this.props.onError?.('Não foi possível abrir o modelo. A estrada continua disponível.'); }
  render() { return this.state.error ? null : this.props.children; }
}
export class SceneBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? <div className="scene-fallback"><span>O horizonte continua aqui.</span><p>Não foi possível iniciar a cena 3D. Se houver outras abas do site abertas, feche-as e tente novamente.</p><button className="scene-retry" onClick={() => this.setState({ error: false })}>Tentar novamente ↻</button></div> : this.props.children; }
}
function JourneyRig({ started, phase, onZoomed, onReturned, distance, progress, targetProgress, reduced, onModelError, onModelReady, onArrival, quality, ghostActive }) {
  const invalidate = useThree(state => state.invalidate);
  const width = useThree(state => state.size.width);
  useEffect(() => { invalidate(); }, [started, phase, targetProgress, reduced, quality, width, ghostActive, invalidate]);
  const introMix = useRef(1);
  const introPosition = useRef(new Vector3()), introLook = useRef(new Vector3());
  const car = useRef(), fill = useRef(), arrived = useRef(false);
  const look = useRef(new Vector3()), position = useRef(new Vector3()), finalPosition = useRef(new Vector3());
  useFrame(({ camera }, dt) => {
    const amount = reduced ? 1 : 1 - Math.exp(-Math.min(dt, .05) * 5);
    const targetDistance = distanceAtProgress(progress.current);
    if (phase === 'road') distance.current = MathUtils.lerp(distance.current, targetDistance, amount);
    if (phase === 'road' && Math.abs(distance.current - targetDistance) <= .001) distance.current = targetDistance;
    if (phase === 'road' && !reduced && Math.abs(distance.current - targetDistance) > .001) invalidate();
    const s = distance.current;
    if (!ghostActive) {
      const arrival = arrivalMix(s);
      const sweep = reduced ? 0 : Math.sin(s / 80) * 2.4;
      position.current.set(roadX(s - 8) + 4.2 + sweep, 3.3 + Math.sin(s / 120) * .35, -s + 8.5);
      if (width < 761) position.current.set(roadX(s) + 2.5, 3.6, -s + 10.5);
      // Open the frame at arrival, keeping the original lane/vehicle transform.
      finalPosition.current.set(roadX(s) + (width < 761 ? -2 : -1.8), width < 761 ? 8.5 : 7.4, -s + (width < 761 ? 32 : 22));
      const fov=MathUtils.lerp(55,width<761?65:55,arrival);
      if(Math.abs(camera.fov-fov)>.001){camera.fov=fov;camera.updateProjectionMatrix();}
      position.current.lerp(finalPosition.current, arrival);
      const introTarget = started ? 0 : 1;
      introMix.current = reduced ? introTarget : MathUtils.damp(introMix.current, introTarget, 4, Math.min(dt,.05));
      if (Math.abs(introMix.current-introTarget)<.001) introMix.current=introTarget;
      else invalidate();
      const mobile = width < 761;
      introPosition.current.set(roadX(s)+2.5-4.5, 2.5, -s-6.5);
      introLook.current.set(roadX(s)+2.5-(mobile?0:1.85), mobile ? -.75 : 1.05, -s+(mobile?0:1.3));
      if (mobile) introPosition.current.set(roadX(s)+2.5-5.2, 3.2, -s-8.2);
      position.current.lerp(introPosition.current,introMix.current);
      camera.position.copy(position.current);
      look.current.set(roadX(s + 10) + 2.5, 1.2, -s - 10);
      if (width < 761) look.current.set(roadX(s) + 2.5, 1.2, -s - 3);
      finalPosition.current.set(roadX(s + 22) + 1, 6.1, -s - 22);
      look.current.lerp(finalPosition.current, arrival);
      look.current.lerp(introLook.current,introMix.current);
      camera.lookAt(look.current);
    }
    car.current.position.set(roadX(s) + 2.5, .025, -s);
    car.current.rotation.y = -Math.atan((roadX(s + .1) - roadX(s - .1)) / .2);
    fill.current.position.set(roadX(s) + 1, 7 - introMix.current * 2, -s + 2 - introMix.current * 4);
    fill.current.intensity = 80 + introMix.current * 55;
    fill.current.target = car.current;
    fill.current.color.setRGB(1, .77 - infernoMix(s) * .23, .53 - infernoMix(s) * .3);
    const nextArrived = s >= FINAL_STOP_DISTANCE - .4;
    if (arrived.current !== nextArrived) { arrived.current = nextArrived; onArrival(nextArrived); }
  }, -2);
  useEffect(() => { onArrival(false); return () => onArrival(false); }, [onArrival]);
  return <>
    <TrunkCamera phase={phase} car={car} roadLook={look} reduced={reduced} onZoomed={onZoomed} onReturned={onReturned}/>
    <group name="journey-car" ref={car}><Headlights distance={distance} /><ModelBoundary onError={onModelError}><Suspense fallback={null}>{carAsset.url && <Charger distance={distance} onReady={onModelReady} />}</Suspense></ModelBoundary></group>
    <spotLight ref={fill} intensity={80} distance={18} angle={.70} penumbra={.9} decay={2} color="#ffe3c0" castShadow={quality === 'high'} shadow-mapSize={[512,512]} />
  </>;
}
function QualitySampler({ onSample }) {
  const sample = useRef({ count: 0, elapsed: 0, lastReport: 0 });
  useFrame((_, delta) => {
    const state = sample.current;
    if (delta > .15) return; // Ignore tab suspension and asset compilation pauses.
    state.count++;
    state.elapsed += delta;
    if (state.count < 90 || state.elapsed < 3) return;
    const now = performance.now();
    if (now - state.lastReport > 12000) {
      onSample(state.count / state.elapsed);
      state.lastReport = now;
    }
    state.count = 0;
    state.elapsed = 0;
  });
  return null;
}
export default function HighwayScene({ phase, started, onZoomed, onReturned, progress, targetProgress, reduced, quality, onQualitySample, onModelError, onModelReady, onArrival, onSelectChapter, ghostActive, ghostControls, onGhostExit }) {
  const distance = useRef(0);
  return <SceneBoundary><Canvas frameloop={phase === 'trunk' ? 'never' : 'demand'} shadows={quality === 'high'} dpr={ghostActive ? 1 : quality === 'high' ? [1, 1.5] : quality === 'balanced' ? [1, 1.2] : 1} camera={cameraConfig} gl={{ antialias: true, powerPreference: 'high-performance' }} fallback={<div className="scene-fallback">WebGL indisponível. The Making Of continua acessível.</div>}>
    <Atmosphere distance={distance} ghostActive={ghostActive} reduced={reduced} /><Road distance={distance} ghostActive={ghostActive} /><Scenery started={started} targetProgress={targetProgress} /><RoadLighting distance={distance} ghostActive={ghostActive} />{started && <HistoryBillboards targetProgress={targetProgress} onSelect={ghostActive ? null : onSelectChapter} />}
    <InfernoFinale distance={distance} quality={quality} reduced={reduced} ghostActive={ghostActive} />
    {ghostActive && <ModelBoundary><Suspense fallback={null}><GhostFinale /></Suspense></ModelBoundary>}
    <Environment resolution={64} environmentIntensity={.22}><color attach="background" args={['#141219']} /><Lightformer intensity={1.2} color="#a9aec6" scale={[18, 9, 1]} position={[2, 5, 12]} rotation={[0, Math.PI, 0]} /><Lightformer form="rect" intensity={1.3} color="#ce826d" scale={[15, 6, 1]} position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} /><Lightformer intensity={2} color="#ff592d" scale={[20, 4, 1]} position={[-10, 3, -8]} rotation={[0, Math.PI / 2, 0]} /></Environment>
    <JourneyRig started={started} phase={phase} onZoomed={onZoomed} onReturned={onReturned} distance={distance} progress={progress} targetProgress={targetProgress} reduced={reduced} quality={quality} onModelError={onModelError} onModelReady={onModelReady} onArrival={onArrival} ghostActive={ghostActive} />
    {started && onQualitySample && <QualitySampler onSample={onQualitySample} />}
    {ghostActive && <GhostCamera controls={ghostControls} onExit={onGhostExit} reduced={reduced} />}
  </Canvas></SceneBoundary>;
}
