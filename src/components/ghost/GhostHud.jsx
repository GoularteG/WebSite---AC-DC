const directions = [
  ['KeyW', '↑', 'Avançar'],
  ['KeyA', '←', 'Mover à esquerda'],
  ['KeyS', '↓', 'Recuar'],
  ['KeyD', '→', 'Mover à direita'],
  ['KeyE', '+', 'Subir'],
  ['KeyQ', '−', 'Descer'],
];

export default function GhostHud({ controls, onExit }) {
  const release = key => controls.current.pressed.delete(key);
  return <section className="ghost-hud" aria-label="Câmera fantasma">
    <span className="ghost-hud-kicker" role="status">ϟ CÂMERA FANTASMA DESBLOQUEADA</span>
    <div className="ghost-hud-actions">
      <button type="button" onClick={() => controls.current.overview?.()}>↥ VISÃO GERAL</button>
      <button type="button" onClick={onExit}>↶ VOLTAR À ESTRADA</button>
    </div>
    <p className="ghost-hud-desktop">Arraste para olhar · WASD move · Q/E sobe e desce · Shift acelera · Roda aproxima · Esc sai</p>
    <p className="ghost-hud-mobile">Arraste para olhar · Segure os botões para voar</p>
    <div className="ghost-pad" aria-label="Controles de voo por toque">{directions.map(([key, symbol, label]) =>
      <button key={key} type="button" aria-label={label} onPointerDown={event => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        controls.current.pressed.add(key);
        controls.current.invalidate?.();
      }} onPointerUp={() => release(key)} onPointerCancel={() => release(key)} onLostPointerCapture={() => release(key)}>{symbol}</button>
    )}</div>
  </section>;
}
