'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Eye } from 'lucide-react';

const EMPTY = { title: '', content: '', category: '', excerpt: '', coverImage: '', mediumUrl: '', published: false };

export default function BlogPanel() {
  const [posts, setPosts]     = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [preview, setPreview] = useState(false);

  const load = async () => {
    const res = await fetch('/api/admin/blog');
    if (res.ok) setPosts(await res.json());
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
      const url = editing === 'new' ? '/api/admin/blog' : `/api/admin/blog/${editing}`;
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setEditing(null);
      setForm(EMPTY);
      setPreview(false);
      await load();
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    await load();
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime  = Math.max(1, Math.round(wordCount / 200));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold">Blog</h2>
        <button onClick={() => { setEditing('new'); setForm(EMPTY); setPreview(false); }}
          className="flex items-center gap-1.5 font-mono text-xs bg-em text-bg px-4 py-2 rounded-lg font-medium">
          <Plus size={14} /> New post
        </button>
      </div>

      {editing && (
        <div className="bg-white/[0.04] border border-em/20 rounded-xl p-5 mb-6 space-y-3">
          <input placeholder="Title" value={form.title} onChange={set('title')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Category (e.g. Web dev)" value={form.category} onChange={set('category')}
              className="bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
            <input placeholder="Cover image URL (optional)" value={form.coverImage} onChange={set('coverImage')}
              className="bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />
          </div>

          <input placeholder="Excerpt (short description)" value={form.excerpt} onChange={set('excerpt')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />

          <input placeholder="Medium article URL (optional)" value={form.mediumUrl} onChange={set('mediumUrl')}
            className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em" />

          {/* Markdown editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] text-gray-500">Markdown · {wordCount} words · {readTime} min read</span>
              <button onClick={() => setPreview(!preview)}
                className="flex items-center gap-1 font-mono text-[10px] text-em hover:text-lime transition">
                <Eye size={11} /> {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {preview ? (
              <div className="bg-white/5 border border-em/20 rounded-lg p-4 text-sm text-gray-300 leading-relaxed min-h-[200px] whitespace-pre-wrap">
                {form.content || 'Nothing to preview.'}
              </div>
            ) : (
              <textarea
                rows={12}
                placeholder="Write your post in Markdown..."
                value={form.content}
                onChange={set('content')}
                className="w-full bg-white/5 border border-em/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-em resize-none font-mono"
              />
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={set('published')} className="accent-em" />
              Published
            </label>
            {!form.published && <span className="font-mono text-[10px] text-amber-400">Draft — won&apos;t appear on the site</span>}
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-1.5 font-mono text-xs bg-em text-bg px-4 py-2 rounded-lg font-medium disabled:opacity-60">
              <Save size={13} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setForm(EMPTY); setPreview(false); }}
              className="flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-white px-4 py-2">
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {posts.map(p => (
          <div key={p._id} className="flex items-center gap-3 bg-white/[0.03] border border-em/10 rounded-lg px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{p.title}</div>
              <div className="font-mono text-[10px] text-gray-500 flex gap-2">
                {p.category && <span>{p.category}</span>}
                <span>{p.published ? 'published' : <span className="text-amber-400">draft</span>}</span>
                {p.slug && <span className="text-gray-600">/blog/{p.slug}</span>}
              </div>
            </div>
            <button onClick={() => { setEditing(p._id); setForm(p); setPreview(false); }}
              className="text-gray-500 hover:text-em transition"><Pencil size={14} /></button>
            <button onClick={() => remove(p._id)}
              className="text-gray-500 hover:text-red-400 transition"><Trash2 size={14} /></button>
          </div>
        ))}
        {posts.length === 0 && <p className="text-sm text-gray-600 text-center py-8">No posts yet. Write your first one.</p>}
      </div>
    </div>
  );
}
