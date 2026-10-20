import { useState } from 'react';

function licensedPhotoUrl(image) {
  if (image.usageStatus !== 'open-license-verified') return null;
  const filename = image.sourceUrl.split('/File:')[1];
  return filename ? `https://commons.wikimedia.org/wiki/Special:Redirect/file/${filename}?width=960` : null;
}

export default function HistoryChapter({ chapter, visibility, reduced }) {
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  if (!chapter?.narrative) return null;
  const image = chapter.image;
  const photoUrl = licensedPhotoUrl(image);
  const showPhoto = photoUrl && !failed;
  const side = Number(chapter.marker) % 2 ? 'left' : 'right';
  const summary = chapter.narrative.split(/(?<=[.!?])\s+/).slice(0, 3).join(' ');
  const detailId = `history-detail-${chapter.id}`;
  return <><span className={`history-connector history-connector--${side}`} aria-hidden="true" style={{ opacity: visibility }}/><section
    className={`history-chapter history-chapter--${side} ${expanded ? 'history-chapter--expanded' : ''}`}
    aria-label={`Capítulo ${chapter.marker} de 8: ${chapter.title}`}
    aria-hidden={visibility <= .01}
    inert={visibility <= .01 ? true : undefined}
    style={{ opacity: visibility, transform: reduced ? undefined : `translateY(${Math.round((1 - visibility) * 16)}px)` }}
  >
    <div className="history-chapter-heading">
      <span className="history-kicker">{chapter.marker} / 08 · NA ESTRADA</span>
      <span className="history-year">{chapter.period}</span>
      <h2>{chapter.title}<span>.</span></h2>
    </div>
    <div className="history-chapter-body">
      <figure className="history-photo">
        {showPhoto ? <img
          src={photoUrl}
          alt={image.description}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
        /> : <div className="history-photo-placeholder" role="img" aria-label="Fotografia histórica temporariamente indisponível"><span>FOTOGRAFIA DE ÉPOCA</span><small>Indisponível no momento</small></div>}
        <figcaption>
          <span>{image.caption}</span>
          <small><a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.credit}</a> · <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">{image.license}</a></small>
        </figcaption>
      </figure>
      <div className="history-copy">
        {!expanded && <p>{summary}</p>}
        <button className="history-read-more" aria-expanded={expanded} aria-controls={detailId} onClick={() => setExpanded(value => !value)}>{expanded ? 'Ler menos' : 'Ler mais'} <span aria-hidden="true">{expanded ? '↑' : '→'}</span></button>
        {expanded && <div className="history-details" id={detailId}>
          <p>{chapter.narrative}</p>
          <ol>{chapter.events.map(event => <li key={`${event.date}-${event.text}`}><strong>{event.date}</strong> {event.text}</li>)}</ol>
          {chapter.curiosity && <p className="history-curiosity"><strong>Você sabia?</strong> {chapter.curiosity}</p>}
        </div>}
        {image.kind === 'contextual-period-photograph' && <span className="history-context-note">Imagem contextual de época; fotografia da banda ainda depende de licença.</span>}
      </div>
    </div>
  </section></>;
}
