// ============================================================
//  components/projects/ProjectsView.tsx — RESPONSIVE
// ============================================================

import type { Project } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { ProjectCard } from './ProjectCard';
import { Button } from '../ui/Button';

interface ProjectsViewProps {
  onNewProject: () => void;
  onEditProject: (project: Project) => void;
}

export function ProjectsView({ onNewProject, onEditProject }: ProjectsViewProps) {
  const { projects } = useProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h2 className="font-bold text-base sm:text-lg text-zinc-100">Tous les projets</h2>
        <Button size="sm" onClick={onNewProject}>+ Nouveau projet</Button>
      </div>

      {/* 1 col → 2 cols sm → 3 cols xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onEdit={onEditProject} />
        ))}
        <button
          onClick={onNewProject}
          className="border-2 border-dashed border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-zinc-600 hover:border-yellow-400/40 hover:text-yellow-400/70 transition-all min-h-[160px]"
        >
          <span className="text-4xl">+</span>
          <span className="text-sm font-medium">Nouveau projet</span>
        </button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 sm:py-20 text-zinc-600">
          <p className="text-5xl mb-4">📂</p>
          <p className="font-bold text-zinc-400 text-lg mb-2">Aucun projet</p>
          <p className="text-sm">Créez votre premier projet pour commencer.</p>
        </div>
      )}
    </div>
  );
}
