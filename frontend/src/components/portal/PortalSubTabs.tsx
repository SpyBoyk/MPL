import React from 'react';
import { NavLink } from 'react-router-dom';

interface SubTabItem {
  id: string;
  label: string;
  path: string;
}

interface PortalSubTabsProps {
  activeTab: string;
}

export const MPL_PORTAL_TABS: SubTabItem[] = [
  { id: 'overview', label: 'Overview', path: '/portal' },
  { id: 'matches', label: 'Matches & Fixtures', path: '/portal/matches' },
  { id: 'points-table', label: 'Points Table', path: '/portal/points-table' },
  { id: 'teams', label: 'Teams & Squads', path: '/portal/teams' },
  { id: 'players', label: 'Players Roster', path: '/portal/players' },
  { id: 'statistics', label: 'Tournament Honors', path: '/portal/statistics' },
];

export const PortalSubTabs: React.FC<PortalSubTabsProps> = ({ activeTab }) => {
  return (
    <div
      className="w-full border-b border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-[#0a101e] px-2.5 sm:px-5 py-2 sm:py-2.5 transition-colors duration-200"
      role="tablist"
      aria-label="Tournament portal navigation tabs"
    >
      <div className="flex w-full gap-1.5 sm:gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MPL_PORTAL_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={`flex-1 min-w-[110px] sm:min-w-0 w-full flex h-8 sm:h-9 items-center justify-center text-center px-1.5 sm:px-3 text-[11px] sm:text-[12px] font-bold tracking-tight [clip-path:polygon(6px_0,100%_0,calc(100%-6px)_100%,0_100%)] transition-all duration-200 cursor-pointer truncate ${
                isActive
                  ? 'bg-[#174478] dark:bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#174478] dark:hover:text-white'
              }`}
            >
              <span className="truncate">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
