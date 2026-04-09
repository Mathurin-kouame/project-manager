// ============================================================
//  store/appStore.ts
//  État global de l'application avec useReducer + localStorage
//
//  Pattern : Flux unidirectionnel des données
//    UI → dispatch(Action) → reducer → nouvel état → re-render
//
//  Pourquoi useReducer ?
//    - État centralisé et prévisible
//    - Les actions sont explicitement nommées (traçabilité)
//    - Plus scalable que plusieurs useState imbriqués
// ============================================================

import { useReducer, useEffect } from 'react';
import type { Project, Task } from '../types';
import { generateId } from '../utils';

// ------ SHAPE DE L'ÉTAT ---------------------------------------
export interface AppState {
  projects: Project[];
  tasks: Task[];
}

// ------ ACTIONS (discriminated union) -------------------------
// TypeScript utilise le champ "type" pour discriminer les cas
export type AppAction =
  // Projets
  | { type: 'PROJECT_ADD'; payload: Omit<Project, 'id' | 'createdAt'> }
  | { type: 'PROJECT_UPDATE'; payload: { id: string } & Partial<Project> }
  | { type: 'PROJECT_DELETE'; payload: string }
  // Tâches
  | { type: 'TASK_ADD'; payload: Omit<Task, 'id' | 'createdAt' | 'done'> }
  | { type: 'TASK_UPDATE'; payload: { id: string } & Partial<Task> }
  | { type: 'TASK_TOGGLE'; payload: string }
  | { type: 'TASK_DELETE'; payload: string };

// ------ REDUCER -----------------------------------------------
/**
 * Fonction pure : (état actuel, action) → nouvel état
 * Ne jamais muter l'état directement — toujours retourner un nouveau objet
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    // ── PROJETS ──────────────────────────────────────────────
    case 'PROJECT_ADD':
      return {
        ...state,
        projects: [
          ...state.projects,
          { ...action.payload, id: generateId(), createdAt: Date.now() },
        ],
      };

    case 'PROJECT_UPDATE':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      };

    case 'PROJECT_DELETE':
      // Suppression en cascade : projet + toutes ses tâches
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        tasks: state.tasks.filter((t) => t.projectId !== action.payload),
      };

    // ── TÂCHES ───────────────────────────────────────────────
    case 'TASK_ADD':
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { ...action.payload, id: generateId(), createdAt: Date.now(), done: false },
        ],
      };

    case 'TASK_UPDATE':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case 'TASK_TOGGLE':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };

    case 'TASK_DELETE':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}

// ------ PERSISTANCE -------------------------------------------
const STORAGE_KEY = 'taskflow_state';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    // Données corrompues → état vide
  }
  return { projects: [], tasks: [] };
}

function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ------ DONNÉES DE DÉMONSTRATION ------------------------------
function getSeedData(): AppState {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const projects: Project[] = [
    {
      id: 'p1', name: 'Refonte site web',
      description: 'Mise à jour complète du site avec nouveau design',
      emoji: '🌐', color: '#4A90D9',
      startDate: '2026-02-01', endDate: '2026-04-30', createdAt: Date.now() - 10000,
    },
    {
      id: 'p2', name: 'Application mobile',
      description: 'Développement app iOS/Android pour les clients',
      emoji: '📱', color: '#9B72CF',
      startDate: '2026-01-15', endDate: '2026-06-30', createdAt: Date.now() - 8000,
    },
    {
      id: 'p3', name: 'Rapport annuel',
      description: 'Rédaction et mise en page du rapport d\'activité 2025',
      emoji: '📊', color: '#4CAF7D',
      startDate: '2026-03-01', endDate: '2026-03-31', createdAt: Date.now() - 6000,
    },
  ];

  const tasks: Task[] = [
    { id: 't1', projectId: 'p1', title: 'Maquettes Figma - page d\'accueil', description: 'Desktop et mobile', priority: 'high', dueDate: today, done: false, createdAt: Date.now() - 9000 },
    { id: 't2', projectId: 'p1', title: 'Audit SEO du site actuel', description: '', priority: 'medium', dueDate: tomorrow, done: false, createdAt: Date.now() - 8500 },
    { id: 't3', projectId: 'p1', title: 'Brief avec l\'équipe design', description: '', priority: 'low', dueDate: '', done: true, createdAt: Date.now() - 8000 },
    { id: 't4', projectId: 'p2', title: 'Définir l\'architecture technique', description: '', priority: 'high', dueDate: today, done: false, createdAt: Date.now() - 7500 },
    { id: 't5', projectId: 'p2', title: 'Wireframe de l\'onboarding', description: '', priority: 'medium', dueDate: tomorrow, done: false, createdAt: Date.now() - 7000 },
    { id: 't6', projectId: 'p2', title: 'Choix du framework (RN / Flutter)', description: '', priority: 'high', dueDate: '', done: true, createdAt: Date.now() - 6500 },
    { id: 't7', projectId: 'p3', title: 'Collecter les données financières', description: '', priority: 'high', dueDate: today, done: false, createdAt: Date.now() - 6000 },
    { id: 't8', projectId: 'p3', title: 'Rédiger la synthèse exécutive', description: '', priority: 'medium', dueDate: tomorrow, done: false, createdAt: Date.now() - 5500 },
    { id: 't9', projectId: 'p3', title: 'Valider la structure avec la direction', description: '', priority: 'low', dueDate: '', done: true, createdAt: Date.now() - 5000 },
  ];

  return { projects, tasks };
}

// ------ HOOK PUBLIC -------------------------------------------
/**
 * useAppStore — Hook principal consommé par tous les composants
 *
 * Usage :
 *   const { state, dispatch } = useAppStore();
 *   dispatch({ type: 'TASK_TOGGLE', payload: task.id });
 */
export function useAppStore() {
  const initial = (() => {
    const saved = loadState();
    // Premier lancement : injecter les données de démo
    return saved.projects.length > 0 ? saved : getSeedData();
  })();

  const [state, dispatch] = useReducer(appReducer, initial);

  // Persistance automatique à chaque changement d'état
  useEffect(() => {
    saveState(state);
  }, [state]);

  return { state, dispatch };
}
