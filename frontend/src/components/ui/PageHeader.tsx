import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, badge, action }) => {
  return (
    <div className="relative py-4 md:py-5 border-b border-slate-800/60 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 border border-amber-400/25 text-amber-300 uppercase tracking-wider shrink-0">
              {badge}
            </span>
          )}
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
