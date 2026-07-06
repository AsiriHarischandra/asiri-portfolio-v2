'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Save, Upload, Plus, Trash2, Crop } from 'lucide-react';
import AvatarCropModal from '@/components/admin/AvatarCropModal';
import { readFileAsDataURL } from '@/lib/cropImage';
import { uploadToCloudinary } from '@/lib/cloudinaryUpload';
import {
  DEFAULT_SKILLS,
  DEFAULT_INTERESTS,
  DEFAULT_TECHSTACK,
  DEFAULT_EDUCATION,
} from '@/lib/defaults';

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

const inputCls =
  'bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em';

function AddButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 font-mono text-xs text-em bg-em/10 border border-em/30 rounded-lg px-3 py-1.5 mt-1">
      <Plus size={13} /> {children}
    </button>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label="Remove"
      className="text-gray-500 hover:text-red-400 shrink-0 p-1">
      <Trash2 size={14} />
    </button>
  );
}

// ── Skills: name + level (0–100) ──
function SkillsEditor({ items, onChange }) {
  const rows = items || [];
  const update = (i, key, val) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: val } : r)));
  return (
    <div>
      <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Skill bars</label>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={r.name || ''} placeholder="Skill" onChange={e => update(i, 'name', e.target.value)}
              className={`${inputCls} flex-1`} />
            <input type="number" min={0} max={100} value={r.level ?? ''} placeholder="%"
              onChange={e => update(i, 'level', e.target.value === '' ? 0 : Number(e.target.value))}
              className={`${inputCls} w-20`} />
            <RemoveButton onClick={() => onChange(rows.filter((_, j) => j !== i))} />
          </div>
        ))}
      </div>
      <AddButton onClick={() => onChange([...rows, { name: '', level: 50 }])}>Add skill</AddButton>
    </div>
  );
}

// ── Interests: list of strings ──
function InterestsEditor({ items, onChange }) {
  const rows = items || [];
  return (
    <div>
      <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Interest tags</label>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={r || ''} placeholder="Interest" onChange={e => onChange(rows.map((v, j) => (j === i ? e.target.value : v)))}
              className={`${inputCls} flex-1`} />
            <RemoveButton onClick={() => onChange(rows.filter((_, j) => j !== i))} />
          </div>
        ))}
      </div>
      <AddButton onClick={() => onChange([...rows, ''])}>Add interest</AddButton>
    </div>
  );
}

// ── Tech stack: name + optional category ──
function TechEditor({ items, onChange }) {
  const rows = items || [];
  const update = (i, key, val) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: val } : r)));
  return (
    <div>
      <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Tech stack pills</label>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={r.name || ''} placeholder="Name (e.g. React)" onChange={e => update(i, 'name', e.target.value)}
              className={`${inputCls} flex-1`} />
            <input value={r.category || ''} placeholder="Category (optional)" onChange={e => update(i, 'category', e.target.value)}
              className={`${inputCls} flex-1`} />
            <RemoveButton onClick={() => onChange(rows.filter((_, j) => j !== i))} />
          </div>
        ))}
      </div>
      <AddButton onClick={() => onChange([...rows, { name: '', category: '' }])}>Add tech</AddButton>
    </div>
  );
}

// ── Education: period + title + subtitle ──
function EducationEditor({ items, onChange }) {
  const rows = items || [];
  const update = (i, key, val) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: val } : r)));
  return (
    <div>
      <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Education timeline</label>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="flex items-start gap-2 bg-white/[0.03] border border-em/15 rounded-lg p-2">
            <div className="flex-1 space-y-2">
              <input value={r.period || ''} placeholder="Period (e.g. 2022 — 2024)" onChange={e => update(i, 'period', e.target.value)}
                className={`${inputCls} w-full`} />
              <input value={r.title || ''} placeholder="Title (e.g. BSc Computer Science)" onChange={e => update(i, 'title', e.target.value)}
                className={`${inputCls} w-full`} />
              <input value={r.subtitle || ''} placeholder="Subtitle (e.g. University of Moratuwa)" onChange={e => update(i, 'subtitle', e.target.value)}
                className={`${inputCls} w-full`} />
            </div>
            <RemoveButton onClick={() => onChange(rows.filter((_, j) => j !== i))} />
          </div>
        ))}
      </div>
      <AddButton onClick={() => onChange([...rows, { period: '', title: '', subtitle: '' }])}>Add education entry</AddButton>
    </div>
  );
}

