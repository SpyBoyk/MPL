import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Plus,
  Sparkles,
} from 'lucide-react';

import { Pagination } from '../ui/Pagination';
import type { PaginationProps } from '../ui/Pagination';

export interface KpiTileItem {
  label: string;
  value: string | number;
  sublabel: string;
  sublabelColor?: string;
  icon: React.ReactNode;
}
export const KpiTileItem = {} as any;

interface PortalPageWrapperProps {
  pageTitle: string;
  kpis: KpiTileItem[];
  customToolbar?: React.ReactNode;
  hideToolbar?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onFilterClick?: () => void;
  filterContent?: React.ReactNode;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
  pagination?: PaginationProps;
  children: React.ReactNode;
}

export const PortalPageWrapper: React.FC<PortalPageWrapperProps> = ({
  pageTitle,
  kpis,
  customToolbar,
  hideToolbar = false,
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  primaryActionLabel,
  onPrimaryAction,
  onFilterClick,
  filterContent,
  onBackClick,
  onSettingsClick,
  pagination,
  children,
}) => {
  const navigate = useNavigate();
  const [internalSearch, setInternalSearch] = useState(searchValue);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearch(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="relative min-h-full bg-[#f4f7fb] dark:bg-[#070d1a] p-2.5 sm:p-5 space-y-2.5 sm:space-y-4 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. TOP BREADCRUMB & BACK BUTTON ROW */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-[#174478] dark:text-sky-400 min-w-0">
          <span className="hover:underline cursor-pointer truncate">MPL LiveCenter</span>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="text-[#174478] dark:text-amber-400 font-black truncate">{pageTitle}</span>
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={handleBack}
          className="shrink-0 flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] dark:bg-sky-700 dark:hover:bg-sky-600 text-white text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* 2. TOP 4 KPI TILES (UNIFORM COMPACT LABELS & SIZING ACROSS ALL PAGES) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {kpis.map((kpi, idx) => {
          let subColorClass = 'text-slate-500 dark:text-slate-400';
          if (kpi.sublabelColor === 'green') {
            subColorClass = 'text-emerald-600 dark:text-emerald-400 font-semibold';
          }
          if (kpi.sublabelColor === 'orange') {
            subColorClass = 'text-amber-600 dark:text-amber-400 font-semibold';
          }
          if (kpi.sublabelColor === 'red') {
            subColorClass = 'text-rose-600 dark:text-rose-400 font-semibold';
          }

          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#0b1329] p-2.5 sm:p-3 px-3 sm:px-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs dark:shadow-md hover:shadow-md flex flex-col justify-between h-[82px] sm:h-[86px] rounded-lg transition-all duration-200 group hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase text-[#174478] dark:text-sky-400 truncate">
                  {kpi.label}
                </span>
                <div className="flex h-6 w-6 sm:h-7 sm:h-7 shrink-0 items-center justify-center rounded-lg bg-[#edf3fa] dark:bg-sky-950/60 text-[#174478] dark:text-sky-400 group-hover:scale-110 transition-transform">
                  {kpi.icon}
                </div>
              </div>

              <div className="mt-0.5 flex items-baseline justify-between gap-1.5 sm:gap-2 min-w-0">
                <span
                  className="font-black text-slate-900 dark:text-white truncate text-[15px] sm:text-[18px] leading-tight tracking-tight"
                  title={String(kpi.value)}
                >
                  {kpi.value}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-semibold truncate shrink-0 ${subColorClass}`}>
                  {kpi.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MAIN CONTENT CONTAINER (WHITE / DARK CARD WITH TOOLBAR & TABLE) */}
      <div className="bg-white dark:bg-[#0b1329] rounded-lg border border-[#e2e8f0] dark:border-slate-800 shadow-xs dark:shadow-md overflow-hidden">
        {hideToolbar ? null : customToolbar ? (
          customToolbar
        ) : (
          /* TOOLBAR */
          <div className="p-2.5 sm:p-3 border-b border-[#e2e8f0] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 bg-white dark:bg-[#0a1124]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[140px] sm:min-w-[220px] max-w-md w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={internalSearch}
                onChange={handleSearch}
                className="w-full bg-[#f8fafc] dark:bg-[#070d18] border border-[#cbd5e1] dark:border-slate-700 rounded-md pl-8 sm:pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#174478] dark:focus:ring-sky-500 focus:border-[#174478] dark:focus:border-sky-500 transition"
              />
            </div>

            {/* Action buttons with 174478 bg and nav menu shape */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setShowFilters(!showFilters);
                  if (onFilterClick) onFilterClick();
                }}
                className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] dark:bg-sky-700 dark:hover:bg-sky-600 text-white text-xs font-bold px-3 sm:px-4 py-1.5 transition-all shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
                <span>Filters</span>
              </button>

              {primaryActionLabel && (
                <button
                  onClick={onPrimaryAction}
                  className="flex items-center gap-1.5 bg-[#174478] hover:bg-[#123660] dark:bg-sky-700 dark:hover:bg-sky-600 text-white text-xs font-bold px-3 sm:px-4 py-1.5 transition-all shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{primaryActionLabel}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* COLLAPSIBLE FILTER TRAY */}
        {showFilters && filterContent && (
          <div className="px-3.5 py-2.5 bg-[#f8fafc] dark:bg-[#091022] border-b border-[#e2e8f0] dark:border-slate-800 flex flex-wrap items-center gap-2">
            {filterContent}
          </div>
        )}

        {/* INNER CONTENT (TABLE OR GRID) */}
        <div className="overflow-x-auto min-h-[300px] w-full min-w-0 [-webkit-overflow-scrolling:touch]">
          {children}
        </div>

        {/* PAGINATION FOOTER */}
        {pagination && <Pagination {...pagination} />}
      </div>
    </div>
  );
};
