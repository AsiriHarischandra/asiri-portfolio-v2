// Insert a crop delivery transformation into a Cloudinary URL so the
// framed region is served without re-uploading. `crop` is in the pixel
// space of the uploaded original ({x, y, width, height}).
export function buildCroppedUrl(originalUrl, crop) {
  const marker = '/upload/';
  const i = originalUrl.indexOf(marker);
  if (i === -1 || !crop) return originalUrl;
  const t = `c_crop,x_${crop.x},y_${crop.y},w_${crop.width},h_${crop.height}/c_limit,w_1024`;
  return originalUrl.slice(0, i + marker.length) + t + '/' + originalUrl.slice(i + marker.length);
}

// Signed browser-to-Cloudinary upload for a File or Blob.
export async function uploadToCloudinary(fileOrBlob, filename = 'upload.jpg') {
  const sigRes = await fetch('/api/upload-signature');
  if (!sigRes.ok) throw new Error('Could not get upload signature');
  const sig = await sigRes.json();

  const fd = new FormData();
  fd.append('file', fileOrBlob, filename);
  fd.append('api_key', sig.apiKey);
  fd.append('timestamp', sig.timestamp);
  fd.append('signature', sig.signature);
  fd.append('folder', sig.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: 'POST', body: fd }
  );
  const data = await uploadRes.json().catch(() => null);
  if (!uploadRes.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || 'Upload failed');
  }
  return data.secure_url;
}