export default function SettingsPanel() {
  const [form, setForm]         = useState(null);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc]     = useState(null);
  const [cropLoading, setCropLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  // True when cropSrc is an object URL that must be revoked on close.
  const cropSrcIsObjectUrl = useRef(false);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(data => {
      // Seed the editable arrays with current defaults when the stored doc
      // predates these fields, so the owner edits real content, not blanks.
      setForm({
        ...data,
        skills:    data.skills?.length    ? data.skills    : DEFAULT_SKILLS,
        interests: data.interests?.length ? data.interests : DEFAULT_INTERESTS,
        techStack: data.techStack?.length ? data.techStack : DEFAULT_TECHSTACK,
        education: data.education?.length ? data.education : DEFAULT_EDUCATION,
      });
    });
  }, []);

  if (!form) return <p className="text-sm text-gray-500">Loading...</p>;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setArr = (field) => (value) => setForm({ ...form, [field]: value });

  const closeCrop = () => {
    if (cropSrcIsObjectUrl.current && cropSrc) URL.revokeObjectURL(cropSrc);
    cropSrcIsObjectUrl.current = false;
    setCropSrc(null);
  };

  const onFileSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;
    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image is too large (max 15MB).');
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      cropSrcIsObjectUrl.current = false;
      setCropSrc(dataUrl);
    } catch {
      setUploadError('Could not read that file — try another one.');
    }
  };

  // Re-open the cropper on the already-uploaded photo. Fetch → object URL
  // (instead of crossOrigin on <img>) so the canvas can never be tainted
  // by a cached non-CORS response.
  const adjustExisting = async () => {
    if (!form.avatarUrl) return;
    setUploadError('');
    setCropLoading(true);
    try {
      const res = await fetch(form.avatarUrl);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      cropSrcIsObjectUrl.current = true;
      setCropSrc(URL.createObjectURL(blob));
    } catch {
      setUploadError('Could not load current photo — upload a new one.');
    } finally {
      setCropLoading(false);
    }
  };

  const handleCropConfirm = async (blob) => {
    closeCrop();
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadToCloudinary(blob, 'avatar.jpg');
      setForm((f) => ({ ...f, avatarUrl: url }));
    } catch (err) {
      setUploadError(err.message || 'Upload failed — try again.');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const res = await fetch('/api/admin/settings', {
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
          avatarBadge: form.avatarBadge,
          availability: form.availability,
          skills: (form.skills || []).filter(s => s.name?.trim()),
          interests: (form.interests || []).map(i => i.trim()).filter(Boolean),
          techStack: (form.techStack || []).filter(t => t.name?.trim()),
          education: (form.education || []).filter(e => e.title?.trim() || e.period?.trim()),
        }),
      });

      if (!res.ok) {
        // Surface the real reason instead of a false "Saved".
        let msg = `Save failed (${res.status})`;
        if (res.status === 401) msg = 'Session expired — log in again.';
        else {
          const data = await res.json().catch(() => null);
          if (data?.error) msg = data.error;
        }
        setError(msg);
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Network error — could not reach the server.');
    } finally { setSaving(false); }
  };

  return (
    <div>
      {cropSrc && (
        <AvatarCropModal src={cropSrc} onCancel={closeCrop} onConfirm={handleCropConfirm} />
      )}

      <h2 className="font-display text-xl font-bold mb-6">Settings</h2>

      <div className="bg-white/[0.04] border border-em/20 rounded-xl p-5 space-y-4 max-w-xl">
        <Field label="Name" field="name" form={form} set={set} />
        <Field label="Tagline / motto" field="tagline" form={form} set={set} />
        <Field label="University" field="university" form={form} set={set} />
        <Field label="Location" field="location" form={form} set={set} />
        <Field label="Availability status" field="availability" form={form} set={set} />
        <Field label="Avatar badge (e.g. UoM · CS)" field="avatarBadge" form={form} set={set} />
        <Field label="Bio" field="bio" rows={4} form={form} set={set} />

        {/* Avatar upload */}
        <div>
          <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Avatar</label>
          <div className="flex items-center gap-4">
            {/* Live hexagon preview — same clip-path and aspect as the hero */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-24 aspect-[10/11]">
                <div
                  className="absolute inset-0 bg-bg3 border border-em/60 flex items-center justify-center overflow-hidden"
                  style={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
                >
                  {form.avatarUrl ? (
                    <Image src={form.avatarUrl} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <span className="font-display text-xl font-extrabold text-em">AH</span>
                  )}
                </div>
              </div>
              <span className="font-mono text-[10px] text-gray-500">hero preview</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 font-mono text-xs text-em cursor-pointer bg-em/10 border border-em/30 rounded-lg px-3 py-2">
                <Upload size={13} />
                {uploading ? 'Uploading...' : 'Upload photo'}
                <input type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
              </label>
              {form.avatarUrl && (
                <button
                  type="button"
                  onClick={adjustExisting}
                  disabled={cropLoading}
                  className="flex items-center gap-2 font-mono text-xs text-gray-300 border border-em/30 rounded-lg px-3 py-2 disabled:opacity-60"
                >
                  <Crop size={13} />
                  {cropLoading ? 'Loading...' : 'Adjust'}
                </button>
              )}
            </div>
          </div>
          {uploadError && <p className="font-mono text-xs text-red-400 mt-2">{uploadError}</p>}
        </div>

        <Field label="GitHub URL" field="githubUrl" form={form} set={set} />
        <Field label="LinkedIn URL" field="linkedinUrl" form={form} set={set} />
        <Field label="Email" field="email" type="email" form={form} set={set} />

        {/* Editable section content */}
        <div className="border-t border-em/15 pt-4 space-y-5">
          <p className="font-mono text-[10px] text-em/70 uppercase tracking-wider">About · Tech stack · Education</p>
          <SkillsEditor    items={form.skills}    onChange={setArr('skills')} />
          <InterestsEditor items={form.interests} onChange={setArr('interests')} />
          <TechEditor      items={form.techStack} onChange={setArr('techStack')} />
          <EducationEditor items={form.education} onChange={setArr('education')} />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 font-mono text-xs bg-em text-bg px-4 py-2 rounded-lg font-medium disabled:opacity-60">
            <Save size={13} /> {saving ? 'Saving...' : 'Save settings'}
          </button>
          {saved && <span className="font-mono text-xs text-em">Saved — site updated.</span>}
          {error && <span className="font-mono text-xs text-red-400">{error}</span>}
        </div>
      </div>
    </div>
  );
}
