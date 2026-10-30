import { useRef } from 'react';
import { useAudio } from '../hooks/useAudio';
const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
export default function MusicPlayer() {
  const audio = useAudio();
  const previousVolume = useRef(.5);
  const mute = () => {
    if (audio.volume) { previousVolume.current = audio.volume; audio.setVolume(0); }
    else audio.setVolume(previousVolume.current || .5);
  };
  return <section className={`mini-player ${audio.playing ? 'is-playing' : 'is-paused'}`} aria-label="Player de música">
    <div className="mini-track"><strong>Highway to Hell</strong><span>AC/DC</span></div>
    <button className="mini-play" disabled={!audio.available} aria-label={audio.playing ? 'Pausar Highway to Hell' : 'Reproduzir Highway to Hell'} onClick={audio.toggle}>
      <svg viewBox="0 0 24 24" aria-hidden="true">{audio.playing ? <path d="M7 5h4v14H7zm6 0h4v14h-4z"/> : <path d="m8 4 12 8-12 8z"/>}</svg>
    </button>
    <div className="mini-progress"><span>{time(audio.position)}</span><input type="range" min="0" max={audio.duration || 1} step="1" value={audio.position} disabled={!audio.duration} onChange={e=>audio.seek(e.target.value)} style={{'--fill': `${audio.duration ? audio.position / audio.duration * 100 : 0}%`}} aria-valuetext={`${time(audio.position)} de ${time(audio.duration)}`} aria-label="Posição da música"/><span>{time(audio.duration)}</span></div>
    <div className="mini-volume"><button onClick={mute} aria-label={audio.volume ? 'Silenciar música' : 'Restaurar volume'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/>{audio.volume > 0 && <path d="M16 7q7 5 0 10" fill="none" stroke="currentColor" strokeWidth="2"/>}</svg></button><input type="range" min="0" max="1" step=".01" value={audio.volume} onChange={e=>audio.setVolume(e.target.value)} style={{'--fill': `${audio.volume * 100}%`}} aria-valuetext={`${Math.round(audio.volume * 100)}%`} aria-label="Volume da música"/></div>
    {audio.error && <span className="mini-error" role="alert">{audio.error}</span>}
  </section>;
}
