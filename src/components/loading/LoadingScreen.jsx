import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import '../../styles/loading-screen.css';

export default function LoadingScreen({ active, onUnavailable, loadKey }) {
  const [visible, setVisible] = useState(active);
  const screen = useRef(null);
  const assetActive = useProgress(state => state.active);
  const assetProgress = useProgress(state => state.progress);
  const [colorProgress, setColorProgress] = useState(0);
  useEffect(() => { if (active) setColorProgress(0); }, [active, loadKey]);
  useEffect(() => {
    if (!active || !assetActive) return;
    // Reserve the last part for the first rendered frames; never move backwards
    // when another batch of textures or models is discovered.
    setColorProgress(previous => Math.max(previous, Math.min(.95, assetProgress / 100)));
  }, [active, assetActive, assetProgress]);
  useEffect(() => {
    if (active) { setVisible(true); return; }
    const timer = setTimeout(() => setVisible(false), 760);
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
    <div className="rock-loader__art" style={{ '--load': active ? colorProgress : 1 }} aria-hidden="true">
      <img className="rock-loader__mono" src="/images/acdc-logo-red-gold.webp" alt="" width="320" height="140" fetchPriority="high"/>
      <img className="rock-loader__color" src="/images/acdc-logo-red-gold.webp" alt="" width="320" height="140"/>
    </div>
    <span className="rock-loader__label">PREPARANDO A EXPERIÊNCIA</span>
  </div>;
}
