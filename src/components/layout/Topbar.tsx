// ============================================================
//  components/layout/Topbar.tsx — RESPONSIVE
//  Mobile  : titre + hamburger space + actions condensées
//  Desktop : titre + recherche + boutons complets
// ============================================================

import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Button } from '../ui/Button';
import { exportToCSV } from '../../utils';

interface TopbarProps {
  onNewProject: () => void;
  onNewTask: () => void;
}

const VIEW_LABELS: Record<string, string> = {
  dashboard:        'Tableau de bord',
  projects:         'Projets',
  'all-tasks':      'Toutes les tâches',
  today:            "Aujourd'hui",
  'project-detail': '',
};

export function Topbar({ onNewProject, onNewTask }: TopbarProps) {
  const { state, currentView, currentProjectId, searchQuery, setSearchQuery } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);

  const currentProject = state.projects.find((p) => p.id === currentProjectId);
  const title =
    currentView === 'project-detail' && currentProject
      ? `${currentProject.emoji} ${currentProject.name}`
      : VIEW_LABELS[currentView] ?? currentView;

  const isInProject = currentView === 'project-detail';

  function handleExport() {
    exportToCSV(state.tasks, state.projects);
  }

  return (
    <header className="h-14 bg-slate-950 border-b border-zinc-800 flex items-center gap-3 px-4 lg:px-8 sticky top-0 z-10">

      {/* Espace réservé au hamburger sur mobile */}
      <div className="w-9 lg:hidden flex-shrink-0" />

      {/* Titre */}
      <h1 className="font-bold text-sm lg:text-base text-zinc-100 tracking-tight flex-1 truncate">
        {title}
      </h1>

      {/* ── Recherche desktop (toujours visible ≥ lg) ── */}
      <div className="relative hidden lg:block">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs pointer-events-none">🔍</span>
        <input
          type="text"
          placeholder="Rechercher…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-yellow-400/50 transition w-44 xl:w-52"
        />
      </div>

      {/* ── Recherche mobile : icône → input toggle ── */}
      <div className="lg:hidden flex items-center">
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Rechercher…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-yellow-400/50 transition w-36"
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
              className="text-zinc-500 hover:text-zinc-300 text-sm">✕</button>
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition text-sm">
            🔍
          </button>
        )}
      </div>

      {/* ── Export CSV — masqué sur très petit écran ── */}
      <Button variant="outline" size="sm" onClick={handleExport} className="hidden sm:inline-flex">
        ↓ CSV
      </Button>

      {/* ── CTA principal ── */}
      {isInProject ? (
        <Button size="sm" onClick={onNewTask}>
          <span className="hidden sm:inline">+ Ajouter une tâche</span>
          <span className="sm:hidden">+</span>
        </Button>
      ) : (
        <Button size="sm" onClick={onNewProject}>
          <span className="hidden sm:inline">+ Nouveau projet</span>
          <span className="sm:hidden">+</span>
        </Button>
      )}
    </header>
  );
}
