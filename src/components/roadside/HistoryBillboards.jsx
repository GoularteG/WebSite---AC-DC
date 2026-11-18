import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three';
import { useThree } from '@react-three/fiber';
import { chapters, billboardDistance, distanceAtProgress, roadX } from '../../data/journey';
import { licensedPhotoSources } from '../../data/historyPhotos';
import { useSceneTask } from '../loading/SceneLoading';

const floodMountGeo = new BoxGeometry(.36, .2, .26);
const floodMountMat = new MeshStandardMaterial({ color: '#38383b', metalness: .8, roughness: .38 });
const floodArmGeo = new BoxGeometry(.085, 1.65, .085);
const floodArmMat = new MeshStandardMaterial({ color: '#67666a', metalness: .8, roughness: .35 });
const floodHeadGeo = new BoxGeometry(.65, .48, .25);
const floodHeadMat = new MeshStandardMaterial({ color: '#313238', metalness: .7, roughness: .4 });
const floodLensGeo = new BoxGeometry(.53, .36, .025);
const floodLensMat = new MeshStandardMaterial({ color: '#e5d5ae', emissive: '#ffe4b4', emissiveIntensity: 2.2, toneMapped: false });
const floodCoreGeo = new BoxGeometry(.38, .22, .015);
const floodCoreMat = new MeshBasicMaterial({ color: '#fff1d2', toneMapped: false });
const floodBracketGeo = new BoxGeometry(.055, .32, .26);
const floodBracketMat = new MeshStandardMaterial({ color: '#7b7770', metalness: .8, roughness: .4 });

const postGeo = new CylinderGeometry(.21, .27, 6.6, 8);
const postMat = new MeshStandardMaterial({ color: '#332c2b', metalness: .72, roughness: .55 });
const beamGeo = new BoxGeometry(11.85, .16, .25);
const beamMat = new MeshStandardMaterial({ color: '#675046', metalness: .74, roughness: .47 });
const capGeo = new BoxGeometry(12.5, .28, .42);
const capMat = new MeshStandardMaterial({ color: '#201a1b', metalness: .78, roughness: .42 });
const backingGeo = new BoxGeometry(12.3, 6.2, .44);
const backingMat = new MeshStandardMaterial({ color: '#1b1718', metalness: .62, roughness: .53 });
const posterGeo = new PlaneGeometry(11.8, 5.9);
const sideTrimGeo = new BoxGeometry(.16, 6.2, .2);
const bottomTrimGeo = new BoxGeometry(12.25, .14, .2);
const trimMat = new MeshStandardMaterial({ color: '#7f3f35', metalness: .72, roughness: .48 });

function BillboardFloodlights({ active, hostLights, visible }) {
  const light = useRef(null);
  const target = useMemo(() => {
    const obj = new Object3D();
    obj.position.set(0, 5.45, .04);
    return obj;
  }, []);
  const invalidate = useThree(state => state.invalidate);
  useLayoutEffect(() => {
    if (light.current) {
      light.current.target = target;
      target.updateMatrixWorld(true);
      light.current.updateMatrixWorld(true);
    }
    invalidate();
  }, [active, hostLights, target, invalidate]);
  return <group name="billboard-uplights">
    <primitive object={target}/>
    {hostLights && <spotLight ref={light} target={target} position={[0, 1.93, 2.4]} color="#ffe4bc" intensity={active ? 185 : 0} distance={15} angle={1.18} penumbra={.75} decay={1.8} castShadow={false}/>}
    <group visible={visible}>
      {[-4,0,4].map(x=><group key={x}>
        <mesh position={[x,2.25,.28]} geometry={floodMountGeo} material={floodMountMat} dispose={null}/>
        <mesh position={[x,2.02,1.04]} rotation={[1.87,0,0]} geometry={floodArmGeo} material={floodArmMat} dispose={null}/>
        <group position={[x,1.8,1.85]} rotation={[-2.2,0,0]}>
          <mesh geometry={floodHeadGeo} material={floodHeadMat} dispose={null}/>
          <mesh position={[0,0,.135]} geometry={floodLensGeo} material={floodLensMat} dispose={null}/>
          <mesh position={[0,0,.16]} geometry={floodCoreGeo} material={floodCoreMat} dispose={null}/>
          {[-.35,.35].map(side=><mesh key={side} position={[side,0,-.035]} geometry={floodBracketGeo} material={floodBracketMat} dispose={null}/>)}
        </group>
      </group>)}
    </group>
  </group>;
}

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

function getPoster(cache, chapter) {
  let poster = cache.get(chapter.id);
  if (!poster) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    paintPoster(canvas, chapter, null);
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    poster = {
      canvas,
      texture,
      loadedPhoto: null,
      fontsDone: false,
      photoStarted: false,
      photoDone: false,
      disposed: false,
    };
    cache.set(chapter.id, poster);
  }
  return poster;
}

