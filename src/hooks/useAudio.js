import { useEffect, useRef, useState } from 'react';
import { audioAsset } from '../data/assets';

export function useAudio() {
  const player = useRef(null);
  const graph = useRef(null);
  const meter = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [error, setError] = useState('');

  const emitPulse = value => dispatchEvent(new CustomEvent('highway:audio-pulse', { detail: value }));
  const stopMeter = () => { clearInterval(meter.current); meter.current = null; emitPulse(0); };

  useEffect(() => {
    if (!audioAsset.url) return;
    const audio = new Audio(audioAsset.url);
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0.5;
    player.current = audio;

    const failed = () => { stopMeter(); setPlaying(false); setError('Áudio indisponível.'); };
    audio.addEventListener('error', failed);

    return () => {
      stopMeter();
      audio.pause();
      audio.removeEventListener('error', failed);
      graph.current?.context.close();
      graph.current = null;
      audio.removeAttribute('src');
      audio.load();
      player.current = null;
    };
  }, []);

  const setVolume = value => {
    const clamped = Math.max(0, Math.min(1, Number(value)));
    setVolumeState(clamped);
    if (player.current) player.current.volume = clamped;
  };

  const toggle = async () => {
    if (!player.current) return;
    if (playing) { player.current.pause(); stopMeter(); setPlaying(false); return; }
    try {
      if (!graph.current && (window.AudioContext || window.webkitAudioContext)) {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const source = context.createMediaElementSource(player.current);
        const analyser = context.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.42;
        source.connect(analyser);
        analyser.connect(context.destination);
        graph.current = { context, analyser, data: new Uint8Array(analyser.frequencyBinCount), avg: 0, pulse: 0 };
      }
      await graph.current?.context.resume();
      await player.current.play();
      setPlaying(true);
      setError('');
      if (graph.current) {
        graph.current.analyser.smoothingTimeConstant = 0.42;
        meter.current = setInterval(() => {
          const { analyser, data } = graph.current;
          analyser.getByteFrequencyData(data);
          // Focus on kick drum and bass fundamental (bins 1..6: ~45Hz-280Hz)
          let bass = 0;
          for (let i = 1; i <= 6; i++) bass += data[i];
          const level = bass / (6 * 255);

          const prevAvg = Number.isFinite(graph.current.avg) && graph.current.avg > 0 ? graph.current.avg : level;
          const avg = prevAvg * 0.82 + level * 0.18;
          graph.current.avg = avg;

          // Keep a gentle base warmth while music plays + strong rhythmic spike on drum/chord hits
          const base = Math.min(0.18, Math.max(0, (level - 0.06) * 0.35));
          const beat = Math.max(0, (level - avg * 0.90) / Math.max(0.02, avg * 0.10));
          const target = Math.min(1, base + Math.min(1, beat) * 0.92);

          const prevPulse = Number.isFinite(graph.current.pulse) ? graph.current.pulse : 0;
          const nextPulse = target > prevPulse ? target : prevPulse * 0.55 + target * 0.45;
          graph.current.pulse = nextPulse;

          emitPulse(Number.isFinite(nextPulse) ? nextPulse : 0);
        }, 50);
      }
    } catch {
      stopMeter();
      setError('Não foi possível iniciar o áudio.');
    }
  };

  return { playing, toggle, volume, setVolume, error, available: Boolean(audioAsset.url) };
}
