// Curated landmarks, spaced around the historical boards rather than repeated
// at every stop. The two guitars reuse the same attributed GLB at different
// scales and finishes; other kinds are existing project-built stage pieces.
export const roadsideAssets = [
  {
    id: 'first-riff', group: 'guitars', kind: 'model',
    modelPath: '/models/guitar-electric.glb', finish: 'cherry',
    distance: 70, side: 1, offset: 22, height: 8.2,
    rotation: [0, -.18, -.08],
  },
  {
    id: 'tour-stage', group: 'stage', kind: 'stage',
    distance: 230, side: -1, offset: 21, scale: 1.12,
    rotation: [0, -.13, 0],
  },
  {
    id: 'hells-bell', group: 'bells', kind: 'bell',
    distance: 390, side: 1, offset: 22, scale: 1.3,
    rotation: [0, .12, 0],
  },
  {
    id: 'amp-wall', group: 'amps', kind: 'amps',
    distance: 475, side: -1, offset: 21, scale: 1.15,
    rotation: [0, -.18, 0],
  },
  {
    id: 'last-riff', group: 'guitars', kind: 'model',
    modelPath: '/models/guitar-electric.glb', finish: 'original',
    distance: 585, side: 1, offset: 18, height: 5.7,
    rotation: [0, .24, .11],
  },
];
