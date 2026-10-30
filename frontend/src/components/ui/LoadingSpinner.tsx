import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading cricket data...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className={`${sizeClasses[size]} border-slate-700 border-t-amber-400 rounded-full animate-spin mb-4`}
      />
      {message && <p className="text-sm font-medium text-slate-400 tracking-wide">{message}</p>}
    </div>
  );
};
