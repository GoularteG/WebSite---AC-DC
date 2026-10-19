import { lazy, Suspense, useEffect, useRef, useState, useCallback } from 'react';
import MakingOf from './components/book/MakingOf';
import { useReducedMotion } from './hooks/usePreferences';
import { useAudio } from './hooks/useAudio';
import { chapters, chapterAt, clamp } from './data/journey';
const HighwayScene = lazy(() => import('./scenes/HighwayScene'));
export default function App() {
  const [tab, setTab] = useState('highway');
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState(0);
  const [quality, setQuality] = useState(() => innerWidth < 768 ? 'low' : 'high');
  const [modelError, setModelError] = useState('');
  const [modelReady, setModelReady] = useState(false);
  const [arrived, setArrived] = useState(false);
  const onModelReady = useCallback(() => setModelReady(true), []);
  const progress = useRef(0), saved = useRef(0);
  const reduced = useReducedMotion();
  const audio = useAudio();
  const chapter = chapterAt(value);
  const atDestination = started && arrived && value > .97;
  useEffect(() => {
    if (tab !== 'highway' || !started) return;
    // Reduced motion jumps directly to the sampled world state, but scroll
    // remains available in both directions alongside the chapter controls.
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - innerHeight; progress.current = clamp(scrollY / Math.max(1,max)); setValue(progress.current); }); };
    addEventListener('scroll',update,{passive:true}); addEventListener('resize',update); update();
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll',update); removeEventListener('resize',update); };
  }, [tab,started,reduced]);
  const navigate = (next) => {
    if (tab === next) return;
    if (tab === 'highway') saved.current = scrollY;
    setTab(next);
    requestAnimationFrame(() => scrollTo({top: next === 'highway' ? saved.current : 0, behavior:'instant'}));
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
    {tab==='highway' ? <main id="main-content" className={`highway ${started?'is-started':''} ${reduced?'reduced':''} ${atDestination?'has-arrived':''}`} style={{height:started?'650vh':'100svh'}}>
      <div className="stage"><Suspense fallback={<div className="loading">PREPARANDO A ESTRADA <span>ϟ</span></div>}><HighwayScene progress={progress} targetProgress={value} reduced={reduced} quality={quality} onModelError={setModelError} onModelReady={onModelReady} onArrival={setArrived}/></Suspense><div className="vignette"/><div className="film-grain"/></div>
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
      <div className="prototype-note" role="status">{modelError || (modelReady ? <><span>DODGE CHARGER R/T 1970</span><br/><a href="https://sketchfab.com/3d-models/dominic-torettos-1970-dodge-charger-rt-fast-x-0e2c80e2928d4b76b49914db5bbb47ca" target="_blank" rel="noreferrer">Modelo: Emmanual Robinson, Jr.</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a></> : 'CARREGANDO O CHARGER ORIGINAL…')}</div>
      <footer className="highway-footer"><div className="route-label"><span className="route-shield">H<span>01</span></span><div>THE OPEN ROAD<small>{started?`${Math.round(value*100).toString().padStart(2,'0')}% DO PERCURSO`:'O HORIZONTE É SÓ O COMEÇO'}</small></div></div><div className="footer-controls"><button onClick={()=>setQuality(quality==='high'?'low':'high')} aria-label={`Qualidade ${quality==='high'?'alta':'leve'}. Alternar qualidade.`}>VISUAL: {quality==='high'?'ALTO':'LEVE'}</button><button disabled={!audio.available} onClick={audio.toggle} aria-pressed={audio.playing} title={audio.available?'Ativar ou desativar áudio':'Aguardando um arquivo de áudio autorizado'}>♫ {audio.available?(audio.playing?'SOM LIGADO':'SOM DESLIGADO'):'ÁUDIO EM BREVE'}</button></div></footer>
      <div className="journey-progress" role="progressbar" aria-label="Progresso na estrada" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value*100)}><span style={{transform:`scaleX(${value})`}}/></div>
      {audio.error && <p className="audio-error" role="alert">{audio.error}</p>}
    </main> : <MakingOf reduced={reduced}/>}
  </>;
}
