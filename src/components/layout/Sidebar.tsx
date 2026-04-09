// ============================================================
//  components/layout/Sidebar.tsx — RESPONSIVE
//  Desktop (lg+) : sidebar fixe | Mobile : drawer coulissant
// ============================================================

import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import type { ViewName } from '../../types';

const NAV_LINKS: { view: ViewName; label: string; icon: string }[] = [
  { view: 'dashboard',  label: 'Tableau de bord', icon: '⊞' },
  { view: 'projects',   label: 'Tous les projets', icon: '📂' },
  { view: 'all-tasks',  label: 'Toutes les tâches', icon: '≡' },
  { view: 'today',      label: "Aujourd'hui",       icon: '⏱' },
];

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const { currentView, currentProjectId, navigateTo } = useApp();
  const { projects } = useProjects();
  const { todayTasks, allTasks } = useTasks();
  const pendingCount = allTasks.filter((t) => !t.done).length;

  function handleNav(view: ViewName, projectId?: string) {
    navigateTo(view, projectId);
    onNavigate();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-sm font-bold text-black">⚡</div>
          <span className="font-bold text-lg text-zinc-100 tracking-tight">TaskFlow</span>
        </div>
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1.5 ml-0.5">Projets & Tâches</p>
      </div>

      <nav className="px-3 pt-4 flex-1 overflow-y-auto">
        {NAV_LINKS.map(({ view, label, icon }) => {
          const isActive = currentView === view;
          const count = view === 'all-tasks' ? pendingCount : view === 'today' ? todayTasks.length : view === 'projects' ? projects.length : null;
          return (
            <button key={view} onClick={() => handleNav(view)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all text-left ${isActive ? 'bg-yellow-400/10 text-yellow-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}`}>
              <span className="text-base opacity-80 flex-shrink-0">{icon}</span>
              <span className="flex-1">{label}</span>
              {count !== null && count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${isActive ? 'bg-yellow-400/20 text-yellow-400' : 'bg-zinc-800 text-zinc-500'}`}>{count}</span>
              )}
            </button>
          );
        })}

        <div className="mt-5 mb-2 px-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Mes projets</div>

        {projects.map((project) => {
          const isActive = currentView === 'project-detail' && currentProjectId === project.id;
          return (
            <button key={project.id} onClick={() => handleNav('project-detail', project.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all text-left ${isActive ? 'bg-yellow-400/10 text-yellow-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}`}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: project.color }} />
              <span className="flex-1 truncate">{project.name}</span>
              <span className="text-[10px] font-bold text-zinc-600 flex-shrink-0">{project.emoji}</span>
            </button>
          );
        })}

        <button onClick={() => handleNav('projects')}
          className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg border border-dashed border-zinc-700 text-zinc-600 hover:border-yellow-400/40 hover:text-yellow-400/70 text-xs transition-all">
          <span className="text-base">+</span> Nouveau projet
        </button>
      </nav>

      <div className="px-5 py-4 border-t border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-xs font-bold text-black flex-shrink-0">U</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-200 truncate">Mon espace</p>
            <p className="text-[11px] text-zinc-600">TaskFlow </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — hidden under lg */}
      <aside className="hidden lg:flex w-64 min-w-[256px] border-r border-zinc-800 flex-col fixed inset-y-0 left-0 z-20">
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-30 w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-300 hover:bg-zinc-700 transition"
        aria-label="Ouvrir le menu"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="3" y1="6"  x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 flex items-center justify-center text-sm transition z-10"
          aria-label="Fermer">✕</button>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
