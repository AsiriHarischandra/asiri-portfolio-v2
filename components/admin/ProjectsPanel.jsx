'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Upload } from 'lucide-react';

const EMPTY = {
  title: '', description: '', tags: '', thumbnail: '',
  githubUrl: '', demoUrl: '', featured: false, published: true, order: 0,
};

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing]   = useState(null); // null | 'new' | id
  const [form, setForm]         = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    const res = await fetch('/api/admin/projects');
    if (res.ok) setProjects(await res.json());
  };

  useEffect(() => { load(); }, []);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: val });
  };

  const uploadImage = async (e) => {
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
      setForm({ ...form, thumbnail: data.secure_url });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      tags: typeof form.tags === 'string'
        ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
        : form.tags,
      order: Number(form.order) || 0,
    };

    try {
      if (editing === 'new') {
        await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/api/admin/projects/${editing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setEditing(null);
      setForm(EMPTY);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    await load();
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, tags: p.tags?.join(', ') || '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Projects</h2>
        <button
          onClick={() => { setEditing('new'); setForm(EMPTY); }}
          className="flex items-center gap-1.5 font-mono text-xs bg-em text-bg px-4 py-2 rounded-lg font-medium"
        >
          <Plus size={14} /> Add project
        </button>
      </div>

      {/* Form */}
      {editing && (
        <div className="bg-white/[0.04] border border-em/20 rounded-xl p-5 mb-6 space-y-3">
          <input placeholder="Title" value={form.title} onChange={set('title')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
          <textarea rows={3} placeholder="Description" value={form.description} onChange={set('description')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em resize-none" />
          <input placeholder="Tags (comma separated)" value={form.tags} onChange={set('tags')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 font-mono text-xs text-em cursor-pointer bg-em/10 border border-em/30 rounded-lg px-3 py-2">
              <Upload size={13} />
              {uploading ? 'Uploading...' : 'Upload image'}
              <input type="file" accept="image/*" onChange={uploadImage} className="hidden" />
            </label>
            {form.thumbnail && (
              <span className="text-xs text-gray-500 truncate max-w-[200px]">{form.thumbnail}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="GitHub URL" value={form.githubUrl} onChange={set('githubUrl')}
              className="bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
            <input placeholder="Demo URL" value={form.demoUrl} onChange={set('demoUrl')}
              className="bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="accent-em" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={set('published')} className="accent-em" />
              Published
            </label>
            <input type="number" placeholder="Order" value={form.order} onChange={set('order')}
              className="w-20 bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-1.5 font-mono text-xs bg-em text-bg px-4 py-2 rounded-lg font-medium disabled:opacity-60">
              <Save size={13} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setForm(EMPTY); }}
              className="flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-white px-4 py-2 transition">
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {projects.map(p => (
          <div key={p._id} className="flex items-center gap-3 bg-white/[0.03] border border-em/10 rounded-lg px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{p.title}</div>
              <div className="font-mono text-[10px] text-gray-500 flex items-center gap-2">
                {p.featured && <span className="text-lime">featured</span>}
                {!p.published && <span className="text-amber-400">draft</span>}
                {p.tags?.join(', ')}
              </div>
            </div>
            <button onClick={() => startEdit(p)} className="text-gray-500 hover:text-em transition">
              <Pencil size={14} />
            </button>
            <button onClick={() => remove(p._id)} className="text-gray-500 hover:text-red-400 transition">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-gray-600 text-center py-8">No projects yet. Add your first one.</p>
        )}
      </div>
    </div>
  );
}
