// ============================================================
//  components/dashboard/DashboardView.tsx — RESPONSIVE
// ============================================================

import type { Project, Task } from '../../types';
import { useApp } from '../../store/AppContext';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { ProjectCard } from '../projects/ProjectCard';
import { ProgressBar } from '../ui/index';

interface DashboardViewProps {
  onEditProject: (project: Project) => void;
  onNewProject: () => void;
}

export function DashboardView({ onEditProject, onNewProject }: DashboardViewProps) {
  const { state, navigateTo } = useApp();
  const { projects } = useProjects();
  const { allTasks } = useTasks();

  const totalTasks  = allTasks.length;
  const doneTasks   = allTasks.filter((t) => t.done).length;
  const urgentTasks = allTasks.filter((t) => t.priority === 'high' && !t.done).length;
  const pct         = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const now  = new Date();
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const mons = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const dateLabel = `${days[now.getDay()]} ${now.getDate()} ${mons[now.getMonth()]} ${now.getFullYear()}`;

  const recentProjects = [...projects].slice(0, 3);
  const recentTasks    = [...allTasks].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">Bonjour 👋</h1>
        <p className="text-sm text-zinc-500 mt-1">{dateLabel}</p>
      </div>

      {/* Stats — 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Projets"        value={projects.length} color="#E8C547" sub="actifs" />
        <StatCard label="Tâches totales" value={totalTasks}      color="#4A90D9" sub="toutes réunies" />
        <StatCard label="Terminées"      value={doneTasks}       color="#4CAF7D" sub={`${pct}% du total`} progress={pct} />
        <StatCard label="Urgentes"       value={urgentTasks}     color="#E85447" sub="haute priorité" />
      </div>

      {/*
        Layout principal :
        - Mobile  : colonne unique (projets puis panneau)
        - Desktop : grille 2 colonnes [contenu | panneau 300px]
      */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 sm:gap-6">

        {/* Projets récents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm sm:text-base text-zinc-100">Projets récents</h2>
            <button onClick={() => navigateTo('projects')} className="text-xs text-zinc-500 hover:text-yellow-400 transition">
              Voir tout →
            </button>
          </div>
          {/* 1 col mobile → 2 cols md → 3 cols xl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {recentProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onEdit={onEditProject} />
            ))}
            <button
              onClick={onNewProject}
              className="border-2 border-dashed border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-zinc-600 hover:border-yellow-400/40 hover:text-yellow-400/70 transition-all min-h-[140px]"
            >
              <span className="text-3xl">+</span>
              <span className="text-sm font-medium">Nouveau projet</span>
            </button>
          </div>
        </div>

        {/* Panneau latéral — pleine largeur sur mobile, fixe sur xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
          {/* Tâches récentes */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="font-bold text-sm text-zinc-100 mb-3">Tâches récentes</h3>
            {recentTasks.length === 0 ? (
              <p className="text-xs text-zinc-600 text-center py-4">Aucune tâche</p>
            ) : (
              recentTasks.map((task) => {
                const proj = state.projects.find((p) => p.id === task.projectId);
                return <RecentTaskRow key={task.id} task={task} project={proj} />;
              })
            )}
          </div>

          {/* Progression par projet */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="font-bold text-sm text-zinc-100 mb-3">Progression</h3>
            {projects.length === 0 ? (
              <p className="text-xs text-zinc-600">Aucun projet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {projects.map((p) => {
                  const pt  = allTasks.filter((t) => t.projectId === p.id);
                  const pd  = pt.filter((t) => t.done).length;
                  const pct = pt.length ? Math.round((pd / pt.length) * 100) : 0;
                  return (
                    <div key={p.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="flex items-center gap-1.5 text-zinc-300 min-w-0">
                          <span className="flex-shrink-0">{p.emoji}</span>
                          <span className="truncate">{p.name}</span>
                        </span>
                        <span className="font-semibold flex-shrink-0 ml-2" style={{ color: p.color }}>{pct}%</span>
                      </div>
                      <ProgressBar value={pct} color={p.color} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, sub, progress }: { label: string; value: number; color: string; sub: string; progress?: number }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 hover:border-zinc-700 transition">
      <p className="text-[9px] sm:text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 sm:mb-3">{label}</p>
      <p className="text-3xl sm:text-4xl font-black tracking-tight leading-none" style={{ color }}>{value}</p>
      <p className="text-xs text-zinc-600 mt-1.5">{sub}</p>
      {progress !== undefined && <div className="mt-3"><ProgressBar value={progress} color={color} /></div>}
    </div>
  );
}

function RecentTaskRow({ task, project }: { task: Task; project?: Project }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-zinc-800 last:border-0">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: project?.color ?? '#555' }} />
      <span className={`flex-1 text-xs truncate ${task.done ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>{task.title}</span>
      {project && <span className="text-[10px] text-zinc-600 flex-shrink-0 hidden sm:block">{project.name}</span>}
    </div>
  );
}
