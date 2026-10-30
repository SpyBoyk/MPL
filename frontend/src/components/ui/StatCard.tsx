import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtitle, icon, trend }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        {icon && <div className="p-2 rounded-xl bg-slate-800/80 text-amber-400">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-heading font-extrabold text-white tracking-tight">{value}</div>
        {trend && <span className="text-xs text-emerald-400 font-medium">{trend}</span>}
      </div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
    </div>
  );
};
