// ============================================================
//  components/tasks/TaskItem.tsx — RESPONSIVE
// ============================================================

import type { Task, Project } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { Badge } from '../ui/index';
import { Button } from '../ui/Button';
import { getPriorityConfig, formatDate, isOverdue } from '../../utils';

interface TaskItemProps {
  task: Task;
  project?: Project;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, project, onEdit }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTasks();
  const priority = getPriorityConfig(task.priority);
  const overdue  = isOverdue(task);
  const priorityVariant = task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low';

  return (
    <div className={`bg-zinc-900 border rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 flex items-center gap-3 transition-all group ${task.done ? 'border-zinc-800 opacity-50' : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'}`}>

      {/* Checkbox */}
      <button
        onClick={() => toggleTask(task.id)}
        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${task.done ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-green-500'}`}
        title={task.done ? 'Marquer non terminée' : 'Marquer terminée'}
      >
        {task.done && <span className="text-black text-[10px] font-black">✓</span>}
      </button>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${task.done ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-1.5">
          <Badge variant={priorityVariant}>{priority.icon} {priority.label}</Badge>

          {project && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded hidden sm:inline"
              style={{ background: `${project.color}22`, color: project.color }}>
              {project.emoji} {project.name}
            </span>
          )}

          {task.dueDate && (
            <span className={`text-[11px] flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-zinc-500'}`}>
              📅 {formatDate(task.dueDate)}{overdue && ' ⚠️'}
            </span>
          )}
        </div>
      </div>

      {/* Actions — toujours visibles sur mobile (touch), hover sur desktop */}
      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Button variant="ghost" size="xs" onClick={() => onEdit(task)} title="Modifier">✏️</Button>
        <Button variant="danger" size="xs" onClick={() => deleteTask(task.id)} title="Supprimer">🗑️</Button>
      </div>
    </div>
  );
}
