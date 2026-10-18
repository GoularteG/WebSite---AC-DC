import { useEffect, useRef, useState } from 'react';
import { audioAsset } from '../data/assets';
export function useAudio() {
  const player = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!audioAsset.url) return;
    const audio = new Audio(audioAsset.url); audio.loop = true; audio.preload = 'none'; player.current = audio;
    const failed = () => { setPlaying(false); setError('Áudio indisponível.'); };
    audio.addEventListener('error', failed);
    return () => { audio.pause(); audio.removeEventListener('error', failed); audio.removeAttribute('src'); audio.load(); player.current = null; };
  }, []);
  const toggle = async () => {
    if (!player.current) return;
    if (playing) { player.current.pause(); setPlaying(false); }
    else { try { await player.current.play(); setPlaying(true); setError(''); } catch { setError('Não foi possível iniciar o áudio.'); } }
  };
  return { playing, toggle, error, available: Boolean(audioAsset.url) };
}
