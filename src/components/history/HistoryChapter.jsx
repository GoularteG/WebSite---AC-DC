import { useEffect, useRef, useState } from 'react';
import { licensedPhotoSources } from '../../data/historyPhotos';
import { chapters } from '../../data/journey';
import '../../styles/history-reader.css';

const archive = chapters.slice(0, 8);
function Arrow({ back = false }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={back ? {transform:'rotate(180deg)'} : undefined}><path d="M4 12h15M13 5l7 7-7 7"/></svg>;
}
function ChapterPhoto({ image, period, marker }) {
  const [failed, setFailed] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const source = licensedPhotoSources(image)[failed];
  return <figure className="archive-photo">
    <div className={`archive-photo-frame ${loaded ? 'is-loaded' : ''}`}>
      <span className="archive-photo-stamp" aria-hidden="true">AC/DC ARCHIVES <b>{marker}</b></span>
      {source ? <><span className="archive-photo-loading" aria-hidden="true">REVELANDO O ARQUIVO…</span><img src={source} alt={image.description} decoding="async" onLoad={() => setLoaded(true)} onError={() => {setLoaded(false);setFailed(value => value + 1);}} /></> : <div className="archive-photo-unavailable" role="img" aria-label="Fotografia histórica indisponível"><strong>{period}</strong><span>O registro não carregou.</span><small>Continue lendo a história.</small></div>}
    </div>
    <figcaption>{image.kind === 'retrospective-band-photograph' && <span className="archive-photo-tag">FOTO RETROSPECTIVA</span>}{image.caption}</figcaption>
    {image.sourceUrl && <a className="archive-photo-credit" href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.credit || image.creator} ↗</a>}
  </figure>;
}
export default function HistoryChapter({ chapter: initialChapter, onClose }) {
  const dialog = useRef(null), scroller = useRef(null), heading = useRef(null);
  const [index, setIndex] = useState(() => Math.max(0, archive.findIndex(item => item.id === initialChapter.id)));
  const chapter = archive[index];
  useEffect(() => {
    const element = dialog.current, opener = document.activeElement;
    const oldOverflow = document.documentElement.style.overflow;
    element.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      element.close();
      document.documentElement.style.overflow = oldOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({preventScroll:true});
    };
  }, []);
  useEffect(() => {
    scroller.current.scrollTop = 0;
    heading.current.focus({preventScroll:true});
  }, [index]);
  const move = next => {
    if (next < 0 || next >= archive.length || next === index) return;
    setIndex(next);
  };
  return <dialog ref={dialog} className="history-reader" onCancel={event => {event.preventDefault();onClose();}} aria-labelledby="archive-title">
    <header className="archive-topbar">
      <div className="archive-brand"><span className="archive-brand-mark" aria-hidden="true">AC/DC</span><span>ARQUIVO DA ESTRADA</span></div>
      <button className="archive-close" type="button" onClick={onClose} aria-label="Fechar capítulo e voltar à estrada"><span>Voltar à estrada</span><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 6 12 12M6 18 18 6"/></svg></button>
    </header>
    <div className="archive-scroll" ref={scroller}>
      <article className="archive-article" key={chapter.id}>
        <div className="archive-feature">
          <ChapterPhoto key={chapter.id} image={chapter.image} period={chapter.period} marker={chapter.marker}/>
          <div className="archive-story">
            <div className="archive-kicker"><span>{chapter.period}</span><span>CAPÍTULO {chapter.marker}</span></div>
            <h2 id="archive-title" ref={heading} tabIndex={-1}>{chapter.title}</h2>
            <div className="archive-rule" aria-hidden="true"/>
            <p className="archive-narrative">{chapter.narrative}</p>
          </div>
        </div>
        <section className="archive-milestones" aria-labelledby="archive-milestones-title">
          <h3 id="archive-milestones-title"><span>NA LINHA DO TEMPO</span><span aria-hidden="true">03 MARCOS</span></h3>
          <ol>{chapter.events.map((event, i) => <li key={`${event.date}-${event.text}`}><span className="archive-event-number" aria-hidden="true">0{i+1}</span><div><strong>{event.date}</strong><p>{event.text}</p></div></li>)}</ol>
        </section>
        {chapter.curiosity && <aside className="archive-curiosity"><span>DO LADO B<br/><strong>Você sabia?</strong></span><p>{chapter.curiosity}</p></aside>}
        <details className="archive-sources"><summary>Fontes e licença da fotografia <span aria-hidden="true">+</span></summary><div><p>{chapter.image.credit} · <a href={chapter.image.licenseUrl} target="_blank" rel="noopener noreferrer">{chapter.image.license} ↗</a></p><ul>{chapter.references?.map(reference => <li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.title} ↗</a></li>)}</ul></div></details>
      </article>
    </div>
    <footer className="archive-navigation">
      <button className="archive-prev" type="button" disabled={index === 0} onClick={() => move(index - 1)} aria-label="Capítulo anterior"><Arrow back/><span>Anterior</span></button>
      <nav className="archive-chapter-dots" aria-label="Capítulos do arquivo">{archive.map((item, i) => <button type="button" key={item.id} aria-label={`Capítulo ${item.marker}: ${item.title}`} aria-current={index === i ? 'step' : undefined} onClick={() => move(i)}>{item.marker}</button>)}</nav>
      <span className="archive-mobile-count">{chapter.marker}<span> / 08</span></span>
      <button className="archive-next" type="button" onClick={() => index === 7 ? onClose() : move(index + 1)}><span>{index === 7 ? 'Voltar à estrada' : 'Próximo capítulo'}</span><Arrow/></button>
    </footer>
    <span className="archive-sr" role="status" aria-live="polite">Capítulo {chapter.marker} de 8: {chapter.title}</span>
  </dialog>;
}
