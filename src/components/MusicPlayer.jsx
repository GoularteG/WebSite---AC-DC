import { useAudio } from '../hooks/useAudio';

export default function MusicPlayer() {
  const audio = useAudio();

  return (
    <div className="music-player-container">
      <button
        type="button"
        disabled={!audio.available}
        aria-pressed={audio.playing}
        onClick={audio.toggle}
        aria-label={audio.playing ? 'Pausar Highway to Hell' : 'Reproduzir Highway to Hell'}
      >
        {audio.playing ? 'Ⅱ PAUSAR MÚSICA' : '♫ TOCAR HIGHWAY TO HELL'}
      </button>

      {audio.available && (
        <div className="volume-control" title={`Volume: ${Math.round(audio.volume * 100)}%`}>
          <span className="volume-icon" aria-hidden="true">
            {audio.volume === 0 ? '🔈' : audio.volume < 0.5 ? '🔉' : '🔊'}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audio.volume}
            onChange={e => audio.setVolume(e.target.value)}
            className="volume-slider"
            aria-label="Controle de volume"
          />
          <span className="volume-value">{Math.round(audio.volume * 100)}%</span>
        </div>
      )}

      {audio.error && <span className="audio-error" role="alert">{audio.error}</span>}
    </div>
  );
}
