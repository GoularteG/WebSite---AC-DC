import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export function useSkyAudio(reduced) {
  const invalidate=useThree(state=>state.invalidate);
  const target=useRef(0),flash=useRef(0),last=useRef(-10000);
  const uniforms=useMemo(()=>({musicPulse:{value:0},musicFlash:{value:0},musicStrike:{value:.3}}),[]);
  useEffect(()=>{
    const pulse=event=>{target.current=reduced?0:Math.max(0,Math.min(1,Number(event.detail)||0));invalidate();};
    const beat=event=>{
      const now=performance.now();
      if(reduced||document.hidden||now-last.current<1400||(event.detail?.strength??0)<.3)return;
      last.current=now;flash.current=.2+event.detail.strength*.25;
      uniforms.musicStrike.value=Math.sin(now*.003)*.7;invalidate();
    };
    addEventListener('highway:audio-pulse',pulse);addEventListener('highway:audio-beat',beat);
    return()=>{removeEventListener('highway:audio-pulse',pulse);removeEventListener('highway:audio-beat',beat);};
  },[invalidate,reduced,uniforms]);
  useFrame((_,delta)=>{
    const dt=Math.min(delta,.05);
    uniforms.musicPulse.value+=(target.current-uniforms.musicPulse.value)*(1-Math.exp(-dt*10));
    flash.current=reduced?0:flash.current*Math.exp(-dt*7);
    uniforms.musicFlash.value=flash.current;
    if(flash.current>.002||Math.abs(target.current-uniforms.musicPulse.value)>.003)invalidate();
  });
  return uniforms;
}
