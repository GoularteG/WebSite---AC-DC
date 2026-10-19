const albums = [
  { title: 'Back in Black', year: '1980', theme: 'black', number: '01' },
  { title: 'Highway to Hell', year: '1979', theme: 'hell', number: '02' },
  { title: 'The Razors Edge', year: '1990', theme: 'razor', number: '03' },
];
export default function AlbumShelf() {
  return <aside className="album-shelf" aria-label="CDs clássicos do AC/DC">
    <div className="album-shelf-heading"><span className="eyebrow">AC/DC · THE COLLECTION</span><h2>ALTO VOLUME.</h2></div>
    <div className="album-collection">{albums.map(album => <figure className={`album-object album-${album.theme}`} key={album.title}>
      <div className="album-artifact" aria-hidden="true">
        <div className="compact-disc"><span className="disc-band">ACϟDC</span><span className="disc-hole"/><span className="disc-title">{album.title}</span><span className="disc-format">COMPACT DISC · DIGITAL AUDIO</span></div>
        <div className="jewel-case"><div className="case-art"><span className="case-band">ACϟDC</span><span className="case-symbol">ϟ</span><strong>{album.title}</strong><span className="case-year">{album.year}</span></div><span className="case-hinge"/></div>
      </div>
      <figcaption><span>{album.number} / {album.year}</span><h3>{album.title}</h3></figcaption>
    </figure>)}</div>
    <p className="album-art-note">Peças gráficas inspiradas nos álbuns.<br/>Sem reprodução de áudio.</p>
  </aside>;
}
