import { lazy, Suspense, useEffect, useRef, useState, useCallback } from 'react';
import Credits from './components/Credits';
import TrunkExperience from './components/trunk/TrunkExperience';
import { useReducedMotion } from './hooks/usePreferences';
import { useAudio } from './hooks/useAudio';
import { chapters, chapterAt, clamp } from './data/journey';
const HighwayScene = lazy(() => import('./scenes/HighwayScene'));
export default function App() {
  const [phase, setPhase] = useState('road');
  const tab = phase === 'road' || phase === 'returning' ? 'highway' : 'making';
  const onZoomed = useCallback(() => setPhase(p => p === 'zooming' ? 'trunk' : p), []);
  const onReturned = useCallback(() => { setPhase('road'); requestAnimationFrame(() => document.querySelector('.site-header nav button')?.focus({preventScroll:true})); }, []);
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState(0);
  const [quality] = useState(() => innerWidth < 768 ? 'low' : 'high');
  const [modelError, setModelError] = useState('');
  const [modelReady, setModelReady] = useState(false);
  const [credits,setCredits] = useState(false);
  const [arrived, setArrived] = useState(false);
  const onModelReady = useCallback(() => setModelReady(true), []);
  const progress = useRef(0), saved = useRef(0);
  const reduced = useReducedMotion();
  const audio = useAudio();
  const chapter = chapterAt(value);
  const atDestination = started && arrived && value > .97;
  useEffect(() => {
    if (phase !== 'road' || !started) return;
    // Reduced motion jumps directly to the sampled world state, but scroll
    // remains available in both directions alongside the chapter controls.
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - innerHeight; progress.current = clamp(scrollY / Math.max(1,max)); setValue(progress.current); }); };
    addEventListener('scroll',update,{passive:true}); addEventListener('resize',update); update();
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll',update); removeEventListener('resize',update); };
  }, [phase,started,reduced]);
  useEffect(() => {
    if (phase === 'road') return;
    const old = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = old;
      scrollTo({top:saved.current,behavior:'instant'});
    };
  }, [phase === 'road']);
  useEffect(() => {
    if (phase !== 'zooming' && phase !== 'returning') return;
    // A slow render must not cut a healthy camera transition short. Fallback only for unavailable 3D.
    if (modelReady && !modelError) return;
    const timer = setTimeout(phase === 'zooming' ? onZoomed : onReturned, 6500);
    return () => clearTimeout(timer);
  }, [phase,onZoomed,onReturned,modelReady,modelError]);
  const navigate = next => {
    if (next === 'making' && phase === 'road') {
      saved.current = scrollY;
      scrollTo({top:saved.current,behavior:'instant'});
      setPhase('zooming');
    } else if (next === 'highway' && phase !== 'road') setPhase('returning');
  };
  const go = (p) => {
    setStarted(true);
    requestAnimationFrame(() => scrollTo({top:p*(document.documentElement.scrollHeight-innerHeight),behavior:reduced?'instant':'smooth'}));
  };
  return <>
    <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
    <header className="site-header">
      <a className="wordmark" href="#highway" onClick={(event)=>{event.preventDefault();navigate('highway');}} aria-label="AC/DC — início">AC<span>ϟ</span>DC</a>
      <nav aria-label="Áreas principais"><button className={tab==='highway'?'active':''} aria-current={tab==='highway'?'page':undefined} onClick={()=>navigate('highway')}><small>01</small> THE HIGHWAY</button><button className={tab==='making'?'active':''} aria-current={tab==='making'?'page':undefined} onClick={()=>navigate('making')}><small>02</small> THE MAKING OF</button></nav>
      <span className="edition">AN EXPERIMENTAL ROCK EXPERIENCE<span>VOL. 01 — THE OPEN ROAD</span></span>
    </header>
    <main inert={phase !== 'road' ? true : undefined} aria-hidden={phase !== 'road' ? true : undefined} id={phase === 'trunk' ? 'road-content' : 'main-content'} className={`highway ${started?'is-started':''} ${reduced?'reduced':''} ${atDestination?'has-arrived':''}`} style={{height:started?'650vh':'100svh'}}>
      <div className="stage"><Suspense fallback={<div className="loading">PREPARANDO A ESTRADA <span>ϟ</span></div>}><HighwayScene phase={phase} onZoomed={onZoomed} onReturned={onReturned} progress={progress} targetProgress={value} reduced={reduced} quality={quality} onModelError={setModelError} onModelReady={onModelReady} onArrival={setArrived}/></Suspense><div className="vignette"/><div className="film-grain"/></div>
      {!started ? <section className="opening"><span className="eyebrow"><i/> NO TURNING BACK. JUST ROCK ’N’ ROLL.</span><h1>HIGHWAY<br/><span className="title-second"><em>TO</em> HELL</span><b aria-hidden="true">ϟ</b></h1><p>Uma estrada. Mil volts.<br/>O próximo capítulo começa com você.</p><button className="start-button" onClick={()=>{setStarted(true);go(.015);}}>ENTRAR NA ESTRADA <span>↗</span></button><span className="start-note">{reduced?'Explore pelos marcos do percurso':'Role para avançar. Volte para redescobrir.'}</span></section> : <>
        {!atDestination && <section className={`chapter-caption ${value>.78?'inferno-approach':''}`} aria-live="polite"><span className="eyebrow">{value>.78?'HIGHWAY TO HELL / O ÚLTIMO DESTINO':`MARCO EXPERIMENTAL / ${chapter.marker}`}</span><h1>{value>.78?'INTO THE FIRE.':chapter.title}</h1><p>{value>.78?'O horizonte já não é o mesmo.':chapter.subtitle}</p></section>}
        <nav className="chapter-nav" aria-label="Marcos do percurso">{chapters.map(item=><button key={item.id} aria-label={`Ir para ${item.title}`} aria-current={chapter.id===item.id?'step':undefined} className={chapter.id===item.id?'selected':''} onClick={()=>go(item.progress)}><span>{item.marker}</span><i/><strong>{item.title}</strong></button>)}</nav>
        {atDestination && <section className="inferno-arrival" aria-labelledby="arrival-title">
          <span className="eyebrow">HIGHWAY TO HELL / DESTINO FINAL</span>
          <h1 id="arrival-title">ATÉ O FIM.<br/><span>ATÉ O FOGO.</span></h1>
          <p role="status">Você chegou. O rock segue.</p>
          <button onClick={()=>go(.74)}>↶ VOLTAR À ESTRADA</button>
          <small>Role para cima para refazer o caminho.</small>
        </section>}
      </>}
      {modelError && <p className="audio-error" role="alert">{modelError}</p>}
      <footer className="highway-footer"><div className="route-label"><span className="route-shield">H<span>01</span></span><div>THE OPEN ROAD<small>{started?`${Math.round(value*100).toString().padStart(2,'0')}% DO PERCURSO`:'O HORIZONTE É SÓ O COMEÇO'}</small></div></div><div className="footer-controls"><button onClick={()=>setCredits(true)}>CRÉDITOS</button><button disabled={!audio.available} onClick={audio.toggle} aria-pressed={audio.playing} title={audio.available?'Ativar ou desativar áudio':'Aguardando um arquivo de áudio autorizado'}>♫ {audio.available?(audio.playing?'SOM LIGADO':'SOM DESLIGADO'):'ÁUDIO EM BREVE'}</button></div></footer>
      <div className="journey-progress" role="progressbar" aria-label="Progresso na estrada" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value*100)}><span style={{transform:`scaleX(${value})`}}/></div>
      {audio.error && <p className="audio-error" role="alert">{audio.error}</p>}
    </main>
    {(phase==='zooming'||phase==='returning')&&<div className="trunk-transition" role="status"><span>{phase==='zooming'?'APROXIMANDO DO PORTA-MALAS':'RETOMANDO A VIAGEM'}</span><button onClick={phase==='zooming'?onZoomed:onReturned}>Pular transição →</button></div>}
    {credits&&<Credits onClose={()=>setCredits(false)}/>}
    {phase==='trunk'&&<TrunkExperience reduced={reduced} onReturn={()=>navigate('highway')}/>}
  </>;
}
