// ============================================================
//  store/AppContext.tsx
//  Context React pour distribuer l'état global à l'arbre de composants
//
//  Pattern : Provider / Consumer
//    <AppProvider> enveloppe l'app → les composants enfants
//    accèdent à l'état via le hook useApp() sans prop-drilling
// ============================================================

import React, { createContext, useContext, useState } from 'react';
import { useAppStore, type AppState, type AppAction } from './appStore';
import type { ViewName } from '../types';

// ------ SHAPE DU CONTEXTE -------------------------------------
interface AppContextValue {
  // État des données (projets, tâches)
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  // Navigation
  currentView: ViewName;
  currentProjectId: string | null;
  navigateTo: (view: ViewName, projectId?: string) => void;

  // Recherche globale
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

// ------ CRÉATION DU CONTEXTE ----------------------------------
// On initialise avec `undefined` pour forcer l'utilisation du Provider
const AppContext = createContext<AppContextValue | undefined>(undefined);

// ------ PROVIDER ----------------------------------------------
/**
 * AppProvider — À placer à la racine de l'application (main.tsx)
 * Fournit l'état global et les fonctions de navigation
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useAppStore();

  // Navigation
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Recherche
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * navigateTo — Point d'entrée unique pour tous les changements de vue
   * Centralise la logique de navigation (reset de recherche, etc.)
   */
  function navigateTo(view: ViewName, projectId?: string) {
    setCurrentView(view);
    setCurrentProjectId(projectId ?? null);
    setSearchQuery(''); // Reset recherche à chaque navigation
  }

  const value: AppContextValue = {
    state,
    dispatch,
    currentView,
    currentProjectId,
    navigateTo,
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ------ HOOK CONSOMMATEUR -------------------------------------
/**
 * useApp — Hook à utiliser dans n'importe quel composant enfant
 *
 * Usage :
 *   const { state, dispatch, navigateTo } = useApp();
 *
 * Lance une erreur explicite si utilisé hors du Provider
 */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp doit être utilisé à l\'intérieur de <AppProvider>');
  }
  return ctx;
}
