// ============================================================
//  components/ui/ToastContainer.tsx
//  Affiche les notifications toast en bas à droite
// ============================================================

import type { Toast } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => onRemove(toast.id)}
          className="bg-zinc-800 border border-zinc-700 text-zinc-100 px-4 py-3 rounded-xl text-sm font-medium shadow-xl cursor-pointer flex items-center gap-2 animate-[fadeUp_0.3s_ease]"
          style={{ animation: 'fadeUp 0.3s ease' }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
