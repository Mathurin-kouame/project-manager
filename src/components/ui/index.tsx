// ============================================================
//  components/ui/index.tsx — Modal, Badge, ProgressBar, FormField
// ============================================================

import React, { useEffect } from 'react';

// ── MODAL ─────────────────────────────────────────────────
interface ModalProps { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}>
      {/*
        Mobile  : drawer depuis le bas (rounded-t-2xl, pas de rounded-b)
        Desktop : modal centré (rounded-2xl)
      */}
      <div
        className="relative bg-zinc-900 border border-zinc-700 w-full sm:w-auto sm:min-w-[440px] sm:max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl rounded-t-2xl sm:rounded-2xl p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 transition flex items-center justify-center text-sm">
          ✕
        </button>
        {/* Poignée visuelle sur mobile */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-4 sm:hidden" />
        <h2 className="font-bold text-lg sm:text-xl text-zinc-100 mb-5 sm:mb-6 tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  );
}

// ── BADGE ─────────────────────────────────────────────────
interface BadgeProps { children: React.ReactNode; variant?: 'high' | 'medium' | 'low' | 'done' | 'default'; className?: string; }
const BADGE_VARIANTS = { high: 'bg-red-500/15 text-red-400', medium: 'bg-orange-500/15 text-orange-400', low: 'bg-green-500/15 text-green-400', done: 'bg-zinc-700/60 text-zinc-400', default: 'bg-zinc-800 text-zinc-400' };

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide ${BADGE_VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ── PROGRESS BAR ──────────────────────────────────────────
export function ProgressBar({ value, color, height = 'h-1' }: { value: number; color?: string; height?: string }) {
  return (
    <div className={`w-full bg-zinc-800 rounded-full ${height} overflow-hidden`}>
      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${value}%`, background: color ?? '#E8C547' }} />
    </div>
  );
}

// ── FORM FIELD ────────────────────────────────────────────
export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

export const inputClass = 'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-yellow-400/60 transition-colors';
