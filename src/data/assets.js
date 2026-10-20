// User-supplied GLB, preserved byte-for-byte. See docs/model-inspection.md.
export const carAsset = {
  url: '/models/charger-1970-original.glb',
  length: 5.28,
  rotationY: Math.PI, // source front is +Z after its embedded Sketchfab transform
  wheelNames: [], // merged by material: no independent wheel assemblies
  wheelAxis: 'x',
  wheelRadius: .36,
};
export const audioAsset = { url: '/audio/highway-to-hell-user.mp3', credit: 'Arquivo de áudio enviado pelo autor do projeto.' };
