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
