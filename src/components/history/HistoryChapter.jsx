import { useState } from 'react';

function licensedPhotoUrl(image) {
  if (image.usageStatus !== 'open-license-verified') return null;
  const filename = image.sourceUrl.split('/File:')[1];
  return filename ? `https://commons.wikimedia.org/wiki/Special:Redirect/file/${filename}?width=960` : null;
}

export default function HistoryChapter({ chapter, visibility, reduced }) {
  const [failed, setFailed] = useState(false);
  if (!chapter?.narrative) return null;
  const image = chapter.image;
  const photoUrl = licensedPhotoUrl(image);
  const showPhoto = photoUrl && !failed;
  return <section
    className="history-chapter"
    aria-label={`Capítulo ${chapter.marker} de 8: ${chapter.title}`}
    aria-hidden={visibility <= .01}
    inert={visibility <= .01 ? true : undefined}
    style={{ opacity: visibility, transform: reduced ? undefined : `translateY(${Math.round((1 - visibility) * 16)}px)` }}
  >
    <div className="history-chapter-heading">
      <span className="history-kicker">CAPÍTULO {chapter.marker} / 08</span>
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
        /> : <div className="history-photo-placeholder" role="img" aria-label="Fotografia histórica temporariamente indisponível"><span>ARQUIVO FOTOGRÁFICO</span><strong>{chapter.period}</strong><small>Registro temporariamente indisponível</small></div>}
        <figcaption>
          <span>{image.caption}</span>
          <small><a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.credit}</a> · <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">{image.license}</a></small>
        </figcaption>
      </figure>
      <div className="history-copy">
        <p>{chapter.narrative}</p>
        {image.kind === 'contextual-period-photograph' && <span className="history-context-note">Imagem contextual de época. Fotografia da banda depende de licenciamento.</span>}
      </div>
    </div>
  </section>;
}
