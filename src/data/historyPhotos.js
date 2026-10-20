export function licensedPhotoSources(image) {
  if (!image || image.usageStatus !== 'open-license-verified') return [];
  const filename = image.sourceUrl.split('/File:')[1];
  return [
    image.thumbnailUrl,
    filename ? `https://commons.wikimedia.org/wiki/Special:Redirect/file/${filename}?width=960` : null,
    image.fallbackUrl,
  ].filter(Boolean);
}
