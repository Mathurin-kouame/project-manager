// ============================================================
//  App.tsx — Layout responsive
//  Mobile  : pas de marge gauche (sidebar = drawer)
//  Desktop : ml-64 pour laisser la place à la sidebar fixe
// ============================================================

import { useState } from 'react';
import { useApp } from './store/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ProjectDetailView } from './components/projects/ProjectDetailView';
import { AllTasksView } from './components/tasks/AllTasksView';
import { TodayView } from './components/tasks/TodayView';
import { ProjectModal } from './components/projects/ProjectModal';
import { TaskModal } from './components/tasks/TaskModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { useToast } from './hooks/useToast';
import type { Project, Task } from './types';

export default function App() {
  const { currentView, currentProjectId } = useApp();
  const { toasts, showToast, removeToast } = useToast();

  const [projectModal, setProjectModal] = useState<{ open: boolean; edit: Project | null }>({ open: false, edit: null });
  const [taskModal,    setTaskModal]    = useState<{ open: boolean; edit: Task | null }>({ open: false, edit: null });

  function openNewProject()             { setProjectModal({ open: true, edit: null }); }
  function openEditProject(p: Project)  { setProjectModal({ open: true, edit: p }); }
  function closeProjectModal()          { setProjectModal({ open: false, edit: null }); showToast(projectModal.edit ? '✏️ Projet modifié' : '🚀 Projet créé !'); }

  function openNewTask()                { setTaskModal({ open: true, edit: null }); }
  function openEditTask(t: Task)        { setTaskModal({ open: true, edit: t }); }
  function closeTaskModal()             { setTaskModal({ open: false, edit: null }); showToast(taskModal.edit ? '✏️ Tâche modifiée' : '✅ Tâche ajoutée !'); }

  function renderView() {
    switch (currentView) {
      case 'dashboard':      return <DashboardView onEditProject={openEditProject} onNewProject={openNewProject} />;
      case 'projects':       return <ProjectsView onNewProject={openNewProject} onEditProject={openEditProject} />;
      case 'project-detail': return <ProjectDetailView onNewTask={openNewTask} onEditTask={openEditTask} />;
      case 'all-tasks':      return <AllTasksView onEditTask={openEditTask} />;
      case 'today':          return <TodayView onEditTask={openEditTask} />;
      default:               return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-zinc-100">
      <Sidebar />

      {/*
        Mobile  : pas de marge (sidebar = drawer overlay)
        Desktop : ml-64 pour la sidebar fixe
      */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Topbar onNewProject={openNewProject} onNewTask={openNewTask} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {renderView()}
        </main>
      </div>

      <ProjectModal isOpen={projectModal.open} onClose={closeProjectModal} editProject={projectModal.edit} />
      <TaskModal    isOpen={taskModal.open}    onClose={closeTaskModal}    editTask={taskModal.edit} defaultProjectId={currentProjectId} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
