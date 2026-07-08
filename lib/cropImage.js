// Client-side canvas helpers for the avatar crop flow.

function createImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

// Downscale a picked file to a JPEG blob with the long edge <= maxSize.
// The cropper runs on this exact blob and the same blob is what gets
// uploaded, so crop coordinates always match the stored image. Also keeps
// uploads under Cloudinary's free-plan file limit and bakes in EXIF
// orientation.
export async function downscaleImage(file, maxSize = 2048, { type = 'image/jpeg', quality = 0.92 } = {}) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await createImage(objectUrl);
    const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
    const outW = Math.round(img.naturalWidth * scale);
    const outH = Math.round(img.naturalHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    canvas.getContext('2d').drawImage(img, 0, 0, outW, outH);

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Could not export image'))),
        type,
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
