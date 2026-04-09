// ============================================================
//  hooks/useTasks.ts
//  Hook métier pour les opérations sur les tâches
// ============================================================

import { useApp } from '../store/AppContext';
import type { Task } from '../types';
import { filterTasks, todayISO } from '../utils';

export function useTasks(projectId?: string | null) {
  const { state, dispatch, searchQuery } = useApp();

  /** Tâches brutes (filtrées par projet si projectId fourni) */
  const rawTasks = projectId
    ? state.tasks.filter((t) => t.projectId === projectId)
    : state.tasks;

  /** Retourne les tâches filtrées + triées selon un filtre donné */
  function getFiltered(filter = 'all') {
    return filterTasks(rawTasks, filter, searchQuery);
  }

  /** Tâches dont l'échéance est aujourd'hui */
  const todayTasks = state.tasks.filter(
    (t) => t.dueDate === todayISO() && !t.done
  );

  function addTask(data: Omit<Task, 'id' | 'createdAt' | 'done'>) {
    dispatch({ type: 'TASK_ADD', payload: data });
  }

  function updateTask(id: string, data: Partial<Task>) {
    dispatch({ type: 'TASK_UPDATE', payload: { id, ...data } });
  }

  function toggleTask(id: string) {
    dispatch({ type: 'TASK_TOGGLE', payload: id });
  }

  function deleteTask(id: string) {
    dispatch({ type: 'TASK_DELETE', payload: id });
  }

  return {
    tasks: rawTasks,
    allTasks: state.tasks,
    getFiltered,
    todayTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
}
