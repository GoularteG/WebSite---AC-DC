import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../styles/brightness-tuner.css';

const STORAGE_KEY = 'acdc:scene-brightness';
const DEFAULT_BRIGHTNESS = 100;
const clampBrightness = value => Math.min(220, Math.max(40, value));
function savedBrightness() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const value = saved === null ? DEFAULT_BRIGHTNESS : Number(saved);
    return Number.isFinite(value) ? clampBrightness(value) : DEFAULT_BRIGHTNESS;
  } catch { return DEFAULT_BRIGHTNESS; }
}

// Temporary art-direction control. Keep the chosen percentage as the CSS default
// when removing this panel after approval; no scene components need changing.
export default function BrightnessTuner() {
  const [brightness, setBrightness] = useState(savedBrightness);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const container = useRef(null), toggle = useRef(null), slider = useRef(null);
  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--scene-brightness', String(brightness / 100));
    try { localStorage.setItem(STORAGE_KEY, String(brightness)); } catch { /* Browser storage may be disabled. */ }
    setCopied(false);
  }, [brightness]);
  useEffect(() => {
    if (!open) return;
    slider.current?.focus({ preventScroll: true });
    const dismiss = event => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    const key = event => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus({ preventScroll: true }); }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', key); };
  }, [open]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(`Brilho aprovado: ${brightness}%`); setCopied(true); }
    catch { setCopied(false); slider.current?.focus(); }
  };
  return <aside ref={container} className="brightness-tuner" aria-label="Ajuste temporário de brilho">
    <button ref={toggle} className="brightness-tuner__toggle" aria-expanded={open} aria-controls="brightness-panel" onClick={() => setOpen(current => !current)}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
      Brilho <span>{brightness}%</span>
    </button>
    {open && <div className="brightness-tuner__panel" id="brightness-panel">
      <div className="brightness-tuner__heading"><label htmlFor="scene-brightness">Brilho do cenário</label><output htmlFor="scene-brightness">{brightness}%</output></div>
      <input ref={slider} id="scene-brightness" type="range" min="40" max="220" step="1" value={brightness} aria-valuetext={`${brightness} por cento`} onChange={event => setBrightness(Number(event.target.value))}/>
      <div className="brightness-tuner__limits" aria-hidden="true"><span>Mais escuro</span><span>Mais claro</span></div>
      <p>Ajuste temporário. Salvo neste navegador.</p>
      <div className="brightness-tuner__actions"><button onClick={() => setBrightness(DEFAULT_BRIGHTNESS)}>Restaurar 100%</button><button onClick={copy}>{copied ? 'Copiado ✓' : 'Copiar valor'}</button></div>
      <span className="brightness-tuner__status" role="status">{copied ? 'Envie esse valor para fixar o brilho escolhido.' : ''}</span>
    </div>}
  </aside>;
}
