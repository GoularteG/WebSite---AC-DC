import { useEffect, useRef, useState } from 'react';
import '../../styles/loading-screen.css';

export default function LoadingScreen({ active, onUnavailable }) {
  const [visible, setVisible] = useState(active);
  const screen = useRef(null);
  useEffect(() => {
    if (active) { setVisible(true); return; }
    const timer = setTimeout(() => setVisible(false), 380);
    return () => clearTimeout(timer);
  }, [active]);
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement;
    screen.current?.focus({ preventScroll: true });
    // A WebGL/error fallback is a terminal result, never an endless loader.
    const check = () => {
      if (document.querySelector('.scene-fallback,.trunk-webgl-fallback')) onUnavailable();
    };
    const observer = new MutationObserver(check);
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    check();
    return () => {
      observer.disconnect();
      if (previous?.isConnected) previous.focus?.({ preventScroll: true });
    };
  }, [active, onUnavailable]);
  if (!visible && !active) return null;
  return <div ref={screen} className={`rock-loader ${active ? '' : 'rock-loader--ready'}`} role="status" aria-live="polite" aria-label="Carregando a experiência 3D" tabIndex={-1}>
    <div className="rock-loader__art" aria-hidden="true">
      <svg className="rock-loader__bolt rock-loader__bolt--left" viewBox="0 0 80 180"><path d="M46 2 8 98h30l-8 80 43-108H44L64 2Z"/></svg>
      <img src="/images/acdc-logo-red-gold.webp" alt="" width="320" height="140" fetchPriority="high"/>
      <svg className="rock-loader__bolt rock-loader__bolt--right" viewBox="0 0 80 180"><path d="M46 2 8 98h30l-8 80 43-108H44L64 2Z"/></svg>
    </div>
    <span className="rock-loader__label">PREPARANDO A EXPERIÊNCIA</span>
    <span className="rock-loader__track" aria-hidden="true"><i/></span>
  </div>;
}
