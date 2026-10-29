import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { useThree } from '@react-three/fiber';
import { chapters, billboardDistance, distanceAtProgress, roadX } from '../../data/journey';
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

function paintPoster(canvas, chapter, photo) {
  const ctx = canvas.getContext('2d');
  const background = ctx.createLinearGradient(0, 0, 1024, 512);
  background.addColorStop(0, '#251719');
  background.addColorStop(.52, '#0c0b0d');
  background.addColorStop(1, '#321719');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1024, 512);
  // Printed halftone and torn diagonal stripes make this a gig poster, not a UI card.
  ctx.fillStyle = '#b1483327';
  for (let y = 18; y < 490; y += 18) {
    for (let x = 450; x < 1000; x += 18) {
      if ((x + y) % 54 !== 0) continue;
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.fillStyle = '#0d0c0eea';
  ctx.fillRect(431, 0, 593, 512);
  ctx.fillStyle = '#a83b2a46';
  ctx.beginPath(); ctx.moveTo(835, 78); ctx.lineTo(905, 78); ctx.lineTo(829, 278);
  ctx.lineTo(883, 278); ctx.lineTo(714, 500); ctx.lineTo(770, 310);
  ctx.lineTo(716, 310); ctx.fill();
  ctx.fillStyle = '#c74229';
  ctx.fillRect(0, 0, 1024, 9);
  ctx.fillRect(0, 503, 1024, 9);
  ctx.fillRect(0, 0, 18, 512);

  ctx.fillStyle = '#e6c9a2';
  ctx.font = 'bold 23px Arial, sans-serif';
  ctx.fillText('AC/DC  •  HIGHWAY ARCHIVE', 46, 48);
  ctx.fillStyle = '#ec603b';
  ctx.fillRect(46, 67, 931, 3);
  ctx.font = '36px "Metal Mania", Impact, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${chapter.marker} / 08`, 970, 48);
  ctx.textAlign = 'left';

  const frame = { x: 48, y: 99, width: 361, height: 349 };
  ctx.fillStyle = '#a92e22';
  ctx.fillRect(59, 109, frame.width, frame.height);
  ctx.fillStyle = '#121011';
  ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
  if (photo) {
    const scale = Math.max(frame.width / photo.naturalWidth, frame.height / photo.naturalHeight);
    const width = photo.naturalWidth * scale;
    const height = photo.naturalHeight * scale;
    ctx.save();
    ctx.beginPath(); ctx.rect(frame.x, frame.y, frame.width, frame.height); ctx.clip();
    ctx.drawImage(photo, frame.x + (frame.width - width) / 2, frame.y + (frame.height - height) / 2, width, height);
    const shade = ctx.createLinearGradient(0, frame.y, 0, frame.y + frame.height);
    shade.addColorStop(0, '#120d0d16'); shade.addColorStop(1, '#120d0d88');
    ctx.fillStyle = shade; ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
    ctx.restore();
  } else {
    ctx.fillStyle = '#9e8a77';
    ctx.font = 'bold 23px Arial, sans-serif';
    ctx.fillText('ARQUIVO FOTOGRÁFICO', 77, 272);
  }
  ctx.strokeStyle = '#d9b58b';
  ctx.lineWidth = 3;
  ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
  ctx.fillStyle = '#171112';
  ctx.fillRect(frame.x + 12, frame.y + frame.height - 40, 249, 28);
  ctx.fillStyle = '#f1c79a';
  ctx.font = 'bold 15px Arial, sans-serif';
  ctx.fillText('AC/DC  /  REGISTRO DE ÉPOCA', frame.x + 24, frame.y + frame.height - 21);

  ctx.fillStyle = '#f05a34';
  ctx.font = '86px "Metal Mania", Impact, sans-serif';
  ctx.fillText(chapter.period.toUpperCase(), 454, 177, 518);
  ctx.fillStyle = '#f5e3c9';
  ctx.font = '63px "New Rocker", "Metal Mania", Impact, sans-serif';
  const lines = wrapTitle(ctx, chapter.title, 506);
  lines.forEach((line, index) => ctx.fillText(line, 454, 270 + index * 69, 509));
  ctx.fillStyle = '#e75d38';
  ctx.fillRect(454, 376, 226, 5);
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillStyle = '#f1c79a';
  ctx.fillText('TOQUE PARA ABRIR A HISTÓRIA  ↗', 454, 429, 515);
  ctx.fillStyle = '#b9a38e';
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.fillText('OITO CAPÍTULOS. UMA ESTRADA.', 454, 466);
}

function makePoster(chapter) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  paintPoster(canvas, chapter, null);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, texture };
}

