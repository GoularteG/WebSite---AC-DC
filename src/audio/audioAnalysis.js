const clamp = value => Math.max(0, Math.min(1, value));
export const createAudioAnalysis = () => ({ bass:0, energy:0, average:0, fluxAverage:0, pulse:0, lastBeat:-10000, lastTime:null, frames:0 });
function band(data, sampleRate, fftSize, low, high) {
  const first=Math.max(1,Math.ceil(low*fftSize/sampleRate));
  const last=Math.min(data.length-1,Math.floor(high*fftSize/sampleRate));
  let total=0;
  for(let i=first;i<=last;i++)total+=(data[i]/255)**2;
  return Math.sqrt(total/Math.max(1,last-first+1));
}
// Frequency ranges use Hz rather than fixed bins, so any sample rate/track works.
export function analyseAudio(data, waveform, sampleRate, fftSize, now, state) {
  const dt=state.lastTime===null?1/30:Math.max(.001,Math.min(.1,(now-state.lastTime)/1000));
  state.lastTime=now;
  let rms=0;for(const sample of waveform)rms+=((sample-128)/128)**2;
  rms=Math.sqrt(rms/waveform.length);
  const bass=band(data,sampleRate,fftSize,40,200);
  const mids=band(data,sampleRate,fftSize,200,2400);
  const highs=band(data,sampleRate,fftSize,2400,10000);
  const energy=.6*bass+.3*mids+.1*highs;
  const flux=Math.max(0,bass-state.bass)*.75+Math.max(0,energy-state.energy)*.25;
  const audible=rms>.006&&energy>.025;
  const onset=flux>Math.max(.025,state.fluxAverage*1.6);
  const beat=audible&&state.frames>5&&onset&&energy>state.average*1.12&&now-state.lastBeat>240;
  const strength=clamp(flux*3+(energy-state.average)*2);
  if(beat)state.lastBeat=now;
  const target=audible?clamp(energy*.18+Math.max(0,bass-state.average)*.6+flux*2.8):0;
  state.pulse+=(target-state.pulse)*(1-Math.exp(-dt/(target > state.pulse ? .025 : .22)));
  const adapt=1-Math.exp(-dt/1.2);
  state.average+=(energy-state.average)*adapt;
  state.fluxAverage+=(flux-state.fluxAverage)*(1-Math.exp(-dt/.5));
  state.bass=bass;state.energy=energy;state.frames++;
  return { pulse:state.pulse,beat,strength,bass,energy };
}
