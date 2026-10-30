import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'live' | 'completed' | 'scheduled' | 'gold' | 'default' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    live: 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse',
    completed: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
    scheduled: 'bg-sky-500/15 border-sky-500/40 text-sky-400',
    gold: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    danger: 'bg-red-500/15 border-red-500/40 text-red-400',
    default: 'bg-slate-800 border-slate-700 text-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${styles[variant]} ${className}`}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-ping" />
      )}
      {children}
    </span>
  );
};
