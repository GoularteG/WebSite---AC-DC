import test from 'node:test';
import assert from 'node:assert/strict';
import { analyseAudio, createAudioAnalysis } from '../src/audio/audioAnalysis.js';
const waveform=new Uint8Array(2048).map((_,i)=>128+(i%2?30:-30));
const silence=new Uint8Array(2048).fill(128);
function spectrum(rate,frequency,amplitude){const bins=new Uint8Array(1024);const bin=Math.round(frequency*2048/rate);for(let i=Math.max(1,bin-1);i<=Math.min(1023,bin+1);i++)bins[i]=amplitude;return bins;}
test('bass attacks trigger reactions for different track sample rates',()=>{
 for(const rate of [44100,48000,96000]){
  const state=createAudioAnalysis(),empty=new Uint8Array(1024);
  for(let i=0;i<15;i++)analyseAudio(empty,silence,rate,2048,i*33,state);
  const hit=analyseAudio(spectrum(rate,100,245),waveform,rate,2048,500,state);
  assert.ok(hit.beat);assert.ok(hit.pulse>0);assert.ok(hit.bass>0);
 }
});
test('a sustained tone does not generate repeated beats and silence settles the sky',()=>{
 const state=createAudioAnalysis(),data=spectrum(48000,100,220);
 let beats=0;
 for(let i=0;i<90;i++)if(analyseAudio(data,waveform,48000,2048,i*33,state).beat)beats++;
 assert.equal(beats,0);
 let last;for(let i=90;i<180;i++)last=analyseAudio(new Uint8Array(1024),silence,48000,2048,i*33,state);
 assert.ok(last.pulse<.001);assert.equal(last.beat,false);
});
test('midrange transients also affect the sky without a bass fundamental',()=>{
 const state=createAudioAnalysis(),empty=new Uint8Array(1024);
 for(let i=0;i<20;i++)analyseAudio(empty,silence,48000,2048,i*33,state);
 const data=new Uint8Array(1024);for(let i=10;i<90;i++)data[i]=240;
 const hit=analyseAudio(data,waveform,48000,2048,700,state);
 assert.ok(hit.pulse>0);assert.ok(hit.beat);assert.equal(hit.bass,0);
});
