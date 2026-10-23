import { useEffect, useRef, useState } from 'react';
import { audioAsset } from '../data/assets';
export function useAudio() {
  const player = useRef(null);
  const graph = useRef(null);
  const meter = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const emitPulse = value => dispatchEvent(new CustomEvent('highway:audio-pulse', { detail: value }));
  const stopMeter = () => { clearInterval(meter.current); meter.current = null; emitPulse(0); };
  useEffect(() => {
    if (!audioAsset.url) return;
    const audio = new Audio(audioAsset.url); audio.loop = true; audio.preload = 'none'; player.current = audio;
    const failed = () => { stopMeter(); setPlaying(false); setError('Áudio indisponível.'); };
    audio.addEventListener('error', failed);
    return () => { stopMeter(); audio.pause(); audio.removeEventListener('error', failed); graph.current?.context.close(); graph.current=null; audio.removeAttribute('src'); audio.load(); player.current = null; };
  }, []);
  const toggle = async () => {
    if (!player.current) return;
    if (playing) { player.current.pause(); stopMeter(); setPlaying(false); return; }
    try {
      if (!graph.current && (window.AudioContext || window.webkitAudioContext)) {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const source = context.createMediaElementSource(player.current);
        const analyser = context.createAnalyser();analyser.fftSize=1024;analyser.smoothingTimeConstant=.82;
        source.connect(analyser);analyser.connect(context.destination);
        graph.current={context,analyser,data:new Uint8Array(analyser.frequencyBinCount)};
      }
      await graph.current?.context.resume();
      await player.current.play();
      setPlaying(true);setError('');
      if (graph.current) meter.current=setInterval(()=>{
        const {analyser,data}=graph.current;
        analyser.getByteFrequencyData(data);
        let bass=0;for(let i=2;i<17;i++)bass+=data[i];
        emitPulse(Math.min(1,Math.max(0,(bass/15/255-.08)*1.9)));
      },100);
    } catch { stopMeter(); setError('Não foi possível iniciar o áudio.'); }
  };
  return { playing, toggle, error, available: Boolean(audioAsset.url) };
}
