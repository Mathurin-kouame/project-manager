// ============================================================
//  components/projects/ProjectDetailView.tsx — RESPONSIVE
// ============================================================

import { useState } from 'react';
import type { Task } from '../../types';
import { useApp } from '../../store/AppContext';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from '../tasks/TaskItem';
import { FilterBar, TASK_FILTER_OPTIONS } from '../tasks/FilterBar';
import { ProgressBar } from '../ui/index';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { formatDate } from '../../utils';

interface ProjectDetailViewProps {
  onNewTask: () => void;
  onEditTask: (task: Task) => void;
}

export function ProjectDetailView({ onNewTask, onEditTask }: ProjectDetailViewProps) {
  const { state, currentProjectId } = useApp();
  const { getProjectStats, deleteProject } = useProjects();
  const { getFiltered } = useTasks(currentProjectId);
  const [filter, setFilter] = useState('all');

  const project = state.projects.find((p) => p.id === currentProjectId);
  if (!project) return null;

  const stats = getProjectStats(project.id);
  const filteredTasks = getFiltered(filter);

  return (
    <div>
      {/* ── En-tête projet ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-5 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0"
            style={{ background: `${project.color}22` }}
          >
            {project.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-black text-lg sm:text-xl text-zinc-100 tracking-tight mb-1 truncate">{project.name}</h1>
            <p className="text-xs sm:text-sm text-zinc-500 mb-3 line-clamp-2">{project.description || 'Aucune description'}</p>

            {/* Stats chips — scrollable sur mobile */}
            <div className="flex gap-2 flex-wrap mb-3">
              <StatChip label={`${stats.total} tâche${stats.total !== 1 ? 's' : ''}`} />
              <StatChip label={`✅ ${stats.done} terminée${stats.done !== 1 ? 's' : ''}`} color="#4CAF7D" />
              <StatChip label={`${stats.progress}%`} />
              {project.endDate && <StatChip label={`📅 ${formatDate(project.endDate)}`} />}
              {stats.overdue > 0 && <StatChip label={`⚠️ ${stats.overdue} en retard`} color="#E85447" />}
            </div>

            <ProgressBar value={stats.progress} color={project.color} height="h-1.5" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0 flex-col sm:flex-row">
            <Button size="sm" onClick={onNewTask}>
              <span className="hidden sm:inline">+ Tâche</span>
              <span className="sm:hidden">+</span>
            </Button>
            <Button variant="danger" size="sm"
              onClick={() => { if (confirm(`Supprimer "${project.name}" ?`)) deleteProject(project.id); }}>
              🗑️
            </Button>
          </div>
        </div>
      </div>

      {/* ── Filtres + liste ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <h2 className="font-bold text-sm sm:text-base text-zinc-100">
          Tâches <span className="text-zinc-600 font-normal">({filteredTasks.length})</span>
        </h2>
        {/* Filtres scrollables sur mobile */}
        <div className="overflow-x-auto pb-1 -mx-1 px-1">
          <FilterBar options={TASK_FILTER_OPTIONS} active={filter} onChange={setFilter} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filteredTasks.length === 0
          ? <EmptyState icon="📋" title="Aucune tâche" sub="Ajoutez des tâches à ce projet." />
          : filteredTasks.map((task) => <TaskItem key={task.id} task={task} onEdit={onEditTask} />)
        }
      </div>
    </div>
  );
}

function StatChip({ label, color }: { label: string; color?: string }) {
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-800 whitespace-nowrap" style={{ color: color ?? '#71717a' }}>
      {label}
    </span>
  );
}
