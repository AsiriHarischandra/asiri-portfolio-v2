'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, FolderKanban, Zap, FileText,
  MessageSquare, Settings, LogOut,
} from 'lucide-react';
import ProjectsPanel  from '@/components/admin/ProjectsPanel';
import UpdatesPanel   from '@/components/admin/UpdatesPanel';
import BlogPanel      from '@/components/admin/BlogPanel';
import MessagesPanel  from '@/components/admin/MessagesPanel';
import SettingsPanel  from '@/components/admin/SettingsPanel';

const TABS = [
  { key: 'projects', label: 'Projects',  icon: FolderKanban },
  { key: 'updates',  label: 'Updates',   icon: Zap },
  { key: 'blog',     label: 'Blog',      icon: FileText },
  { key: 'messages', label: 'Messages',  icon: MessageSquare },
  { key: 'settings', label: 'Settings',  icon: Settings },
];

export default function Dashboard() {
  const [tab, setTab] = useState('projects');
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-52 bg-bg2 border-r border-em/10 flex flex-col p-4 gap-1">
        <div className="flex items-center gap-2 mb-6 px-2">
          <LayoutDashboard size={16} className="text-em" />
          <span className="font-display font-bold text-em text-sm">Admin</span>
        </div>

        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-lg text-sm transition
              ${tab === t.key
                ? 'bg-em/10 text-em font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}

        <button
          onClick={logout}
          className="flex items-center gap-2.5 mt-auto text-red-400/70 hover:text-red-400 text-sm px-3 py-2 transition"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {tab === 'projects' && <ProjectsPanel />}
        {tab === 'updates'  && <UpdatesPanel />}
        {tab === 'blog'     && <BlogPanel />}
        {tab === 'messages' && <MessagesPanel />}
        {tab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
}