function Billboard({ chapter, index, onSelect, loadPhoto }) {
  const mobile = useThree(state => state.size.width < 761);
  const invalidate = useThree(state => state.invalidate);
  const poster = useMemo(() => makePoster(chapter), [chapter]);
  useEffect(() => () => poster.texture.dispose(), [poster]);
  useEffect(() => {
    let active = true;
    let loadedPhoto = null;
    const redraw = () => {
      if (!active) return;
      paintPoster(poster.canvas, chapter, loadedPhoto);
      poster.texture.needsUpdate = true;
      invalidate();
    };
    Promise.all([
      document.fonts.load('86px "Metal Mania"'),
      document.fonts.load('63px "New Rocker"'),
    ]).then(redraw).catch(() => {});
    if (!loadPhoto) return () => { active = false; };
    const sources = licensedPhotoSources(chapter.image);
    const load = index => {
      if (index >= sources.length) return;
      const photo = new Image();
      photo.crossOrigin = 'anonymous';
      photo.onload = () => {
        if (!active) return;
        loadedPhoto = photo;
        redraw();
      };
      photo.onerror = () => { if (active) load(index + 1); };
      photo.src = sources[index];
    };
    load(0);
    return () => { active = false; };
  }, [chapter, invalidate, poster, loadPhoto]);
  const distance = billboardDistance(chapter, mobile);
  const side = mobile ? (index === 0 ? -1 : 1) : index % 2 ? 1 : -1;
  return <group position={[roadX(distance) + side * (mobile ? 9.5 : 14), 0, -distance]} rotation={[0, side * -.11, 0]} scale={mobile ? .72 : 1.12}>
    {[-4.5, 4.5].map(x => <mesh key={x} position={[x, 3.3, -.39]} castShadow>
      <cylinderGeometry args={[.21, .27, 6.6, 8]} />
      <meshStandardMaterial color="#332c2b" metalness={.72} roughness={.55} />
    </mesh>)}
    <mesh position={[0, 2.35, -.48]} castShadow>
      <boxGeometry args={[11.85, .16, .25]} />
      <meshStandardMaterial color="#675046" metalness={.74} roughness={.47} />
    </mesh>
    <mesh position={[0, 8.7, -.42]} castShadow>
      <boxGeometry args={[12.5, .28, .42]} />
      <meshStandardMaterial color="#201a1b" metalness={.78} roughness={.42} />
    </mesh>
    <mesh position={[0, 5.45, -.25]} castShadow receiveShadow>
      <boxGeometry args={[12.3, 6.2, .44]} />
      <meshStandardMaterial color="#1b1718" metalness={.62} roughness={.53} />
    </mesh>
    <mesh position={[0, 5.45, .008]} onClick={onSelect ? event => { event.stopPropagation(); document.body.style.cursor = ''; onSelect(chapter); } : undefined} onPointerOver={onSelect ? event => { event.stopPropagation(); document.body.style.cursor = 'pointer'; } : undefined} onPointerOut={onSelect ? () => { document.body.style.cursor = ''; } : undefined}>
      <planeGeometry args={[11.8, 5.9]} />
      <meshBasicMaterial map={poster.texture} toneMapped={false} />
    </mesh>
    {[-6.08, 6.08].map(x => <mesh key={x} position={[x, 5.45, .035]}>
      <boxGeometry args={[.16, 6.2, .2]} />
      <meshStandardMaterial color="#7f3f35" metalness={.72} roughness={.48} />
    </mesh>)}
    <mesh position={[0, 2.4, .035]}>
      <boxGeometry args={[12.25, .14, .2]} />
      <meshStandardMaterial color="#7f3f35" metalness={.72} roughness={.48} />
    </mesh>
    {[-5.5, -3.65, -1.83, 0, 1.83, 3.65, 5.5].map(x => <mesh key={`lamp-${x}`} position={[x, 8.85, .02]}>
      <sphereGeometry args={[.12, 8, 6]} />
      <meshBasicMaterial color="#ffc17e" toneMapped={false} />
    </mesh>)}
  </group>;
}

export default function HistoryBillboards({ onSelect, targetProgress }) {
  const distance = distanceAtProgress(targetProgress);
  return <group name="historical-roadside-billboards">
    {chapters.slice(0, 8).map((chapter, index) => ({chapter, index})).filter(({chapter}) => {
      // Keep the next boards inside the fog range while releasing textures behind the car.
      const board = billboardDistance(chapter);
      return board > distance - 90 && board < distance + 260;
    }).map(({chapter, index}) => <Billboard key={chapter.id} chapter={chapter} index={index} onSelect={onSelect} loadPhoto={billboardDistance(chapter) < distance + 215} />)}
  </group>;
}
