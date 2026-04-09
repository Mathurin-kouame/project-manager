// ============================================================
//  hooks/useProjects.ts
//  Hook métier pour les opérations sur les projets
//
//  Pourquoi un hook dédié ?
//    - Sépare la logique métier des composants visuels
//    - Réutilisable dans plusieurs composants
//    - Facile à tester unitairement
// ============================================================

import { useApp } from '../store/AppContext';
import type { Project } from '../types';
import { getProjectProgress } from '../utils';

export function useProjects() {
  const { state, dispatch, navigateTo } = useApp();

  /** Tous les projets triés du plus récent au plus ancien */
  const projects = [...state.projects].sort((a, b) => b.createdAt - a.createdAt);

  /** Crée un nouveau projet et navigue vers lui */
  function addProject(data: Omit<Project, 'id' | 'createdAt'>) {
    dispatch({ type: 'PROJECT_ADD', payload: data });
  }

  /** Met à jour les champs d'un projet existant */
  function updateProject(id: string, data: Partial<Project>) {
    dispatch({ type: 'PROJECT_UPDATE', payload: { id, ...data } });
  }

  /** Supprime le projet et toutes ses tâches (cascade dans le reducer) */
  function deleteProject(id: string) {
    dispatch({ type: 'PROJECT_DELETE', payload: id });
    navigateTo('projects');
  }

  /**
   * Calcule les stats d'un projet spécifique
   * Retourné sous forme d'objet pour faciliter l'affichage
   */
  function getProjectStats(projectId: string) {
    const tasks = state.tasks.filter((t) => t.projectId === projectId);
    const done = tasks.filter((t) => t.done).length;
    const overdue = tasks.filter(
      (t) => !t.done && t.dueDate && t.dueDate < new Date().toISOString().split('T')[0]
    ).length;
    return {
      total: tasks.length,
      done,
      pending: tasks.length - done,
      progress: getProjectProgress(tasks),
      overdue,
    };
  }

  return { projects, addProject, updateProject, deleteProject, getProjectStats };
}
