// ============================================================
//  components/ui/EmptyState.tsx
//  Composant réutilisable pour les états vides (listes sans contenu)
// ============================================================

interface EmptyStateProps {
  icon: string;
  title: string;
  sub: string;
}

export function EmptyState({ icon, title, sub }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-zinc-800 rounded-xl py-14 text-center">
      <p className="text-5xl mb-3">{icon}</p>
      <p className="font-bold text-zinc-300 mb-1">{title}</p>
      <p className="text-sm text-zinc-600">{sub}</p>
    </div>
  );
}
