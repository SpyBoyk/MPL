import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load tournament information. Please check your connection or try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-rose-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white transition text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};
