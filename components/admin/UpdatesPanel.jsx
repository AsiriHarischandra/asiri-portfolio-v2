'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

const TYPES = ['progress', 'learning', 'upcoming', 'achievement'];
const EMPTY = { type: 'progress', title: '', description: '', date: '', active: true };

export default function UpdatesPanel() {
  const [updates, setUpdates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    const res = await fetch('/api/admin/updates');
    if (res.ok) setUpdates(await res.json());
  };

  useEffect(() => { load(); }, []);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: val });
  };

  const save = async () => {
    setSaving(true);
    try {
      const method = editing === 'new' ? 'POST' : 'PUT';
      const url = editing === 'new' ? '/api/admin/updates' : `/api/admin/updates/${editing}`;
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setEditing(null);
      setForm(EMPTY);
      await load();
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this update?')) return;
    await fetch(`/api/admin/updates/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Live updates</h2>
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }}
          className="flex items-center gap-1.5 font-mono text-xs bg-em text-bg px-4 py-2 rounded-lg font-medium">
          <Plus size={14} /> Add update
        </button>
      </div>

      {editing && (
        <div className="bg-white/[0.04] border border-em/20 rounded-xl p-5 mb-6 space-y-3">
          <select value={form.type} onChange={set('type')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none">
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input placeholder="Title" value={form.title} onChange={set('title')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
          <input placeholder="Description" value={form.description} onChange={set('description')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
          <input placeholder="Date (e.g. Jul 2026)" value={form.date} onChange={set('date')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={set('active')} className="accent-em" /> Active
          </label>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-1.5 font-mono text-xs bg-em text-bg px-4 py-2 rounded-lg font-medium disabled:opacity-60">
              <Save size={13} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setForm(EMPTY); }}
              className="flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-white px-4 py-2">
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {updates.map(u => (
          <div key={u._id} className="flex items-center gap-3 bg-white/[0.03] border border-em/10 rounded-lg px-4 py-3">
            <span className={`font-mono text-[10px] tracking-wider uppercase w-24
              ${u.type === 'progress' ? 'text-em' : u.type === 'learning' ? 'text-lime' :
                u.type === 'achievement' ? 'text-amber-300' : 'text-blue-400'}`}>
              {u.type}
            </span>
            <span className="text-sm flex-1 truncate">{u.title}</span>
            <span className="font-mono text-[10px] text-gray-600">{u.date}</span>
            <button onClick={() => { setEditing(u._id); setForm(u); }} className="text-gray-500 hover:text-em transition"><Pencil size={14} /></button>
            <button onClick={() => remove(u._id)} className="text-gray-500 hover:text-red-400 transition"><Trash2 size={14} /></button>
          </div>
        ))}
        {updates.length === 0 && <p className="text-sm text-gray-600 text-center py-8">No updates yet.</p>}
      </div>
    </div>
  );
}
