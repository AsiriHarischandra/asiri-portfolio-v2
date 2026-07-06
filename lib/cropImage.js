// Client-side canvas helpers for the avatar crop flow.

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function createImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

export async function getCroppedImg(
  imageSrc,
  croppedAreaPixels,
  { maxSize = 1024, type = 'image/jpeg', quality = 0.92 } = {}
) {
  const img = await createImage(imageSrc);
  const { x, y, width, height } = croppedAreaPixels;

  // Cap output size — the avatar renders at <=192px, so 1024 leaves plenty
  // of retina headroom while avoiding iOS canvas limits and huge uploads.
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const outW = Math.round(width * scale);
  const outH = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, x, y, width, height, 0, 0, outW, outH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not export image'))),
      type,
      quality
    );
  });
}
