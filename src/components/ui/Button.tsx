// ============================================================
//  components/ui/Button.tsx
//  Composant bouton réutilisable avec variantes Tailwind
//
//  Bonne pratique : Un seul composant bouton dans toute l'app
//  garantit la cohérence visuelle et facilite les changements.
// ============================================================

import React from 'react';

// On étend les props natives HTML du bouton (onClick, disabled, type…)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  children: React.ReactNode;
}

// Mapping variant → classes Tailwind
const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-yellow-400 text-black hover:bg-yellow-300 font-semibold',
  secondary: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700',
  ghost:     'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
  danger:    'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-transparent hover:border-red-500/40',
  outline:   'bg-transparent text-zinc-300 border border-zinc-700 hover:border-zinc-400 hover:text-zinc-100',
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  xs: 'px-2 py-1 text-xs rounded-md gap-1',
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-150 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
