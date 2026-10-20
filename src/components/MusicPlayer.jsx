import { useState } from 'react';

const EMBED_URL = 'https://open.spotify.com/embed/track/2zYzyRzz6pRmhPzyfMEC8s?utm_source=generator';

export default function MusicPlayer() {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" aria-expanded={open} aria-controls="highway-music-player" onClick={() => setOpen(value => !value)}>
      ♫ HIGHWAY TO HELL
    </button>
    {open && <div id="highway-music-player" className="music-player" role="group" aria-label="Música Highway to Hell, AC/DC">
      <div className="music-player-heading"><span>AC/DC · HIGHWAY TO HELL</span><button type="button" onClick={() => setOpen(false)} aria-label="Fechar player de música">✕</button></div>
      <iframe title="Highway to Hell — AC/DC no Spotify" src={EMBED_URL} width="100%" height="152" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
    </div>}
  </>;
}
