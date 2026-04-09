// ============================================================
//  utils/index.ts
//  Fonctions utilitaires pures (sans effets de bord)
// ============================================================

import type { Priority, Task } from '../types';

// ------ IDENTIFIANT UNIQUE ------------------------------------
/**
 * Génère un ID unique court (non-crypto, usage UI)
 * Combine timestamp base36 + random pour éviter collisions
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ------ DATE --------------------------------------------------
/**
 * Retourne la date du jour au format "YYYY-MM-DD"
 * Utilisé pour comparer les échéances
 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Formate une date ISO "YYYY-MM-DD" → "DD/MM/YYYY"
 * Retourne une chaîne vide si pas de date fournie
 */
export function formatDate(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Retourne true si la date est passée ET que la tâche n'est pas terminée
 */
export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.done) return false;
  return task.dueDate < todayISO();
}

// ------ PRIORITÉ ----------------------------------------------
const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: string }> = {
  high:   { label: 'Haute',   color: 'text-red-400',    icon: '🔴' },
  medium: { label: 'Moyenne', color: 'text-orange-400', icon: '🟠' },
  low:    { label: 'Basse',   color: 'text-green-400',  icon: '🟢' },
};

export function getPriorityConfig(priority: Priority) {
  return PRIORITY_CONFIG[priority];
}

// ------ STATISTIQUES PROJET -----------------------------------
/**
 * Calcule le pourcentage de complétion d'un projet
 * Retourne 0 si aucune tâche
 */
export function getProjectProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.done).length;
  return Math.round((done / tasks.length) * 100);
}

// ------ FILTRAGE TÂCHES ---------------------------------------
/**
 * Applique un filtre sur une liste de tâches
 * Extrait la logique de filtrage hors des composants (SRP)
 */
export function filterTasks(tasks: Task[], filter: string, query = ''): Task[] {
  let result = [...tasks];

  // Filtre par statut / priorité
  if (filter === 'pending') result = result.filter((t) => !t.done);
  else if (filter === 'done') result = result.filter((t) => t.done);
  else if (filter === 'high') result = result.filter((t) => t.priority === 'high');
  else if (filter === 'medium') result = result.filter((t) => t.priority === 'medium');
  else if (filter === 'low') result = result.filter((t) => t.priority === 'low');

  // Filtre par recherche textuelle
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  // Tri : tâches en cours avant terminées, puis par priorité
  result.sort((a, b) => {
    if (!a.done && b.done) return -1;
    if (a.done && !b.done) return 1;
    const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return result;
}

// ------ EXPORT CSV --------------------------------------------
/**
 * Génère et télécharge un fichier CSV à partir des tâches et projets
 */
export function exportToCSV(
  tasks: Task[],
  projects: { id: string; name: string }[]
): void {
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.name]));
  const priorityLabels: Record<Priority, string> = {
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
  };

  const headers = ['ID', 'Titre', 'Projet', 'Priorité', 'Échéance', 'Statut', 'Créé le'];
  const rows = tasks.map((t) => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${(projectMap[t.projectId] ?? '').replace(/"/g, '""')}"`,
    priorityLabels[t.priority],
    t.dueDate ?? '',
    t.done ? 'Terminé' : 'En cours',
    new Date(t.createdAt).toLocaleDateString('fr-FR'),
  ]);

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow_export_${todayISO()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
