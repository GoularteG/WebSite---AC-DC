import { useCallback, useRef, useState } from 'react';
import { entries } from '../../data/book';
import PaperBook from './PaperBook';
import AlbumShelf from './AlbumShelf';

export default function MakingOf({ reduced, embedded=false, initialOpen=false, onExit }) {
  const [open, setOpen] = useState(initialOpen), [page, setPage] = useState(0);
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
  const Container = embedded ? 'section' : 'main';
  return <Container className={`making archive-room ${embedded ? 'embedded' : ''} ${reduced ? 'motion-reduced' : ''}`} id={embedded ? 'trunk-book-content' : 'main-content'} onKeyDown={event => {
    if (!open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate('next'); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate('previous'); }
  }}>
    <div className="book-heading"><span className="eyebrow">BASTIDORES DE UMA VIAGEM</span><h1>The Making Of<span>.</span></h1><p>Ideias, escolhas e cicatrizes. Um registro em construção.</p></div>
    <div className="archive-layout"><section className="archive-volume" aria-label="Livro de desenvolvimento">
    {!open ? <div className="closed-book-stage"><button className="archive-cover" onClick={() => setOpen(true)} aria-label="Abrir o livro de desenvolvimento">
      <span className="cover-spine" aria-hidden="true"/>
      <span className="cover-frame" aria-hidden="true"/>
      <span className="cover-corner corner-tl" aria-hidden="true"/><span className="cover-corner corner-br" aria-hidden="true"/>
      <span className="cover-edition">THE HIGHWAY ARCHIVES / VOL. 01</span><span className="cover-bolt">ϟ</span>
      <strong>THE<br/>MAKING<br/>OF</strong><span className="cover-bottom">AC/DC — HIGHWAY TO HELL<br/><small>ABRIR O LIVRO ↗</small></span>
    </button></div> : <>
      <div className="book-table" tabIndex={embedded ? 0 : undefined} role={embedded ? 'region' : undefined} aria-label={embedded ? 'Livro aberto. Arraste as páginas ou use as setas do teclado para folhear.' : undefined}><PaperBook ref={book} reduced={reduced} onPage={onPage} onTurning={onTurning}/></div>
      {!embedded && <>
      <p className="book-gesture-hint"><span aria-hidden="true">↔</span> {reduced ? 'Use os controles abaixo ou as setas do teclado' : 'Arraste a página para folhear · Os botões também navegam'}</p>
      <nav className="book-controls" aria-label="Páginas do livro">
        <button className="book-control book-control--previous" disabled={page === 0 || turning} onClick={() => navigate('previous')} aria-label="Voltar uma página">← <span>Anterior</span></button>
        <button className="book-control book-control--contents" onClick={() => setToc(!toc)} aria-expanded={toc} aria-controls="book-contents">
          <span className="book-page-count">PÁGINAS <strong>{String(page + 1).padStart(2,'0')}{!portrait && page + 1 < entries.length ? `–${String(page + 2).padStart(2,'0')}` : ''}</strong> / {String(entries.length).padStart(2,'0')}</span>
          <span className="book-toc-label">{toc ? 'Fechar sumário' : 'Abrir sumário'} <span aria-hidden="true">⌄</span></span>
        </button>
        <button className="book-control book-control--next" disabled={atEnd || turning} onClick={() => navigate('next')} aria-label="Avançar uma página"><span>Próxima</span> →</button>
      </nav>
      <div className="book-reading-progress" role="progressbar" aria-label="Progresso da leitura" aria-valuemin={1} aria-valuemax={entries.length} aria-valuenow={page+1}>
        <span style={{transform:`scaleX(${(page+1)/entries.length})`}}/>
      </div>
      </>}
      <span className="book-announcement" role="status" aria-live="polite">Página {page + 1} de {entries.length}</span>
      {!embedded && toc && <ol className="contents" id="book-contents">{entries.map((entry, index) => <li key={entry.id}><button disabled={turning} onClick={() => { book.current?.go(index); setToc(false); }}>{String(index + 1).padStart(2, '0')} — {entry.title}</button></li>)}</ol>}
      {!embedded && <button className="close-book" onClick={() => { if(onExit){onExit();return;} setOpen(false); setToc(false); setPage(0); }}>Fechar livro</button>}
    </>}
    </section>{!embedded && <AlbumShelf/>}</div>
  </Container>;
}
