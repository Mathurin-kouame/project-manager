// ============================================================
//  components/tasks/AllTasksView.tsx — RESPONSIVE
// ============================================================

import { useState } from 'react';
import type { Task } from '../../types';
import { useApp } from '../../store/AppContext';
import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from './TaskItem';
import { FilterBar } from './FilterBar';
import { EmptyState } from '../ui/EmptyState';

const ALL_OPTIONS = [
  { value: 'all',     label: 'Toutes' },
  { value: 'pending', label: 'En cours' },
  { value: 'done',    label: 'Terminées' },
  { value: 'high',    label: '🔴 Haute' },
  { value: 'medium',  label: '🟠 Moyenne' },
  { value: 'low',     label: '🟢 Basse' },
];

export function AllTasksView({ onEditTask }: { onEditTask: (task: Task) => void }) {
  const { state } = useApp();
  const { getFiltered } = useTasks();
  const [filter, setFilter] = useState('all');
  const tasks = getFiltered(filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="font-bold text-base sm:text-lg text-zinc-100">
          Toutes les tâches <span className="text-zinc-600 font-normal text-sm">({tasks.length})</span>
        </h2>
        {/* Filtres horizontaux scrollables sur mobile */}
        <div className="overflow-x-auto pb-1 -mx-1 px-1">
          <FilterBar options={ALL_OPTIONS} active={filter} onChange={setFilter} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.length === 0
          ? <EmptyState icon="🎉" title="Aucune tâche" sub="Changez les filtres ou créez une tâche." />
          : tasks.map((task) => {
              const project = state.projects.find((p) => p.id === task.projectId);
              return <TaskItem key={task.id} task={task} project={project} onEdit={onEditTask} />;
            })
        }
      </div>
    </div>
  );
}
