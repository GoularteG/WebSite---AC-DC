import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ManagedPageFlip } from './ManagedPageFlip';
import { bindBookDrag } from './bookDrag';
import { entries } from '../../data/book';

function createPage(entry, index) {
  const leaf = document.createElement('div');
  leaf.className = `folio-leaf leaf-${index % 3}`;
  leaf.dataset.density = 'soft';
  const paper = document.createElement('article');
  paper.className = 'paper-surface';
  const content = document.createElement('div');
  content.className = 'paper-content';
  const label = document.createElement('span');
  label.className = 'paper-label'; label.textContent = entry.label;
  const title = document.createElement('h2'); title.textContent = entry.title;
  content.append(label, title);
  entry.paragraphs.forEach(text => {
    const paragraph = document.createElement('p'); paragraph.textContent = text; content.append(paragraph);
  });
  const number = document.createElement('span');
  number.className = 'folio-number'; number.textContent = String(index + 1).padStart(2, '0');
  const ornament = document.createElement('span');
  ornament.className = 'paper-ornament'; ornament.setAttribute('aria-hidden', 'true'); ornament.textContent = 'ϟ';
  paper.append(content, ornament, number); leaf.append(paper);
  return leaf;
}

// PageFlip owns only the inner element; React owns the stable, empty host.
// Keeping these DOM trees separate avoids conflicts when the library folds leaves.
const PaperBook = forwardRef(function PaperBook({ reduced, onPage, onTurning }, ref) {
  const host = useRef(null), engine = useRef(null), current = useRef(0);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    document.fonts.load('34px "Metal Mania"').then(() => { if (mounted) setFontsReady(true); });
    return () => { mounted = false; };
  }, []);
  const [portrait, setPortrait] = useState(() => matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const media = matchMedia('(max-width: 760px)');
    const update = () => setPortrait(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setAvailableWidth(Math.round(entry.contentRect.width)));
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useImperativeHandle(ref, () => ({
    next() { if (!engine.current) return; reduced ? engine.current.turnToNextPage() : engine.current.flipNext('bottom'); },
    previous() { if (!engine.current) return; reduced ? engine.current.turnToPrevPage() : engine.current.flipPrev('bottom'); },
    go(index) { if (!engine.current) return; reduced ? engine.current.turnToPage(index) : engine.current.flip(index, 'bottom'); },
  }), [reduced]);
  useEffect(() => {
    if (!availableWidth || !fontsReady) return;
    const mount = document.createElement('div'); mount.className = 'folio-engine';
    host.current.append(mount);
    const nodes = entries.map(createPage); nodes.forEach(node => mount.append(node));
    // Measure every unchanged entry at the actual page width before pagination.
    // A long entry sets a taller physical page instead of being clipped on phones.
    const pageWidth = Math.min(portrait ? 460 : 480, availableWidth / (portrait ? 1 : 2));
    nodes.forEach(node => { node.style.width = `${pageWidth}px`; });
    const tallest = Math.max(...nodes.map(node => node.querySelector('.paper-content').scrollHeight));
    const pageHeight = Math.max(portrait ? 640 : 610, tallest + 22);
    const flip = new ManagedPageFlip(mount, {
      width: pageWidth, height: pageHeight,
      size: 'stretch', minWidth: portrait ? 250 : 300, maxWidth: portrait ? 460 : 480,
      minHeight: 430, maxHeight: Math.max(950, pageHeight + 20), startPage: current.current,
      drawShadow: !reduced, maxShadowOpacity: .5, flippingTime: 1050,
      showCover: false, usePortrait: portrait, autoSize: true,
      mobileScrollSupport: true, useMouseEvents: false, showPageCorners: false,
      disableFlipByClick: true, swipeDistance: 35,
    });
    engine.current = flip;
    flip.on('flip', event => { current.current = event.data; onPage(event.data, portrait); });
    flip.on('changeState', event => onTurning(event.data !== 'read'));
    flip.loadFromHTML(nodes);
    const unbindDrag = reduced ? () => {} : bindBookDrag(flip);
    onPage(flip.getCurrentPageIndex(), portrait);
    onTurning(false);
    return () => { engine.current = null; unbindDrag(); flip.destroy(); mount.remove(); };
  }, [portrait, availableWidth, fontsReady, reduced, onPage, onTurning]);
  return <div className={`physical-book ${portrait ? 'is-portrait' : ''}`}>
    <div className="leather-board" aria-hidden="true"><i/><i/><i/><i/></div>
    <div className="page-block" aria-hidden="true"/>
    <div className="folio-host" ref={host} aria-label="Páginas do livro de desenvolvimento"/>
    <span className="binding-seam" aria-hidden="true"/>
    <span className="ribbon-bookmark" aria-hidden="true"/>
  </div>;
});
export default PaperBook;
