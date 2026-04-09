// ============================================================
//  components/tasks/FilterBar.tsx — RESPONSIVE
//  Barre de filtres en ligne avec scroll horizontal sur mobile
// ============================================================

interface FilterOption { value: string; label: string; }
interface FilterBarProps { options: FilterOption[]; active: string; onChange: (value: string) => void; }

export function FilterBar({ options, active, onChange }: FilterBarProps) {
  return (
    // flex nowrap + overflow-x gérés par le parent
    <div className="flex items-center gap-1.5 flex-nowrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all border whitespace-nowrap flex-shrink-0 ${
            active === opt.value
              ? 'bg-yellow-400 text-black border-yellow-400'
              : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export const TASK_FILTER_OPTIONS: FilterOption[] = [
  { value: 'all',     label: 'Toutes' },
  { value: 'pending', label: 'En cours' },
  { value: 'done',    label: 'Terminées' },
  { value: 'high',    label: '🔴 Urgentes' },
];

export const ALL_TASK_FILTER_OPTIONS: FilterOption[] = [
  { value: 'all',     label: 'Toutes' },
  { value: 'pending', label: 'En cours' },
  { value: 'done',    label: 'Terminées' },
  { value: 'high',    label: '🔴 Haute' },
  { value: 'medium',  label: '🟠 Moyenne' },
  { value: 'low',     label: '🟢 Basse' },
];
