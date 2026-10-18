export const JOURNEY_LENGTH = 720;
export const chapters = [
  { id: 'ignition', title: 'IGNITION', subtitle: 'Todo caminho começa com uma faísca.', progress: 0, marker: '01' },
  { id: 'voltage', title: 'HIGH VOLTAGE', subtitle: 'O silêncio fica para trás.', progress: .32, marker: '02' },
  { id: 'redline', title: 'REDLINE', subtitle: 'Siga a luz no horizonte.', progress: .65, marker: '03' },
  { id: 'encore', title: 'THE ENCORE', subtitle: 'O fim é só outro começo.', progress: 1, marker: '04' },
];
export const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const roadX = (distance) => 13 * Math.sin(distance / 110) + 5 * Math.sin(distance / 53);
export const roadHeading = (distance) => Math.atan2(13 / 110 * Math.cos(distance / 110) + 5 / 53 * Math.cos(distance / 53), -1);
export const chapterAt = (progress) => chapters.reduce((current, chapter) => progress >= chapter.progress - .015 ? chapter : current, chapters[0]);
