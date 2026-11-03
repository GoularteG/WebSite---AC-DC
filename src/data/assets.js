// User-supplied GLB, preserved byte-for-byte. See docs/model-inspection.md.
export const carAsset = {
  url: '/models/charger-1970-original.glb',
  length: 5.28,
  rotationY: Math.PI, // source front is +Z after its embedded Sketchfab transform
  wheelNames: [], // merged by material: no independent wheel assemblies
  wheelAxis: 'x',
  wheelRadius: .36,
};
export const audioAsset = { title: 'Highway to Hell', artist: 'AC/DC', url: '/audio/highway-to-hell.mp3', credit: 'Arquivo de áudio enviado pelo autor do projeto.' };
