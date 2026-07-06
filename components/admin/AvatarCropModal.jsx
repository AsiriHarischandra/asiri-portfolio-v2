'use client';

import { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { getCroppedImg } from '@/lib/cropImage';

const HEX_PATH = 'M50 0 L100 27.5 L100 82.5 L50 110 L0 82.5 L0 27.5 Z';

export default function AvatarCropModal({ src, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const confirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    setError('');
    try {
      const blob = await getCroppedImg(src, croppedAreaPixels);
      await onConfirm(blob);
    } catch {
      setError('Could not process image — try a different photo.');
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-bg3 border border-em/20 rounded-xl p-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-lg font-bold mb-1">Adjust photo</h3>
        <p className="font-mono text-[10px] text-gray-500 mb-3">
          Drag to reposition · pinch or slide to zoom
        </p>

        {/* Container aspect matches the crop aspect, so the crop frame fills it
            exactly and the hex overlay lines up without any measuring. */}
        <div className="relative w-full aspect-[10/11] rounded-lg overflow-hidden bg-black">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={10 / 11}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, px) => setCroppedAreaPixels(px)}
          />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 110"
            preserveAspectRatio="none"
          >
            <path
              d={`M0 0H100V110H0Z ${HEX_PATH}`}
              fillRule="evenodd"
              fill="black"
              fillOpacity="0.55"
            />
            <path
              d={HEX_PATH}
              fill="none"
              stroke="#A3E635"
              strokeOpacity="0.7"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <ZoomOut size={14} className="text-gray-500 flex-shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-em"
          />
          <ZoomIn size={14} className="text-gray-500 flex-shrink-0" />
        </div>

        {error && <p className="font-mono text-xs text-red-400 mt-3">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            disabled={processing}
            className="font-mono text-xs text-gray-300 border border-em/30 rounded-lg px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={processing}
            className="font-mono text-xs font-bold text-bg bg-em rounded-lg px-4 py-2 disabled:opacity-60"
          >
            {processing ? 'Processing...' : 'Use photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
