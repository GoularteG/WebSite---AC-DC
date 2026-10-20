import { useAudio } from '../hooks/useAudio';

export default function MusicPlayer() {
  const audio = useAudio();
  return <>
    <button type="button" disabled={!audio.available} aria-pressed={audio.playing} onClick={audio.toggle} aria-label={audio.playing ? 'Pausar Highway to Hell' : 'Reproduzir Highway to Hell'}>
      {audio.playing ? 'Ⅱ PAUSAR MÚSICA' : '♫ TOCAR HIGHWAY TO HELL'}
    </button>
    {audio.error && <span className="audio-error" role="alert">{audio.error}</span>}
  </>;
}
