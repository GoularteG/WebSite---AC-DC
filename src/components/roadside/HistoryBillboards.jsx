import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { useThree } from '@react-three/fiber';
import { chapters, distanceAtProgress, roadX } from '../../data/journey';

function wrapTitle(ctx, title, maxWidth) {
  const words = title.toUpperCase().split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function makePoster(chapter) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const background = ctx.createLinearGradient(0, 0, 1024, 512);
  background.addColorStop(0, '#2c1818');
  background.addColorStop(.62, '#161416');
  background.addColorStop(1, '#3c2019');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1024, 512);
  // A printed, weathered surface keeps the boards in the road's visual language.
  ctx.fillStyle = '#d9683e';
  ctx.fillRect(0, 0, 17, 512);
  ctx.fillRect(36, 34, 952, 3);
  ctx.fillRect(36, 476, 952, 3);
  ctx.fillStyle = '#f1b27e';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(`AC/DC  /  THE HIGHWAY ARCHIVE  /  ${chapter.marker}—08`, 56, 84);
  ctx.fillStyle = '#f2d1a4';
  ctx.font = 'bold 95px Impact, Arial Narrow, sans-serif';
  ctx.fillText(chapter.period.toUpperCase(), 56, 192);
  ctx.fillStyle = '#fff0d9';
  ctx.font = 'bold 63px Impact, Arial Narrow, sans-serif';
  const lines = wrapTitle(ctx, chapter.title, 906);
  lines.forEach((line, index) => ctx.fillText(line, 56, 285 + index * 72));
  ctx.fillStyle = '#e58a58';
  ctx.fillRect(56, 413, 210, 4);
  ctx.font = 'bold 27px Arial';
  ctx.fillStyle = '#f1d3b5';
  ctx.fillText('TOQUE PARA CONHECER A HISTÓRIA  ↗', 56, 456);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Billboard({ chapter, index, onSelect }) {
  const mobile = useThree(state => state.size.width < 761);
  const texture = useMemo(() => makePoster(chapter), [chapter]);
  useEffect(() => () => texture.dispose(), [texture]);
  const distance = distanceAtProgress(chapter.progress) + (mobile ? 26 : 17);
  const side = mobile ? (index === 0 ? -1 : 1) : index % 2 ? 1 : -1;
  return <group position={[roadX(distance) + side * (mobile ? 9.5 : 14), 0, -distance]} rotation={[0, side * -.11, 0]} scale={mobile ? .72 : 1}>
    {[-4.4, 4.4].map(x => <mesh key={x} position={[x, 3.2, -.28]} castShadow>
      <cylinderGeometry args={[.14, .2, 6.4, 8]} />
      <meshStandardMaterial color="#4a4640" metalness={.68} roughness={.55} />
    </mesh>)}
    <mesh position={[0, 5.2, -.23]} castShadow receiveShadow>
      <boxGeometry args={[12.1, 5.5, .35]} />
      <meshStandardMaterial color="#282321" metalness={.55} roughness={.56} />
    </mesh>
    <mesh position={[0, 5.2, -.015]} onClick={event => { event.stopPropagation(); document.body.style.cursor = ''; onSelect(chapter); }} onPointerOver={event => { event.stopPropagation(); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
      <planeGeometry args={[11.65, 5.05]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
    {[-5.55, 5.55].map(x => <mesh key={x} position={[x, 5.2, .015]}>
      <boxGeometry args={[.07, 5.2, .09]} />
      <meshStandardMaterial color="#b16f45" metalness={.7} roughness={.4} />
    </mesh>)}
  </group>;
}

export default function HistoryBillboards({ onSelect }) {
  return <group name="historical-roadside-billboards">
    {chapters.slice(0, 8).map((chapter, index) => <Billboard key={chapter.id} chapter={chapter} index={index} onSelect={onSelect} />)}
  </group>;
}
