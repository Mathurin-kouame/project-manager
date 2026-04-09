// ============================================================
//  types/index.ts
//  Définitions TypeScript centralisées pour toute l'application
// ============================================================

// ------ PRIORITÉ -----------------------------------------------
export type Priority = 'low' | 'medium' | 'high';

// ------ PROJET -------------------------------------------------
export interface Project {
  id: string;
  name: string;
  description: string;
  emoji: string;       // Icône choisie par l'utilisateur
  color: string;       // Couleur HEX du projet
  startDate?: string;  // Format ISO: "YYYY-MM-DD"
  endDate?: string;
  createdAt: number;   // timestamp ms
}

// ------ TÂCHE --------------------------------------------------
export interface Task {
  id: string;
  projectId: string;   // Clé étrangère → Project.id
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;    // Format ISO: "YYYY-MM-DD"
  done: boolean;
  createdAt: number;
}

// ------ VUES (navigation) --------------------------------------
export type ViewName =
  | 'dashboard'
  | 'projects'
  | 'project-detail'
  | 'all-tasks'
  | 'today';

// ------ FILTRES TÂCHES -----------------------------------------
export type TaskFilter = 'all' | 'pending' | 'done' | 'high' | 'medium' | 'low';

// ------ ÉTAT MODAL ---------------------------------------------
export interface ModalState {
  isOpen: boolean;
  editId?: string | null;  // null = création, string = édition
}
