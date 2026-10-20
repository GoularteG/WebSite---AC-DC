import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { useThree } from '@react-three/fiber';
import { chapters, billboardDistance, roadX } from '../../data/journey';
import { licensedPhotoSources } from '../../data/historyPhotos';

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
  // Reserve the left side for the licensed archival photograph.
  ctx.fillStyle = '#090909';
  ctx.fillRect(39, 43, 381, 418);
  ctx.strokeStyle = '#c19b7544';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 44, 379, 416);
  ctx.fillStyle = '#8c7665';
  ctx.font = 'bold 23px Arial';
  ctx.fillText('ARQUIVO FOTOGRÁFICO', 74, 254);
  ctx.fillStyle = '#d9683e';
  ctx.fillRect(0, 0, 17, 512);
  ctx.fillRect(36, 34, 952, 3);
  ctx.fillRect(36, 476, 952, 3);
  ctx.fillStyle = '#f1b27e';
  ctx.font = 'bold 25px Arial';
  ctx.fillText(`AC/DC  /  ARQUIVO DA ESTRADA  /  ${chapter.marker}—08`, 448, 84);
  ctx.fillStyle = '#f2d1a4';
  ctx.font = 'bold 80px Impact, Arial Narrow, sans-serif';
  ctx.fillText(chapter.period.toUpperCase(), 448, 190, 535);
  ctx.fillStyle = '#fff0d9';
  ctx.font = 'bold 57px Impact, Arial Narrow, sans-serif';
  const lines = wrapTitle(ctx, chapter.title, 520);
  lines.forEach((line, index) => ctx.fillText(line, 448, 280 + index * 65, 525));
  ctx.fillStyle = '#e58a58';
  ctx.fillRect(448, 410, 175, 4);
  ctx.font = 'bold 23px Arial';
  ctx.fillStyle = '#f1d3b5';
  ctx.fillText('TOQUE PARA CONHECER A HISTÓRIA  ↗', 448, 453);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, texture };
}

function drawPhoto(canvas, photo) {
  const ctx = canvas.getContext('2d');
  const frame = { x: 44, y: 48, width: 371, height: 410 };
  const scale = Math.max(frame.width / photo.naturalWidth, frame.height / photo.naturalHeight);
  const width = photo.naturalWidth * scale;
  const height = photo.naturalHeight * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.width, frame.height);
  ctx.clip();
  ctx.drawImage(photo, frame.x + (frame.width - width) / 2, frame.y + (frame.height - height) / 2, width, height);
  const shade = ctx.createLinearGradient(0, frame.y, 0, frame.y + frame.height);
  shade.addColorStop(0, '#1a0e0d22');
  shade.addColorStop(1, '#120c0e77');
  ctx.fillStyle = shade;
  ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
  ctx.restore();
}

function Billboard({ chapter, index, onSelect }) {
  const mobile = useThree(state => state.size.width < 761);
  const invalidate = useThree(state => state.invalidate);
  const poster = useMemo(() => makePoster(chapter), [chapter]);
  useEffect(() => {
    let active = true;
    const sources = licensedPhotoSources(chapter.image);
    const load = index => {
      if (index >= sources.length) return;
      const photo = new Image();
      photo.crossOrigin = 'anonymous';
      photo.onload = () => {
        if (!active) return;
        drawPhoto(poster.canvas, photo);
        poster.texture.needsUpdate = true;
        invalidate();
      };
      photo.onerror = () => { if (active) load(index + 1); };
      photo.src = sources[index];
    };
    load(0);
    return () => { active = false; poster.texture.dispose(); };
  }, [chapter, invalidate, poster]);
  const distance = billboardDistance(chapter, mobile);
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
    <mesh position={[0, 5.2, -.015]} onClick={onSelect ? event => { event.stopPropagation(); document.body.style.cursor = ''; onSelect(chapter); } : undefined} onPointerOver={onSelect ? event => { event.stopPropagation(); document.body.style.cursor = 'pointer'; } : undefined} onPointerOut={onSelect ? () => { document.body.style.cursor = ''; } : undefined}>
      <planeGeometry args={[11.65, 5.05]} />
      <meshBasicMaterial map={poster.texture} toneMapped={false} />
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