function Billboard({ chapter, index, poster, onSelect, loadPhoto, activeLighting, hostLights, visible = true }) {
  const mobile = useThree(state => state.size.width < 761);
  const invalidate = useThree(state => state.invalidate);
  const begin = useSceneTask();
  useEffect(() => {
    if (!visible) document.body.style.cursor = '';
  }, [visible]);
  useEffect(() => {
    if (poster.fontsDone) return;
    let active = true;
    const finish = begin?.() ?? (() => {});
    Promise.all([
      document.fonts.load('86px "Metal Mania"'),
      document.fonts.load('63px "New Rocker"'),
    ]).catch(() => {}).then(() => {
      if (poster.disposed) { finish(); return; }
      poster.fontsDone = true;
      paintPoster(poster.canvas, chapter, poster.loadedPhoto);
      poster.texture.needsUpdate = true;
      if (active) invalidate();
      finish();
    });
    return () => { active = false; finish(); };
  }, [chapter, invalidate, poster, begin]);
  useEffect(() => {
    if (!loadPhoto || poster.photoStarted) return;
    poster.photoStarted = true;
    let active = true;
    const finish = begin?.() ?? (() => {});
    let image = null;
    const sources = licensedPhotoSources(chapter.image);
    const complete = photo => {
      if (poster.disposed) { finish(); return; }
      poster.loadedPhoto = photo;
      poster.photoDone = true;
      paintPoster(poster.canvas, chapter, photo);
      poster.texture.needsUpdate = true;
      if (active) invalidate();
      finish();
    };
    const load = index => {
      if (poster.disposed) { finish(); return; }
      if (index >= sources.length) { complete(null); return; }
      image = new Image(); image.crossOrigin = 'anonymous';
      const photo = image;
      photo.onload = () => complete(photo);
      photo.onerror = () => load(index + 1);
      photo.src = sources[index];
    };
    load(0);
    return () => { active = false; finish(); };
  }, [chapter, invalidate, poster, loadPhoto, begin]);
  const distance = billboardDistance(chapter, mobile);
  const side = mobile ? (index === 0 ? -1 : 1) : index % 2 ? 1 : -1;
  return <group position={[roadX(distance) + side * (mobile ? 9.5 : 14), 0, -distance]} rotation={[0, side * -.11, 0]} scale={mobile ? .72 : 1.12}>
    <group visible={visible}>
      {[-4.5, 4.5].map(x => <mesh key={x} position={[x, 3.3, -.39]} geometry={postGeo} material={postMat} dispose={null} />)}
      <mesh position={[0, 2.35, -.48]} geometry={beamGeo} material={beamMat} dispose={null} />
      <mesh position={[0, 8.7, -.42]} geometry={capGeo} material={capMat} dispose={null} />
      <mesh position={[0, 5.45, -.25]} geometry={backingGeo} material={backingMat} dispose={null} />
      <mesh position={[0, 5.45, .008]} geometry={posterGeo} onClick={onSelect ? event => { event.stopPropagation(); document.body.style.cursor = ''; onSelect(chapter); } : undefined} onPointerOver={onSelect ? event => { event.stopPropagation(); document.body.style.cursor = 'pointer'; } : undefined} onPointerOut={onSelect ? () => { document.body.style.cursor = ''; } : undefined}>
        <meshStandardMaterial map={poster.texture} emissiveMap={poster.texture} emissive="#ffffff" emissiveIntensity={.22} roughness={.95} metalness={0} />
      </mesh>
      {[-6.08, 6.08].map(x => <mesh key={x} position={[x, 5.45, .035]} geometry={sideTrimGeo} material={trimMat} dispose={null} />)}
      <mesh position={[0, 2.4, .035]} geometry={bottomTrimGeo} material={trimMat} dispose={null} />
    </group>
    <BillboardFloodlights active={activeLighting} hostLights={hostLights} visible={visible} />
  </group>;
}

export default function HistoryBillboards({ onSelect, targetProgress }) {
  const distance = distanceAtProgress(targetProgress);
  const mobile = useThree(state => state.size.width < 761);
  const postersRef = useRef(null);
  if (!postersRef.current) postersRef.current = new Map();
  const visitedRef = useRef(null);
  if (!visitedRef.current) visitedRef.current = new Set([chapters[0].id]);
  useEffect(() => {
    const cache = postersRef.current;
    return () => {
      cache.forEach(poster => {
        poster.disposed = true;
        poster.texture.dispose();
      });
      cache.clear();
    };
  }, []);
  // Only the board being approached owns real lights: at most three spotlights.
  // Keeping those three spotlights mounted (at intensity 0 when past the last board)
  // keeps NUM_SPOT_LIGHTS constant so Three.js never recompiles shaders at the lava entry.
  const illuminated = chapters.slice(0,8).find(chapter => {
    const s = billboardDistance(chapter, mobile);
    return s > distance - 25 && s < distance + 140;
  });
  const lightHostId = illuminated?.id ?? chapters[0].id;
  return <group name="historical-roadside-billboards">
    {chapters.slice(0, 8).map((chapter, index) => {
      // Keep visited boards and their textures in memory while hiding boards outside the fog range.
      const board = billboardDistance(chapter);
      const inRange = board > distance - 90 && board < distance + 260;
      if (inRange) visitedRef.current.add(chapter.id);
      if (!visitedRef.current.has(chapter.id)) return null;
      const poster = getPoster(postersRef.current, chapter);
      return <Billboard
        key={chapter.id}
        chapter={chapter}
        index={index}
        poster={poster}
        visible={inRange}
        onSelect={inRange ? onSelect : null}
        activeLighting={inRange && chapter.id === illuminated?.id}
        hostLights={chapter.id === lightHostId}
        loadPhoto={board < distance + 215}
      />;
    })}
  </group>;
}
