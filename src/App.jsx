import { lazy, Suspense, useEffect, useRef, useState, useCallback } from 'react';
import Credits from './components/Credits';
import HistoryChapter from './components/history/HistoryChapter';
import MusicPlayer from './components/MusicPlayer';
import GhostHud from './components/ghost/GhostHud';
import { useReducedMotion } from './hooks/usePreferences';
import { chapters, chapterAt, clamp, upcomingBillboardAt } from './data/journey';
import { advanceGhostSequence, initialGhostSequence } from './data/ghostUnlock';
const HighwayScene = lazy(() => import('./scenes/HighwayScene'));
const TrunkExperience = lazy(() => import('./components/trunk/TrunkExperience'));
export default function App() {
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [phase, setPhase] = useState('road');
  const tab = phase === 'road' || phase === 'returning' ? 'highway' : 'making';
  const onZoomed = useCallback(() => setPhase(p => p === 'zooming' ? 'trunk' : p), []);
  const onReturned = useCallback(() => { setPhase('road'); requestAnimationFrame(() => document.querySelector('.site-header nav button')?.focus({preventScroll:true})); }, []);
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState(0);
  const [mobile, setMobile] = useState(() => innerWidth < 761);
  const [automaticQuality, setAutomaticQuality] = useState('balanced');
  const quality = automaticQuality;
  const qualitySamples = useRef({ slow: 0, fast: 0 });
  const onQualitySample = useCallback(fps => {
    const samples = qualitySamples.current;
    samples.slow = fps < 35 ? samples.slow + 1 : 0;
    samples.fast = fps > 55 ? samples.fast + 1 : 0;
    if (samples.slow >= 2) {
      setAutomaticQuality(current => current === 'high' ? 'balanced' : 'performance');
      samples.slow = 0;
    } else if (samples.fast >= 3) {
      setAutomaticQuality(current => current === 'performance' ? 'balanced' : 'high');
      samples.fast = 0;
    }
  }, []);
  const [modelError, setModelError] = useState('');
  const [modelReady, setModelReady] = useState(false);
  const [credits,setCredits] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [ghostActive, setGhostActive] = useState(false);
  const ghostSequence = useRef(initialGhostSequence);
  const ghostControls = useRef({ pressed: new Set(), invalidate: null, overview: null });
  const exitGhost = useCallback(() => {
    ghostSequence.current = initialGhostSequence;
    setGhostActive(false);
    requestAnimationFrame(() => document.querySelector('.history-timeline button[aria-current="step"]')?.focus({ preventScroll: true }));
  }, []);
  const onModelReady = useCallback(() => setModelReady(true), []);
  const progress = useRef(0), saved = useRef(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  const chapter = chapterAt(value);
  const nextBillboard = upcomingBillboardAt(value, mobile);
  const atDestination = started && arrived && value > .97;
  useEffect(() => {
    if (!started || phase !== 'road' || ghostActive) return;
    const next = advanceGhostSequence(ghostSequence.current, value);
    ghostSequence.current = next;
    if (next.unlocked) {
      setSelectedChapter(null);
      setGhostActive(true);
    }
  }, [value, started, phase, ghostActive]);
  useEffect(() => {
    if (!ghostActive) return;
    requestAnimationFrame(() => document.querySelector('.ghost-hud-actions button:last-child')?.focus({ preventScroll: true }));
  }, [ghostActive]);
  useEffect(() => {
    const update = () => setMobile(innerWidth < 761);
    addEventListener('resize', update);
    return () => removeEventListener('resize', update);
  }, []);
  useEffect(() => {
    if (phase !== 'road' || !started || ghostActive) return;
    // Reduced motion jumps directly to the sampled world state, but scroll
    // remains available in both directions alongside the chapter controls.
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - innerHeight; progress.current = clamp(scrollY / Math.max(1,max)); setValue(previous => Math.abs(previous - progress.current) > .001 ? progress.current : previous); }); };
    addEventListener('scroll',update,{passive:true}); addEventListener('resize',update); update();
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll',update); removeEventListener('resize',update); };
  }, [phase,started,reduced,ghostActive]);
  useEffect(() => {
    if (phase === 'road' && !ghostActive) return;
    const old = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = old;
      if (phase !== 'road') scrollTo({top:saved.current,behavior:'instant'});
    };
  }, [phase === 'road', ghostActive]);
  useEffect(() => {
    if (phase !== 'zooming' && phase !== 'returning') return;
    // A slow render must not cut a healthy camera transition short. Fallback only for unavailable 3D.
    if (modelReady && !modelError) return;
    const timer = setTimeout(phase === 'zooming' ? onZoomed : onReturned, 6500);
    return () => clearTimeout(timer);
  }, [phase,onZoomed,onReturned,modelReady,modelError]);
  const navigate = next => {
    setSelectedChapter(null);
    if (ghostActive) exitGhost();
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
      <a className="wordmark" href="#highway" onClick={(event)=>{event.preventDefault();navigate('highway');}} aria-label="AC/DC — início"><img src="/images/acdc-logo-red-gold.webp" alt="" width="150" height="58" onError={event=>{event.currentTarget.hidden=true;event.currentTarget.nextElementSibling.hidden=false;}}/><span className="wordmark-fallback" hidden>AC<span>ϟ</span>DC</span></a>
      <nav aria-label="Áreas principais"><button className={tab==='highway'?'active':''} aria-current={tab==='highway'?'page':undefined} onClick={()=>navigate('highway')}><small>01</small> THE HIGHWAY</button><button className={tab==='making'?'active':''} aria-current={tab==='making'?'page':undefined} onClick={()=>navigate('making')}><small>02</small> THE MAKING OF</button></nav>
      <span className="site-authors">Feito por: <strong>Erik Carvalho, Gustavo Goularte e Gustavo Justo</strong></span>
    </header>
    <main inert={phase !== 'road' ? true : undefined} aria-hidden={phase !== 'road' ? true : undefined} id={phase === 'trunk' ? 'road-content' : 'main-content'} className={`highway ${started?'is-started':''} ${reduced?'reduced':''} ${atDestination?'has-arrived':''} ${ghostActive?'ghost-active':''}`} style={{height:started?'950vh':'100svh'}}>
      <div className="stage"><Suspense fallback={<div className="loading">PREPARANDO A ESTRADA <span>ϟ</span></div>}>{pageVisible && <HighwayScene phase={phase} started={started} onZoomed={onZoomed} onReturned={onReturned} progress={progress} targetProgress={value} reduced={reduced} quality={quality} onQualitySample={onQualitySample} onModelError={setModelError} onModelReady={onModelReady} onArrival={setArrived} onSelectChapter={setSelectedChapter} ghostActive={ghostActive} ghostControls={ghostControls} onGhostExit={exitGhost}/>}</Suspense>{pageVisible && !modelReady && !modelError && <div className="car-loading" role="status">PREPARANDO O DODGE 3D <span aria-hidden="true">ϟ</span></div>}<div className="vignette"/><div className="film-grain"/></div>
      {!started ? <section className="opening" aria-labelledby="opening-title">
        <span className="eyebrow"><i aria-hidden="true"/> AC/DC · UMA VIAGEM PELO ROCK</span>
        <h1 id="opening-title">HIGHWAY<span className="title-second"><em>TO</em> HELL</span></h1>
        <p className="opening-intro">Oito capítulos. Uma estrada até o inferno.</p>
        <button className="start-button" onClick={()=>{setStarted(true);go(.015);}}>Iniciar a viagem<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></button>
        <span className="start-note">{reduced?'Explore pelos capítulos da estrada':'Role para avançar · Volte para redescobrir'}</span>
      </section> : ghostActive ? null : <>
        {!atDestination && value >= .02 && nextBillboard && <button className="history-open" onClick={() => setSelectedChapter(nextBillboard)} aria-label={`Abrir capítulo ${nextBillboard.marker}: ${nextBillboard.title}`}><span>{nextBillboard.period}</span><strong>{nextBillboard.title}</strong></button>}
        {!atDestination && value > chapters.at(-1).progress - .006 && <section className="chapter-caption inferno-approach" style={{opacity:clamp((value - chapters.at(-1).progress + .006) / .006)}}><span className="eyebrow">09 / HIGHWAY TO HELL</span><h1>THE GATES OF HELL.</h1><p>O horizonte já não é o mesmo.</p></section>}
        <nav className="history-timeline" aria-label="Linha do tempo da estrada">{chapters.map(item=><button key={item.id} aria-label={`Ir para ${item.period}: ${item.title}`} aria-current={chapter.id===item.id?'step':undefined} className={chapter.id===item.id?'selected':''} onClick={()=>go(item.id === 'hell-gate' ? 1 : item.progress)} title={`${item.period} — ${item.title}`}><span className="timeline-number">{item.marker}</span><span className="timeline-period">{item.id==='hell-gate'?'INFERNO':item.period}</span></button>)}</nav>
        {atDestination && <section className="inferno-arrival" aria-labelledby="arrival-title">
          <span className="eyebrow">HIGHWAY TO HELL / DESTINO FINAL</span>
          <h1 id="arrival-title">ATÉ O FIM.<br/><span>ATÉ O FOGO.</span></h1>
          <p role="status">Você chegou. O rock segue.</p>
          <button onClick={()=>go(.74)}>↶ VOLTAR À ESTRADA</button>
          <small>Role para cima para refazer o caminho.</small>
        </section>}
      </>}
      {modelError && <p className="audio-error" role="alert">{modelError}</p>}

      <div className="journey-progress" role="progressbar" aria-label="Progresso na estrada" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value*100)}><span style={{transform:`scaleX(${value})`}}/></div>
      {ghostActive && <GhostHud controls={ghostControls} onExit={exitGhost} />}
      {selectedChapter && <HistoryChapter key={selectedChapter.id} chapter={selectedChapter} onClose={() => setSelectedChapter(null)}/>}
    </main>
    {(phase==='zooming'||phase==='returning')&&<div className="trunk-transition" role="status"><span>{phase==='zooming'?'APROXIMANDO DO PORTA-MALAS':'RETOMANDO A VIAGEM'}</span></div>}
    <div className="site-music"><MusicPlayer /></div>
    {credits&&<Credits onClose={()=>setCredits(false)}/>}
    {phase==='trunk'&&<Suspense fallback={<div className="loading trunk-loading">ABRINDO O PORTA-MALAS <span>ϟ</span></div>}><TrunkExperience onCredits={()=>setCredits(true)} reduced={reduced} onReturn={()=>navigate('highway')}/></Suspense>}
  </>;
}
