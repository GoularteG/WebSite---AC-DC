import { useEffect, useRef, useState } from 'react';
import { audioAsset } from '../data/assets';
import { analyseAudio, createAudioAnalysis } from '../audio/audioAnalysis';

export function useAudio() {
  const player = useRef(null);
  const graph = useRef(null);
  const meter = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  const emitPulse = value => dispatchEvent(new CustomEvent('highway:audio-pulse', { detail: value }));
  const stopMeter = () => { clearInterval(meter.current); meter.current = null; emitPulse(0); dispatchEvent(new CustomEvent('highway:audio-state', { detail: false })); };

  useEffect(() => {
    if (!audioAsset.url) return;
    const audio = new Audio(audioAsset.url);
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0.5;
    player.current = audio;

    const quiet = () => emitPulse(0);
    const failed = () => { stopMeter(); setPlaying(false); setError('Áudio indisponível.'); };
    const update = () => { setPosition(audio.currentTime); setDuration(Number.isFinite(audio.duration) ? audio.duration : 0); };
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', update);
    audio.addEventListener('error', failed);
    audio.addEventListener('pause', stopMeter);
    audio.addEventListener('waiting', quiet);

    return () => {
      stopMeter();
      audio.pause();
      audio.removeEventListener('error', failed);
      audio.removeEventListener('pause', stopMeter);
      audio.removeEventListener('waiting', quiet);
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('loadedmetadata', update);
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
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.15;
        source.connect(analyser);
        analyser.connect(context.destination);
        graph.current = { context, analyser, data: new Uint8Array(analyser.frequencyBinCount), waveform: new Uint8Array(analyser.fftSize), analysis: createAudioAnalysis() };
      }
      await graph.current?.context.resume();
      await player.current.play();
      setPlaying(true);
      setError('');
      if (graph.current) {
        stopMeter();
        graph.current.analysis = createAudioAnalysis();
        dispatchEvent(new CustomEvent('highway:audio-state', { detail: true }));
        meter.current = setInterval(() => {
          const graphData = graph.current;
          if (!graphData || player.current.paused || player.current.readyState < 3 || graphData.context.state !== 'running') { emitPulse(0); return; }
          graphData.analyser.getByteFrequencyData(graphData.data);
          graphData.analyser.getByteTimeDomainData(graphData.waveform);
          const signal = analyseAudio(graphData.data, graphData.waveform, graphData.context.sampleRate, graphData.analyser.fftSize, performance.now(), graphData.analysis);
          const audible = !player.current.muted && player.current.volume > 0 && !document.hidden;
          emitPulse(audible ? signal.pulse : 0);
          if (audible && signal.beat) dispatchEvent(new CustomEvent('highway:audio-beat', { detail: signal }));
        }, 33);
      }
    } catch {
      stopMeter();
      setError('Não foi possível iniciar o áudio.');
    }
  };

  const seek = value => { if (player.current && duration > 0) { player.current.currentTime = Math.max(0, Math.min(duration, Number(value))); if (graph.current) graph.current.analysis = createAudioAnalysis(); emitPulse(0); setPosition(player.current.currentTime); } };
  return { position, duration, seek, playing, toggle, volume, setVolume, error, available: Boolean(audioAsset.url) };
}
