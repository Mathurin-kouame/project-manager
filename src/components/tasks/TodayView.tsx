// ============================================================
//  components/tasks/TodayView.tsx — RESPONSIVE
// ============================================================

import type { Task } from '../../types';
import { useApp } from '../../store/AppContext';
import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from './TaskItem';
import { EmptyState } from '../ui/EmptyState';

export function TodayView({ onEditTask }: { onEditTask: (task: Task) => void }) {
  const { state } = useApp();
  const { todayTasks } = useTasks();

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-bold text-base sm:text-lg text-zinc-100">À faire aujourd'hui</h2>
        <p className="text-sm text-zinc-500 mt-1">
          {todayTasks.length === 0
            ? "Aucune tâche prévue pour aujourd'hui."
            : `${todayTasks.length} tâche${todayTasks.length > 1 ? 's' : ''} à traiter`}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {todayTasks.length === 0
          ? <EmptyState icon="✨" title="Journée libre !" sub="Aucune tâche prévue pour aujourd'hui." />
          : todayTasks.map((task) => {
              const project = state.projects.find((p) => p.id === task.projectId);
              return <TaskItem key={task.id} task={task} project={project} onEdit={onEditTask} />;
            })
        }
      </div>
    </div>
  );
}
