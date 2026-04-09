// ============================================================
//  components/projects/ProjectCard.tsx
//  Carte projet affichée dans la grille (dashboard + liste projets)
// ============================================================

import type { Project } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { useApp } from '../../store/AppContext';
import { ProgressBar, Badge } from '../ui/index';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const { navigateTo } = useApp();
  const { getProjectStats, deleteProject } = useProjects();
  const stats = getProjectStats(project.id);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation(); // Empêche la navigation vers le détail
    if (confirm(`Supprimer "${project.name}" et toutes ses tâches ?`)) {
      deleteProject(project.id);
    }
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    onEdit(project);
  }

  return (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:-translate-y-0.5 group"
      onClick={() => navigateTo('project-detail', project.id)}
    >
      {/* ── En-tête ── */}
      <div className="flex items-start gap-3 mb-4">
        {/* Icône colorée du projet */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${project.color}22` }}
        >
          {project.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-zinc-100 mb-0.5 truncate">
            {project.name}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {project.description || 'Aucune description'}
          </p>
        </div>

        {/* Boutons d'action — visibles au survol */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="xs" onClick={handleEdit} title="Modifier">
            ✏️
          </Button>
          <Button variant="danger" size="xs" onClick={handleDelete} title="Supprimer">
            🗑️
          </Button>
        </div>
      </div>

      {/* ── Badges de stats ── */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <Badge variant="default">{stats.total} tâche{stats.total !== 1 ? 's' : ''}</Badge>
        <Badge variant="low">✓ {stats.done} terminée{stats.done !== 1 ? 's' : ''}</Badge>
        {stats.overdue > 0 && (
          <Badge variant="high">⚠ {stats.overdue} en retard</Badge>
        )}
        {project.endDate && (
          <span className="text-[11px] text-zinc-600">
            📅 Fin: {formatDate(project.endDate)}
          </span>
        )}
      </div>

      {/* ── Barre de progression ── */}
      <div>
        <div className="flex justify-between text-[11px] text-zinc-600 mb-1.5">
          <span>Progression</span>
          <span className="font-semibold" style={{ color: project.color }}>
            {stats.progress}%
          </span>
        </div>
        <ProgressBar value={stats.progress} color={project.color} height="h-1.5" />
      </div>
    </div>
  );
}
