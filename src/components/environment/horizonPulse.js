// Shared by both skies: the sound expands a warm cloud bank, not the whole frame.
export const horizonPulseGLSL = `
vec3 horizonMusic(float height, float energy) {
  float drive = clamp(energy * 2.2, 0., 1.);
  float center = .055 + drive * .035;
  float width = .055 + drive * .12;
  float elevation = (height - center) / width;
  float rimHeight = (height - .025) / .055;
  float bank = exp(-elevation * elevation);
  float lowerRim = exp(-rimHeight * rimHeight);
  float aboveGround = smoothstep(-.04, .015, height);
  vec3 ember = mix(vec3(.85,.12,.025), vec3(1.,.46,.10), drive);
  return aboveGround * drive * (ember * bank * .72 + vec3(.65,.12,.025) * lowerRim * .24);
}`;
