// ============================================================
//  hooks/useToast.ts
//  Hook pour les notifications toast (feedback utilisateur)
// ============================================================

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message }]);

    // Auto-suppression après 2.5 secondes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
