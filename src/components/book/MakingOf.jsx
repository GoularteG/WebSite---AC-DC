import { useCallback, useRef, useState } from 'react';
import { entries } from '../../data/book';
import PaperBook from './PaperBook';
import AlbumShelf from './AlbumShelf';
import '../../styles/book-reader.css';

export default function MakingOf({ reduced, embedded=false, initialOpen=false, onExit }) {
  const [open, setOpen] = useState(initialOpen), [page, setPage] = useState(0);
  const [portrait, setPortrait] = useState(false), [turning, setTurning] = useState(false), [ready, setReady] = useState(false);
  const [toc, setToc] = useState(false);
  const book = useRef(null), table = useRef(null), focused = useRef(false);
  const onPage = useCallback((index, single) => { setPage(index); setPortrait(single); }, []);
  const onTurning = useCallback(value => setTurning(value), []);
  const onReady = useCallback(value => {
    setReady(value);
    if (value && !focused.current) {
      focused.current = true;
      table.current?.focus({ preventScroll: true });
    }
  }, []);
  const atEnd = page >= entries.length - (portrait ? 1 : 2);
  const lastVisible = Math.min(entries.length, page + (portrait ? 1 : 2));
  const navigate = direction => {
    if (turning || !ready) return;
    setToc(false);
    if (direction === 'next' && !atEnd) book.current?.next();
    if (direction === 'previous' && page > 0) book.current?.previous();
  };
  const jump = index => {
    if (turning || !ready) return;
    book.current?.go(index); setToc(false); table.current?.focus({ preventScroll: true });
  };
  const Container = embedded ? 'section' : 'main';
  return <Container className={`making archive-room reader-room ${embedded ? 'embedded' : ''} ${reduced ? 'motion-reduced' : ''}`} id={embedded ? 'trunk-book-content' : 'main-content'} onKeyDown={event => {
    if (event.key === 'Escape' && toc) { event.preventDefault(); event.stopPropagation(); setToc(false); return; }
    if (!open || event.altKey || event.ctrlKey || event.metaKey || event.target.matches('input,textarea,select')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate('next'); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate('previous'); }
    if (event.key === 'Home') { event.preventDefault(); jump(0); }
    if (event.key === 'End') { event.preventDefault(); jump(entries.length - 1); }
  }}>
    <header className="book-heading"><div><span className="eyebrow">AC/DC · ARQUIVO DE CRIAÇÃO</span><h1>The Making Of<span>.</span></h1></div><p>Antes da estrada,<br/>vieram as ideias.</p></header>
    <div className="archive-layout"><section className="archive-volume" aria-label="Livro de desenvolvimento">
      {!open ? <div className="closed-book-stage"><button className="archive-cover" onClick={() => { focused.current = false; setOpen(true); }} aria-label="Abrir o livro de desenvolvimento">
        <span className="cover-spine" aria-hidden="true"/><span className="cover-frame" aria-hidden="true"/>
        <span className="cover-corner corner-tl" aria-hidden="true"/><span className="cover-corner corner-br" aria-hidden="true"/>
        <span className="cover-edition">THE HIGHWAY ARCHIVES / VOL. 01</span><span className="cover-bolt">ϟ</span>
        <strong>THE<br/>MAKING<br/>OF</strong><span className="cover-bottom">AC/DC — HIGHWAY TO HELL<br/><small>ABRIR O LIVRO ↗</small></span>
      </button></div> : <>
        <div className="book-table" ref={table} tabIndex={0} role="region" aria-label="Livro aberto. Use as setas, toque nas bordas ou arraste para folhear." aria-busy={!ready}>
          <PaperBook ref={book} reduced={reduced} onPage={onPage} onTurning={onTurning} onReady={onReady}/>
        </div>
        <div className="reader-navigation">
          <nav className="reader-dock" aria-label="Paginação do livro">
            <button className="reader-arrow" disabled={!ready || page === 0 || turning} onClick={() => navigate('previous')} aria-label="Página anterior"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
            <div className="reader-position"><span>PÁGINAS</span><strong>{String(page + 1).padStart(2,'0')}{!portrait ? ` — ${String(lastVisible).padStart(2,'0')}` : ''}<small> / {String(entries.length).padStart(2, '0')}</small></strong><i aria-hidden="true"><b style={{ transform: `scaleX(${lastVisible / entries.length})` }}/></i></div>
            <button className="reader-index" disabled={!ready || turning} onClick={() => setToc(!toc)} aria-expanded={toc} aria-controls="book-contents">Índice <span aria-hidden="true">{toc ? '−' : '+'}</span></button>
            <button className="reader-arrow" disabled={!ready || atEnd || turning} onClick={() => navigate('next')} aria-label="Próxima página"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
          </nav>
          {toc && <ol className="reader-contents" id="book-contents">{entries.map((entry, index) => <li key={entry.id}><button disabled={turning} aria-current={index >= page && index < lastVisible ? 'page' : undefined} onClick={() => jump(index)}><span>{String(index + 1).padStart(2, '0')}</span>{entry.title}</button></li>)}</ol>}
        </div>
        <p className="reader-hint">{reduced ? 'Use as setas ou toque nas bordas para folhear.' : 'Arraste para folhear · Toque nas bordas · ← →'}</p>
        <span className="book-announcement" role="status" aria-live="polite">{portrait ? `Página ${page + 1}` : `Páginas ${page + 1} e ${lastVisible}`} de {entries.length}</span>
        {!embedded && <button className="close-book" onClick={() => { if(onExit){onExit();return;} setOpen(false); setToc(false); setPage(0); }}>Fechar livro</button>}
      </>}
    </section>{!embedded && <AlbumShelf/>}</div>
  </Container>;
}
