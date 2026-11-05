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
    <label className="mini-volume" title={`Volume: ${Math.round(audio.volume * 100)}%`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9h4l5-4v14l-5-4H4z"/>{audio.volume > 0 ? <path d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/> : <path d="m17 9 5 6m0-6-5 6"/>}</svg>
      <input type="range" min="0" max="100" step="1" value={Math.round(audio.volume * 100)} onChange={event => audio.setVolume(Number(event.target.value) / 100)} aria-label="Volume da música" aria-valuetext={`${Math.round(audio.volume * 100)}%`} disabled={!audio.available} style={{'--volume-fill': `${audio.volume * 100}%`}} />
    </label>
    {audio.error && <span className="mini-error" role="alert">{audio.error}</span>}
  </section>;
}
