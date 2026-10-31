import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ManagedPageFlip } from './ManagedPageFlip';
import { bindBookDrag } from './bookDrag';
import { entries } from '../../data/book';
import { bookArtwork } from '../../data/bookArtwork';

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}
function createPage(entry, index) {
  const art = bookArtwork[entry.id];
  const leaf = element('div', `folio-leaf leaf-${index % 3}`);
  leaf.dataset.density = 'soft';
  leaf.dataset.page = String(index);
  const paper = element('article', 'paper-surface');
  paper.setAttribute('aria-label', `Página ${index + 1}: ${entry.title}`);
  const content = element('div', 'paper-content');
  const label = element('div', 'paper-label');
  label.append(element('span', '', entry.label.replace(/^\d+ \/ /, '')), element('span', 'paper-edition', 'CADERNO DE CRIAÇÃO'));
  content.append(label, element('h2', '', entry.title));
  const sketch = element('figure', 'paper-sketch');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 280 84');
  svg.setAttribute('aria-hidden', 'true');
  art.paths.forEach(d => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d); svg.append(path);
  });
  sketch.append(svg, element('figcaption', '', art.caption));
  content.append(sketch);
  entry.paragraphs.forEach(text => content.append(element('p', '', text)));
  const note = element('aside', 'paper-decision');
  note.append(element('span', '', 'DECISÃO REGISTRADA'), element('strong', '', art.note));
  content.append(note);
  const footer = element('footer', 'paper-footer');
  footer.append(element('span', '', 'AC/DC · HIGHWAY ARCHIVES'), element('span', 'folio-number', String(index + 1).padStart(2, '0')));
  paper.append(content, footer); leaf.append(paper);
  return leaf;
}

// The engine owns its inner DOM. React owns only the stable surrounding frame.
const PaperBook = forwardRef(function PaperBook({ reduced, onPage, onTurning, onReady }, ref) {
  const host = useRef(null), sizing = useRef(null), engine = useRef(null), current = useRef(0);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const portrait = availableWidth < 720;
  useEffect(() => {
    let mounted = true;
    document.fonts.load('30px "New Rocker"').catch(() => {}).then(() => { if (mounted) setFontsReady(true); });
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setAvailableWidth(Math.round(entry.contentRect.width)));
    observer.observe(sizing.current);
    return () => observer.disconnect();
  }, []);
  useImperativeHandle(ref, () => ({
    next() { if (!engine.current || engine.current.getState() !== 'read') return; reduced ? engine.current.turnToNextPage() : engine.current.flipNext('bottom'); },
    previous() { if (!engine.current || engine.current.getState() !== 'read') return; reduced ? engine.current.turnToPrevPage() : engine.current.flipPrev('bottom'); },
    go(index) { if (!engine.current || engine.current.getState() !== 'read') return; reduced ? engine.current.turnToPage(index) : engine.current.flip(index, 'bottom'); },
  }), [reduced]);
  useEffect(() => {
    if (!availableWidth || !fontsReady) return;
    onReady(false);
    const mount = element('div', 'folio-engine folio-measuring');
    host.current.append(mount);
    const pageWidth = Math.min(portrait ? 460 : 480, availableWidth / (portrait ? 1 : 2));
    const nodes = entries.map(createPage);
    nodes.forEach(node => { node.style.width = `${pageWidth}px`; mount.append(node); });
    // In measurement mode the paper is in normal flow at the actual leaf width.
    // Measuring an absolutely positioned surface used to undercount mobile text.
    const tallest = Math.max(...nodes.map(node => node.querySelector('.paper-content').scrollHeight));
    const pageHeight = Math.max(590, tallest + 6);
    mount.classList.remove('folio-measuring');
    const flip = new ManagedPageFlip(mount, {
      width: pageWidth, height: pageHeight,
      size: 'stretch', minWidth: Math.min(240, pageWidth), maxWidth: pageWidth,
      minHeight: 430, maxHeight: Math.max(1500, pageHeight + 20), startPage: current.current,
      drawShadow: !reduced, maxShadowOpacity: .32, flippingTime: 850,
      showCover: false, usePortrait: portrait, autoSize: true,
      mobileScrollSupport: true, useMouseEvents: false, showPageCorners: false,
      disableFlipByClick: false, swipeDistance: 35,
    });
    engine.current = flip;
    flip.on('flip', event => { current.current = event.data; onPage(event.data, flip.getOrientation() === 'portrait'); });
    flip.on('changeState', event => onTurning(event.data !== 'read'));
    flip.loadFromHTML(nodes);
    const unbindDrag = bindBookDrag(flip, { reduced });
    onPage(flip.getCurrentPageIndex(), flip.getOrientation() === 'portrait');
    onTurning(false); onReady(true);
    return () => { engine.current = null; unbindDrag(); flip.destroy(); mount.remove(); };
  }, [portrait, availableWidth, fontsReady, reduced, onPage, onTurning, onReady]);
  return <div className="folio-sizing" ref={sizing}>
    <div className={`physical-book ${portrait ? 'is-portrait' : ''}`} style={{ maxWidth: portrait ? 460 : 960 }}>
      <div className="leather-board" aria-hidden="true"><i/><i/><i/><i/></div>
      <div className="page-block" aria-hidden="true"/>
      <div className="folio-host" ref={host} aria-label="Páginas do livro de desenvolvimento"/>
      <span className="binding-seam" aria-hidden="true"/>
      <span className="ribbon-bookmark" aria-hidden="true"/>
    </div>
  </div>;
});
export default PaperBook;
