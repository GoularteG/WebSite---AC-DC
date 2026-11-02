import { useAudio } from '../hooks/useAudio';
import { audioAsset } from '../data/assets';

export default function MusicPlayer() {
  const audio = useAudio();
  const title = audioAsset.title || 'Música';
  return <section className={`mini-player ${audio.playing ? 'is-playing' : 'is-paused'}`} aria-label="Player de música">
    <div className="mini-track"><strong title={title}>{title}</strong></div>
    <button className="mini-play" disabled={!audio.available} aria-label={`${audio.playing ? 'Pausar' : 'Reproduzir'} ${title}`} onClick={audio.toggle}>
      <svg viewBox="0 0 24 24" aria-hidden="true">{audio.playing ? <path d="M7 5h4v14H7zm6 0h4v14h-4z"/> : <path d="m8 4 12 8-12 8z"/>}</svg>
    </button>
    {audio.error && <span className="mini-error" role="alert">{audio.error}</span>}
  </section>;
}
