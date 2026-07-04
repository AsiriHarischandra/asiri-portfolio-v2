'use client';

import { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

export default function MessagesPanel() {
  const [messages, setMessages] = useState([]);

  const load = async () => {
    const res = await fetch('/api/admin/messages');
    if (res.ok) setMessages(await res.json());
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'PUT' });
    await load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    await load();
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-display text-xl font-bold">Messages</h2>
        {unread > 0 && (
          <span className="font-mono text-[10px] bg-em/20 text-em px-2.5 py-1 rounded-full">
            {unread} unread
          </span>
        )}
      </div>

      <div className="space-y-2">
        {messages.map(m => (
          <div
            key={m._id}
            className={`bg-white/[0.03] border rounded-lg px-4 py-3 ${
              m.read ? 'border-em/10' : 'border-em/30 bg-em/[0.03]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {m.read ? (
                  <MailOpen size={15} className="text-gray-600" />
                ) : (
                  <Mail size={15} className="text-em" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{m.name}</span>
                  <span className="font-mono text-[10px] text-gray-500">{m.email}</span>
                </div>
                {m.subject && (
                  <div className="text-xs text-gray-400 mb-1">{m.subject}</div>
                )}
                <div className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                  {m.message}
                </div>
                <div className="font-mono text-[10px] text-gray-600 mt-2">
                  {new Date(m.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!m.read && (
                  <button onClick={() => markRead(m._id)}
                    className="text-gray-500 hover:text-em transition p-1" title="Mark read">
                    <MailOpen size={14} />
                  </button>
                )}
                <button onClick={() => remove(m._id)}
                  className="text-gray-500 hover:text-red-400 transition p-1" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-gray-600 text-center py-8">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
