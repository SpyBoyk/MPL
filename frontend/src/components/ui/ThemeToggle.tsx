import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'pill' | 'icon' | 'doms';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'pill',
  showLabel = true,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'doms') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] ${
          isDark
            ? 'bg-[#1e293b] text-amber-300 border border-amber-400/30 hover:bg-[#334155]'
            : 'bg-[#f0f4f9] text-[#174478] border border-[#cbd5e1] hover:bg-[#e2e8f0]'
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            {showLabel && <span className="text-[10px] uppercase tracking-wider font-extrabold">Light</span>}
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-[#174478]" />
            {showLabel && <span className="text-[10px] uppercase tracking-wider font-extrabold">Dark</span>}
          </>
        )}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          isDark
            ? 'bg-slate-800/80 text-amber-300 border border-slate-700 hover:border-amber-400/50 hover:bg-slate-700/80 shadow-md shadow-amber-500/10'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-500/60 hover:bg-amber-50/50 shadow-sm'
        } ${className}`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </button>
    );
  }

  // Default 'pill' variant: Ultra-premium switcher with smooth indicator
  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer shadow-xs ${
        isDark
          ? 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-amber-400/40 hover:bg-slate-800'
          : 'bg-white/95 border-slate-200 text-slate-700 hover:border-amber-500/50 hover:bg-slate-50 shadow-sm'
      } ${className}`}
    >
      <div className="relative flex items-center gap-1.5">
        <div
          className={`flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 ${
            isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-700" />
          )}
        </div>
        {showLabel && (
          <span className="text-xs font-bold tracking-tight">
            {isDark ? (
              <span className="text-amber-300 group-hover:text-amber-200 transition">Dark</span>
            ) : (
              <span className="text-slate-800 group-hover:text-[#174478] transition">Light</span>
            )}
          </span>
        )}
      </div>
    </button>
  );
};
