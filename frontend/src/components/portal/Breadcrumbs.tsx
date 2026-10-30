import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const location = useLocation();

  if (customItems && customItems.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-400 font-medium">
        <Link to="/" className="flex items-center gap-1 hover:text-amber-400 transition text-slate-500">
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        {customItems.map((item, index) => {
          const isLast = index === customItems.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3 h-3 mx-1.5 text-slate-600 shrink-0" />
              {isLast || !item.path ? (
                <span className="text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-slate-200 transition truncate max-w-[150px]">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }

  // Auto-generate from pathname (e.g. /portal/matches/1)
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getLabel = (segment: string) => {
    switch (segment) {
      case 'portal':
        return 'Portal';
      case 'matches':
        return 'Matches';
      case 'teams':
        return 'Teams';
      case 'players':
        return 'Players';
      case 'points-table':
        return 'Points Table';
      case 'statistics':
        return 'Statistics';
      case 'dashboard':
        return 'Player Dashboard';
      case 'scoring':
        return 'Scorer Console';
      default:
        // Capitalize and format slugs
        if (/^\d+$/.test(segment)) return `#${segment}`;
        return segment
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-400 font-medium overflow-x-auto py-1">
      <Link to="/" className="flex items-center gap-1 hover:text-amber-400 transition text-slate-500 shrink-0">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = getLabel(segment);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3 h-3 mx-1.5 text-slate-600 shrink-0" />
            {isLast ? (
              <span className="text-amber-400 font-semibold truncate max-w-[220px]">
                {label}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-200 transition shrink-0">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
