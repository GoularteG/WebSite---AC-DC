import {Component,Suspense,useEffect,useRef,useState} from 'react';
import {Canvas,useThree} from '@react-three/fiber';
import {Environment,Lightformer,OrbitControls} from '@react-three/drei';
import {MathUtils,Spherical,Vector3} from 'three';
import GuitarModel from './GuitarModel';
import {ObjectDialog} from './ObjectPanel';

class ViewerBoundary extends Component {
  state={error:false};
  static getDerivedStateFromError(){return {error:true};}
  render(){return this.state.error?<p role="alert" className="guitar-loading">Não foi possível carregar a guitarra. Feche e tente novamente.</p>:this.props.children;}
}
function InspectionControls({action,reduced}){
  const controls=useRef();
  const {camera,invalidate}=useThree();
  useEffect(()=>{
    const control=controls.current;
    if(!control)return;
    const offset=camera.position.clone().sub(control.target);
    const sphere=new Spherical().setFromVector3(offset);
    if(action.type==='left')sphere.theta-=.3;
    if(action.type==='right')sphere.theta+=.3;
    if(action.type==='up')sphere.phi-=.2;
    if(action.type==='down')sphere.phi+=.2;
    if(action.type==='in')sphere.radius*=.8;
    if(action.type==='out')sphere.radius*=1.25;
    sphere.radius=MathUtils.clamp(sphere.radius,2.4,10);
    sphere.phi=MathUtils.clamp(sphere.phi,.08,Math.PI-.08);
    if(action.type==='reset'){
      control.reset();control.target.set(0,0,0);camera.position.set(.5,.15,6.2);
    }else camera.position.copy(new Vector3().setFromSpherical(sphere).add(control.target));
    control.update();invalidate();
  },[action,camera,invalidate]);
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping={!reduced}
    dampingFactor={.1} rotateSpeed={.7} zoomSpeed={.8} minDistance={2.4} maxDistance={10}
    minPolarAngle={.08} maxPolarAngle={Math.PI-.08}/>;
}
function Instrument({onReady}){
  useEffect(()=>{onReady();},[onReady]);
  return <GuitarModel/>;
}
export default function GuitarInspector({onClose,reduced}){
  const [action,setAction]=useState({type:'reset',id:0}),[ready,setReady]=useState(false);
  const run=type=>setAction(a=>({type,id:a.id+1}));
  // React state dispatch is stable; the callback does not restart the loader effect.
  const markReady=useRef(()=>setReady(true)).current;
  const keys={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down','+':'in','=':'in','-':'out','0':'reset'};
  return <ObjectDialog title="Inspecionar guitarra em 3D" onClose={onClose} book>
    <section className="guitar-inspector" onKeyDown={e=>{if(keys[e.key]){e.preventDefault();run(keys[e.key]);}}}>
      <div className="guitar-inspector-heading"><span className="eyebrow">COLEÇÃO / INSPEÇÃO 3D</span><h2>TURN IT UP<span>.</span></h2><p>Gire. Aproxime. Descubra cada detalhe.</p></div>
      <div className="guitar-viewport" tabIndex={0} role="region" aria-label="Guitarra 3D. Arraste para girar, use a roda ou pinça para zoom. Setas giram, mais e menos ajustam o zoom.">
        <ViewerBoundary><Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:[.5,.15,6.2],fov:40,near:.05,far:40}}
          gl={{antialias:true,powerPreference:'low-power'}} fallback={<p className="guitar-loading">A inspeção 3D precisa de WebGL. Experimente outro navegador.</p>}>
          <color attach="background" args={['#151516']}/>
          <hemisphereLight args={['#fff5e5','#4c4b55',2]}/>
          <directionalLight position={[3,4,6]} intensity={3} color="#fff1d8"/>
          <directionalLight position={[-4,1,-3]} intensity={2} color="#8198ce"/>
          <Suspense fallback={null}><Environment resolution={32}>
            <Lightformer intensity={3} position={[0,2,5]} scale={[5,8,1]}/>
            <Lightformer intensity={2} position={[-3,0,-3]} scale={[3,6,1]} rotation={[0,Math.PI,0]}/>
          </Environment><Instrument onReady={markReady}/></Suspense>
          <InspectionControls action={action} reduced={reduced}/>
        </Canvas></ViewerBoundary>
        {!ready&&<span className="guitar-loading-note" role="status">Preparando a guitarra 3D…</span>}
      </div>
      <div className="guitar-controls" aria-label="Controles da guitarra">
        <button onClick={()=>run('left')} aria-label="Girar guitarra para a esquerda">↶</button>
        <button onClick={()=>run('right')} aria-label="Girar guitarra para a direita">↷</button>
        <button onClick={()=>run('up')} aria-label="Inclinar guitarra para cima">↑</button>
        <button onClick={()=>run('down')} aria-label="Inclinar guitarra para baixo">↓</button>
        <button onClick={()=>run('out')} aria-label="Diminuir zoom">−</button>
        <button onClick={()=>run('in')} aria-label="Aumentar zoom">+</button>
        <button className="guitar-reset" onClick={()=>run('reset')}>RESTAURAR VISTA</button>
      </div>
      <p className="guitar-gesture-hint">Arraste para girar · Roda do mouse ou pinça para zoom · Setas e +/− no teclado</p>
      <p className="guitar-credit">“Guitarra elèctrica” por <a href="https://sketchfab.com/aroig" target="_blank" rel="noreferrer">Aroig</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a> · <a href="https://sketchfab.com/3d-models/guitarra-electrica-cc6bc30cdb8645fa8eba878ad854f802" target="_blank" rel="noreferrer">Modelo original</a>. Materiais adaptados; geometria preservada.</p>
    </section>
  </ObjectDialog>;
}
