import React from 'react';
import { Trophy, CalendarX, Users, ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'trophy' | 'calendar' | 'users' | 'alert';
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'trophy',
  actionLabel,
  onAction,
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'calendar':
        return <CalendarX className="w-12 h-12 text-slate-500" />;
      case 'users':
        return <Users className="w-12 h-12 text-slate-500" />;
      case 'alert':
        return <ShieldAlert className="w-12 h-12 text-amber-500" />;
      default:
        return <Trophy className="w-12 h-12 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
      <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-5">
        {getIcon()}
      </div>
      <h3 className="text-xl font-heading font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition text-sm font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
