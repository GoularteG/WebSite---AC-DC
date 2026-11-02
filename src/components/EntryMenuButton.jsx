export default function EntryMenuButton({ variant, children, onClick }) {
  const track = event => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  };
  return <button className={`entry-option entry-${variant}`} onClick={onClick} onPointerMove={track}>
    <span className="entry-energy" aria-hidden="true"/>
    <span className="entry-bolt" aria-hidden="true"><svg viewBox="0 0 24 32"><path d="M13 1 2 18h9L8 31l14-19h-9l5-11Z"/></svg></span>
    <span className="entry-option-copy"><strong>{children}</strong></span>
    <svg className="entry-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>
  </button>;
}
