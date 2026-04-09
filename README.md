# ⚡ TaskFlow — Gestion de Projets & Tâches

Application React TypeScript + Tailwind CSS construite pour apprendre les bonnes pratiques de développement frontend moderne.

---

## 🚀 Installation & Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Builder pour la production
npm run build
```

---

## 🏗️ Architecture du projet

```
src/
├── types/
│   └── index.ts              # 📐 Tous les types TypeScript centralisés
│
├── utils/
│   └── index.ts              # 🔧 Fonctions pures (dates, filtres, export CSV)
│
├── store/
│   ├── appStore.ts           # 🗄️  useReducer + persistance localStorage
│   └── AppContext.tsx        # 🌐 Context React (navigation, état global)
│
├── hooks/
│   ├── useProjects.ts        # 🏗️  Opérations CRUD sur les projets
│   ├── useTasks.ts           # ✅ Opérations CRUD sur les tâches
│   └── useToast.ts           # 🔔 Notifications utilisateur
│
└── components/
    ├── ui/                   # 🎨 Composants génériques réutilisables
    │   ├── Button.tsx         # Bouton avec variantes
    │   ├── index.tsx          # Modal, Badge, ProgressBar, FormField
    │   └── ToastContainer.tsx # Notifications toast
    │
    ├── layout/               # 📐 Structure de la page
    │   ├── Sidebar.tsx        # Navigation latérale
    │   └── Topbar.tsx         # Barre supérieure
    │
    ├── projects/             # 📁 Fonctionnalités liées aux projets
    │   ├── ProjectCard.tsx    # Carte projet dans la grille
    │   └── ProjectModal.tsx   # Formulaire création/édition projet
    │
    ├── tasks/                # ✅ Fonctionnalités liées aux tâches
    │   ├── TaskItem.tsx       # Ligne de tâche individuelle
    │   ├── TaskModal.tsx      # Formulaire création/édition tâche
    │   └── FilterBar.tsx      # Barre de filtres réutilisable
    │
    ├── dashboard/            # 📊 Vue tableau de bord
    │   └── DashboardView.tsx
    │
    └── views.tsx             # 📄 Vues : Projects, ProjectDetail, AllTasks, Today
```

---

## 🧠 Concepts clés à retenir

### 1. Types TypeScript (`types/index.ts`)
- Définir les interfaces centralement évite la duplication et les erreurs
- **Discriminated union** pour les types d'actions (`AppAction`)
- Types dérivés avec `Omit<T, K>` pour les formulaires

### 2. Gestion d'état avec `useReducer`
```ts
// Pattern : dispatch(action) → reducer → nouvel état
dispatch({ type: 'TASK_TOGGLE', payload: task.id });
```
- Plus prévisible que `useState` pour l'état complexe
- Le reducer est une **fonction pure** : même input → même output
- Jamais de mutation directe (`{ ...state, ... }` toujours)

### 3. Context React + Hook custom
```ts
// Provider à la racine → accès dans n'importe quel composant
const { state, dispatch, navigateTo } = useApp();
```
- Évite le **prop drilling** (passer les props sur 5 niveaux)
- `useApp()` lance une erreur explicite si mal utilisé

### 4. Séparation des responsabilités
| Couche | Rôle |
|--------|------|
| `types/` | Définir les structures de données |
| `utils/` | Logique pure sans effets de bord |
| `store/` | État global + persistance |
| `hooks/` | Logique métier réutilisable |
| `components/ui/` | Composants visuels génériques |
| `components/features/` | Composants liés à un domaine |

### 5. Composants UI génériques (`components/ui/`)
- `Button` avec variantes évite les classes Tailwind répétées
- `Modal` gère l'accessibilité (Escape, clic extérieur)
- `FormField` standardise les labels de formulaire

---

## 📦 Stack technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 18 | UI déclarative + hooks |
| TypeScript | 5 | Typage statique |
| Tailwind CSS | 3 | Styles utilitaires |
| Vite | 5 | Bundler ultra-rapide |

---

## 🔄 Flux de données

```
Utilisateur (clic)
    ↓
Composant React
    ↓
dispatch(Action) ou hook métier
    ↓
Reducer (fonction pure)
    ↓
Nouvel état AppState
    ↓
useEffect → localStorage.setItem()
    ↓
Re-render des composants concernés
```

---

## ✅ Fonctionnalités

- [x] Créer / modifier / supprimer des projets
- [x] Créer des tâches liées à un projet
- [x] Marquer les tâches comme terminées
- [x] Filtrer par statut et priorité
- [x] Vue tableau de bord avec statistiques
- [x] Vue "Aujourd'hui" (tâches du jour)
- [x] Recherche globale
- [x] Export CSV
- [x] Persistance via localStorage
- [x] Notifications toast
