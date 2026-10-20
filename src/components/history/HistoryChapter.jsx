import { useEffect, useRef, useState } from 'react';

function licensedPhotoUrl(image) {
  if (image.usageStatus !== 'open-license-verified') return null;
  const filename = image.sourceUrl.split('/File:')[1];
  return filename ? `https://commons.wikimedia.org/wiki/Special:Redirect/file/${filename}?width=960` : null;
}

export default function HistoryChapter({ chapter, onClose }) {
  const dialog = useRef(null);
  const [failed, setFailed] = useState(0);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    const oldOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      element.close();
      document.documentElement.style.overflow = oldOverflow;
    };
  }, []);
  const image = chapter.image;
  const photoUrl = licensedPhotoUrl(image);
  const imageSource = failed === 0 ? photoUrl : failed === 1 ? image.fallbackUrl : null;
  return <dialog ref={dialog} className="history-archive" onClose={onClose} aria-labelledby="history-archive-title">
    <header className="history-archive-header">
      <span>AC/DC · ARQUIVO DA ESTRADA · {chapter.marker} / 08</span>
      <button type="button" onClick={() => dialog.current.close()} aria-label="Fechar capítulo e voltar à estrada">✕ <span>VOLTAR À ESTRADA</span></button>
    </header>
    <div className="history-archive-heading"><span>{chapter.period}</span><h2 id="history-archive-title">{chapter.title}</h2></div>
    <div className="history-archive-grid">
      <figure className="history-archive-photo">
        {imageSource ? <img src={imageSource} alt={image.description} decoding="async" onError={() => setFailed(value => value + 1)} /> : <div className="history-photo-placeholder" role="img" aria-label="Fotografia histórica indisponível"><strong>{chapter.period}</strong><small>REGISTRO FOTOGRÁFICO INDISPONÍVEL</small></div>}
        <figcaption>{image.caption}</figcaption>
      </figure>
      <div className="history-archive-story"><p>{chapter.narrative}</p><h3>NA LINHA DO TEMPO</h3><ol>{chapter.events.map(event => <li key={`${event.date}-${event.text}`}><strong>{event.date}</strong> {event.text}</li>)}</ol>{chapter.curiosity && <p className="history-curiosity"><strong>VOCÊ SABIA?</strong> {chapter.curiosity}</p>}{image.kind === 'retrospective-band-photograph' && <p className="history-context-note">Imagem retrospectiva da banda: não representa o ano ou evento narrado neste capítulo.</p>}</div>
    </div>
  </dialog>;
}
