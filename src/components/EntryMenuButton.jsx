export default function EntryMenuButton({ variant, children, onClick }) {
  const track = event => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  };
  return <button className={`entry-option entry-${variant}`} onClick={onClick} onPointerMove={track}>
    <span className="entry-energy" aria-hidden="true"/>
    <span className="entry-option-copy"><strong>{children}</strong></span>
  </button>;
}
