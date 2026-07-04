'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, Upload } from 'lucide-react';

// Defined at module scope so its identity is stable across renders.
// (A component defined inside SettingsPanel would be recreated on every
// keystroke, remounting the input and stealing focus after each character.)
function Field({ label, field, form, set, type = 'text', rows }) {
  return (
    <div>
      <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
      {rows ? (
        <textarea rows={rows} value={form[field] || ''} onChange={set(field)}
          className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em resize-none" />
      ) : (
        <input type={type} value={form[field] || ''} onChange={set(field)}
          className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
      )}
    </div>
  );
}

export default function SettingsPanel() {
  const [form, setForm]         = useState(null);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(setForm);
  }, []);

  if (!form) return <p className="text-sm text-gray-500">Loading...</p>;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sigRes = await fetch('/api/upload-signature');
      const sig = await sigRes.json();

      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', sig.apiKey);
      fd.append('timestamp', sig.timestamp);
      fd.append('signature', sig.signature);
      fd.append('folder', sig.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: 'POST', body: fd }
      );
      const data = await uploadRes.json();
      setForm({ ...form, avatarUrl: data.secure_url });
    } catch (err) {
      console.error('Avatar upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          tagline: form.tagline,
          university: form.university,
          location: form.location,
          bio: form.bio,
          githubUrl: form.githubUrl,
          linkedinUrl: form.linkedinUrl,
          email: form.email,
          avatarUrl: form.avatarUrl,
          availability: form.availability,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-6">Settings</h2>

      <div className="bg-white/[0.04] border border-em/20 rounded-xl p-5 space-y-4 max-w-xl">
        <Field label="Name" field="name" form={form} set={set} />
        <Field label="Tagline / motto" field="tagline" form={form} set={set} />
        <Field label="University" field="university" form={form} set={set} />
        <Field label="Location" field="location" form={form} set={set} />
        <Field label="Availability status" field="availability" form={form} set={set} />
        <Field label="Bio" field="bio" rows={4} form={form} set={set} />

        {/* Avatar upload */}
        <div>
          <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Avatar</label>
          <div className="flex items-center gap-3">
            {form.avatarUrl && (
              <Image src={form.avatarUrl} alt="Avatar" width={48} height={48} className="w-12 h-12 rounded-full object-cover border border-em/30" />
            )}
            <label className="flex items-center gap-2 font-mono text-xs text-em cursor-pointer bg-em/10 border border-em/30 rounded-lg px-3 py-2">
              <Upload size={13} />
              {uploading ? 'Uploading...' : 'Upload photo'}
              <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
            </label>
          </div>
        </div>

        <Field label="GitHub URL" field="githubUrl" form={form} set={set} />
        <Field label="LinkedIn URL" field="linkedinUrl" form={form} set={set} />
        <Field label="Email" field="email" type="email" form={form} set={set} />

        <div className="flex items-center gap-3 pt-2">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 font-mono text-xs bg-em text-bg px-4 py-2 rounded-lg font-medium disabled:opacity-60">
            <Save size={13} /> {saving ? 'Saving...' : 'Save settings'}
          </button>
          {saved && <span className="font-mono text-xs text-em">Saved — site updated.</span>}
        </div>
      </div>
    </div>
  );
}
