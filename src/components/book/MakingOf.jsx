import { useCallback, useRef, useState } from 'react';
import { entries } from '../../data/book';
import PaperBook from './PaperBook';

export default function MakingOf({ reduced }) {
  const [open, setOpen] = useState(false), [page, setPage] = useState(0);
  const [portrait, setPortrait] = useState(false), [turning, setTurning] = useState(false);
  const [toc, setToc] = useState(false);
  const book = useRef(null);
  const onPage = useCallback((index, single) => { setPage(index); setPortrait(single); }, []);
  const onTurning = useCallback(value => setTurning(value), []);
  const atEnd = page >= entries.length - (portrait ? 1 : 2);
  const navigate = direction => {
    if (turning) return;
    setToc(false);
    if (direction === 'next' && !atEnd) book.current?.next();
    if (direction === 'previous' && page > 0) book.current?.previous();
  };
  return <main className={`making archive-room ${reduced ? 'motion-reduced' : ''}`} id="main-content" onKeyDown={event => {
    if (!open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate('next'); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate('previous'); }
  }}>
    <div className="book-heading"><span className="eyebrow">BASTIDORES DE UMA VIAGEM</span><h1>The Making Of<span>.</span></h1><p>Ideias, escolhas e cicatrizes. Um registro em construção.</p></div>
    {!open ? <div className="closed-book-stage"><button className="archive-cover" onClick={() => setOpen(true)} aria-label="Abrir o livro de desenvolvimento">
      <span className="cover-spine" aria-hidden="true"/>
      <span className="cover-frame" aria-hidden="true"/>
      <span className="cover-corner corner-tl" aria-hidden="true"/><span className="cover-corner corner-br" aria-hidden="true"/>
      <span className="cover-edition">THE HIGHWAY ARCHIVES / VOL. 01</span><span className="cover-bolt">ϟ</span>
      <strong>THE<br/>MAKING<br/>OF</strong><span className="cover-bottom">AC/DC — HIGHWAY TO HELL<br/><small>ABRIR O LIVRO ↗</small></span>
    </button></div> : <>
      <div className="book-table"><PaperBook ref={book} reduced={reduced} onPage={onPage} onTurning={onTurning}/></div>
      <nav className="book-controls" aria-label="Páginas do livro">
        <button disabled={page === 0 || turning} onClick={() => navigate('previous')}>← Anterior</button>
        <button onClick={() => setToc(!toc)} aria-expanded={toc} aria-controls="book-contents">Sumário · {page + 1}{!portrait && page + 1 < entries.length ? `–${page + 2}` : ''}/{entries.length}</button>
        <button disabled={atEnd || turning} onClick={() => navigate('next')}>Próxima →</button>
      </nav>
      <span className="book-announcement" role="status" aria-live="polite">Página {page + 1} de {entries.length}</span>
      {toc && <ol className="contents" id="book-contents">{entries.map((entry, index) => <li key={entry.id}><button disabled={turning} onClick={() => { book.current?.go(index); setToc(false); }}>{String(index + 1).padStart(2, '0')} — {entry.title}</button></li>)}</ol>}
      <button className="close-book" onClick={() => { setOpen(false); setToc(false); setPage(0); }}>Fechar livro</button>
    </>}
  </main>;
}
