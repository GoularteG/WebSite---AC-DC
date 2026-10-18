import { useState } from 'react';
import { entries } from '../../data/book';
export default function MakingOf({ reduced }) {
  const [page, setPage] = useState(-1);
  const [toc, setToc] = useState(false);
  const total = entries.length;
  const turn = (next) => { setToc(false); setPage(Math.max(-1, Math.min(total - 1, next))); };
  return <main className="making" id="main-content">
    <div className="book-heading"><span className="eyebrow">BASTIDORES DE UMA VIAGEM</span><h1>The Making Of<span>.</span></h1><p>Ideias, escolhas e cicatrizes. Um registro em construção.</p></div>
    {page < 0 ? <button className="book-cover" onClick={() => turn(0)} aria-label="Abrir o livro de desenvolvimento"><span className="cover-edition">THE HIGHWAY ARCHIVES / VOL. 01</span><span className="cover-bolt">ϟ</span><strong>THE<br/>MAKING<br/>OF</strong><span className="cover-bottom">AC/DC — HIGHWAY TO HELL<br/><small>ABRIR O LIVRO ↗</small></span></button> : <>
      <div className={`book-spread ${reduced ? 'no-motion' : ''}`} key={page}>
        <article className="book-page"><span className="eyebrow">{entries[page].label}</span><h2>{entries[page].title}</h2>{entries[page].paragraphs.map(p => <p key={p}>{p}</p>)}<span className="page-number">{String(page + 1).padStart(2, '0')}</span></article>
        <article className="book-page companion"><span className="eyebrow">{entries[page + 1]?.label || 'CONTINUA…'}</span><h2>{entries[page + 1]?.title || 'A próxima página ainda está na estrada.'}</h2>{entries[page + 1]?.paragraphs.map(p => <p key={p}>{p}</p>)}<span className="page-number">{page + 1 < total ? String(page + 2).padStart(2, '0') : 'ϟ'}</span></article>
      </div>
      <nav className="book-controls" aria-label="Páginas do livro"><button onClick={() => turn(page - (matchMedia('(min-width: 761px)').matches ? 2 : 1))}>← Anterior</button><button onClick={() => setToc(!toc)} aria-expanded={toc}>Sumário · {page + 1}/{total}</button><button disabled={page >= total - (matchMedia('(min-width: 761px)').matches ? 2 : 1)} onClick={() => turn(page + (matchMedia('(min-width: 761px)').matches ? 2 : 1))}>Próxima →</button></nav>
      {toc && <ol className="contents">{entries.map((entry,i)=><li key={entry.id}><button onClick={() => turn(i)}>{String(i+1).padStart(2,'0')} — {entry.title}</button></li>)}</ol>}
      <button className="close-book" onClick={() => turn(-1)}>Fechar livro</button>
    </>}
  </main>;
}
