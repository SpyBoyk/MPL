import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Award,
  Medal,
  Gift,
  Plus,
  Pencil,
  Trash2,
  Download,
  RotateCcw,
  Search,
  Filter,
  DollarSign,
  Heart,
  Sparkles,
  X,
  ChevronDown,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import type { KpiTileItem } from '../components/portal/PortalPageWrapper';

export interface AwardItem {
  id: number;
  title: string;
  category: 'Championship' | 'Individual' | 'Match Awards' | 'Mementos & Medals';
  type: 'cash' | 'trophy' | 'medal' | 'memento';
  amount: number;
  sponsor: string;
  dedication?: string;
  recipient?: string;
}

const INITIAL_AWARDS: AwardItem[] = [
  {
    id: 1,
    title: 'First Prize Cash Prize',
    category: 'Championship',
    type: 'cash',
    amount: 9000,
    sponsor: 'Ashish Kilaje & Akshay Kilaje',
    recipient: 'Tournament Champion Team',
  },
  {
    id: 2,
    title: 'First Prize Trophy',
    category: 'Championship',
    type: 'trophy',
    amount: 5000,
    sponsor: 'Yash Yashwant Latke',
    recipient: 'Tournament Champion Team',
  },
  {
    id: 3,
    title: 'Second Prize Cash Prize',
    category: 'Championship',
    type: 'cash',
    amount: 7000,
    sponsor: 'Sunil Sheth Waje (Sarpanch)',
    recipient: 'Runner-up Team',
  },
  {
    id: 4,
    title: 'Second Prize Trophy',
    category: 'Championship',
    type: 'trophy',
    amount: 4000,
    sponsor: 'Sagar Duduskar',
    recipient: 'Runner-up Team',
  },
  {
    id: 5,
    title: 'Man of the Series',
    category: 'Individual',
    type: 'cash',
    amount: 3000,
    sponsor: 'Samir Subhash Helekar',
    dedication: 'In Memory of Subhash Krishna Helekar',
    recipient: 'Best All-Round Performer',
  },
  {
    id: 6,
    title: 'Man of the Match (Final)',
    category: 'Individual',
    type: 'cash',
    amount: 1000,
    sponsor: 'Sambhav Sudhakar Pawar',
    recipient: 'Finals Match MVP',
  },
  {
    id: 7,
    title: 'Best Bowler',
    category: 'Individual',
    type: 'cash',
    amount: 1000,
    sponsor: 'Ajay Waje',
    recipient: 'Purple Cap / Most Wickets',
  },
  {
    id: 8,
    title: 'Best Batsman',
    category: 'Individual',
    type: 'cash',
    amount: 1000,
    sponsor: 'Kishor Ramesh Thasale',
    recipient: 'Orange Cap / Leading Run Scorer',
  },
  {
    id: 9,
    title: 'Best Fielder',
    category: 'Individual',
    type: 'cash',
    amount: 1000,
    sponsor: 'Sambhav Sudhakar Pawar',
    recipient: 'Top Catches & Run-outs',
  },
  {
    id: 10,
    title: 'Team Owner Memento 1',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Franchise Owner 1',
  },
  {
    id: 11,
    title: 'Team Owner Memento 2',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Franchise Owner 2',
  },
  {
    id: 12,
    title: 'Team Owner Memento 3',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Franchise Owner 3',
  },
  {
    id: 13,
    title: 'Team Owner Memento 4',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Franchise Owner 4',
  },
  {
    id: 14,
    title: 'Team Owner Memento 5',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Franchise Owner 5',
  },
  {
    id: 15,
    title: 'Memento (5 pcs) Set 1',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Dignitaries & Umpires Set 1',
  },
  {
    id: 16,
    title: 'Memento (5 pcs) Set 2',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Dignitaries & Umpires Set 2',
  },
  {
    id: 17,
    title: 'Memento (5 pcs) Set 3',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Dignitaries & Umpires Set 3',
  },
  {
    id: 18,
    title: 'Memento (5 pcs) Set 4',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Dignitaries & Umpires Set 4',
  },
  {
    id: 19,
    title: 'Memento (5 pcs) Set 5',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Dignitaries & Umpires Set 5',
  },
  {
    id: 20,
    title: 'Memento (5 pcs) Set 6',
    category: 'Mementos & Medals',
    type: 'memento',
    amount: 1200,
    sponsor: 'MPL Organizing Committee',
    recipient: 'Dignitaries & Umpires Set 6',
  },
  {
    id: 21,
    title: 'Winner Medals (Full Squad)',
    category: 'Mementos & Medals',
    type: 'medal',
    amount: 1200,
    sponsor: 'Ayush Shriram Kolambekar',
    recipient: 'Champion Playing Squad',
  },
  {
    id: 22,
    title: 'Runner-up Medals (Full Squad)',
    category: 'Mementos & Medals',
    type: 'medal',
    amount: 1000,
    sponsor: 'Saisha Shriram Kolambekar',
    recipient: 'Runner-up Playing Squad',
  },
  {
    id: 23,
    title: 'Man of the Match #1',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #1 Top Performer',
  },
  {
    id: 24,
    title: 'Man of the Match #2',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #2 Top Performer',
  },
  {
    id: 25,
    title: 'Man of the Match #3',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #3 Top Performer',
  },
  {
    id: 26,
    title: 'Man of the Match #4',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #4 Top Performer',
  },
  {
    id: 27,
    title: 'Man of the Match #5',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #5 Top Performer',
  },
  {
    id: 28,
    title: 'Man of the Match #6',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #6 Top Performer',
  },
  {
    id: 29,
    title: 'Man of the Match #7',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #7 Top Performer',
  },
  {
    id: 30,
    title: 'Man of the Match #8',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #8 Top Performer',
  },
  {
    id: 31,
    title: 'Man of the Match #9',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #9 Top Performer',
  },
  {
    id: 32,
    title: 'Man of the Match #10',
    category: 'Match Awards',
    type: 'cash',
    amount: 250,
    sponsor: 'Pranay Kilaje',
    recipient: 'Match #10 Top Performer',
  },
];

const STORAGE_KEY = 'mpl_awards_data_v1';

type SortField = 'id' | 'title' | 'category' | 'amount' | 'sponsor';
type SortOrder = 'asc' | 'desc';

export const AwardsPage: React.FC = () => {
  const navigate = useNavigate();
  const [awards, setAwards] = useState<AwardItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed reading awards from localStorage', e);
    }
    return INITIAL_AWARDS;
  });

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // In-app Toast State (No browser alert or popup)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from backend API if available and sync
  useEffect(() => {
    let isMounted = true;
    apiClient.get('/awards/')
      .then((res) => {
        const data = res.data?.results || res.data;
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const apiMapped: AwardItem[] = data.map((a: any) => ({
            id: a.id,
            title: a.title,
            category: a.category,
            type: a.award_type || a.type || 'cash',
            amount: Number(a.amount) || 0,
            sponsor: a.sponsor,
            dedication: a.dedication || '',
            recipient: a.recipient || '',
          }));
          setAwards((prev) => {
            const apiIds = new Set(apiMapped.map((x) => x.id));
            const customOnly = prev.filter((p) => !apiIds.has(p.id) && p.id > 100);
            return [...customOnly, ...apiMapped];
          });
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Save to localStorage whenever awards change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(awards));
    } catch (e) {
      console.error('Failed saving awards to localStorage', e);
    }
  }, [awards]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, typeFilter]);

  // Navigate to separate page component for adding an award
  const handleOpenAdd = () => {
    navigate('/portal/awards/new');
  };

  // Navigate to separate page component for editing an award
  const handleOpenEdit = (award: AwardItem) => {
    navigate(`/portal/awards/${award.id}/edit`);
  };

  // Handle Delete - In-app notification without browser alert/confirm
  const handleDeleteAward = (id: number) => {
    setAwards((prev) => prev.filter((a) => a.id !== id));
    setSelectedRows((prev) => prev.filter((r) => r !== String(id)));
    apiClient.delete(`/awards/${id}/`).catch(() => {});
    showToast('Award record successfully removed from official tournament register.');
  };

  // Reset to initial 32 - In-app notification without browser alert/confirm
  const handleResetToDefault = () => {
    setAwards(INITIAL_AWARDS);
    setSelectedRows([]);
    setCurrentPage(1);
    showToast('Restored official 32 tournament awards list successfully.');
  };

  // Toggle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Checkbox multi-select
  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Award Title', 'Category', 'Type', 'Amount (INR)', 'Sponsor', 'Dedication', 'Recipient'];
    const rows = awards.map((a) => [
      a.id,
      `"${a.title.replace(/"/g, '""')}"`,
      a.category,
      a.type,
      a.amount,
      `"${a.sponsor.replace(/"/g, '""')}"`,
      `"${(a.dedication || '').replace(/"/g, '""')}"`,
      `"${(a.recipient || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPL_2026_Tournament_Awards_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted awards
  const filteredAwards = useMemo(() => {
    const list = awards.filter((award) => {
      const matchesSearch =
        award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.sponsor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (award.dedication && award.dedication.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (award.recipient && award.recipient.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = categoryFilter === 'All' || award.category === categoryFilter;
      const matchesType = typeFilter === 'All' || award.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });

    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = a.id - b.id;
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === 'sponsor') {
        comparison = a.sponsor.localeCompare(b.sponsor);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [awards, searchTerm, categoryFilter, typeFilter, sortField, sortOrder]);

  // Pagination calculations
  const totalItems = filteredAwards.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAwards = filteredAwards.slice(startIndex, startIndex + pageSize);

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedAwards.length && paginatedAwards.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedAwards.map((a) => String(a.id)));
    }
  };

  // KPI Calculations
  const totalAmount = useMemo(() => awards.reduce((sum, a) => sum + (Number(a.amount) || 0), 0), [awards]);
  const totalSponsorsCount = useMemo(() => {
    const sponsorsSet = new Set(awards.map((a) => a.sponsor.toLowerCase().trim()).filter(Boolean));
    return sponsorsSet.size;
  }, [awards]);
  const topAwardAmount = useMemo(() => Math.max(0, ...awards.map((a) => a.amount || 0)), [awards]);

  const kpis: KpiTileItem[] = [
    {
      label: 'TOTAL PRIZE POOL',
      value: `₹${totalAmount.toLocaleString('en-IN')}`,
      sublabel: 'Official Tournament Rewards',
      sublabelColor: 'green',
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: 'TOTAL HONORS & MEDALS',
      value: `${awards.length} Items`,
      sublabel: 'Across All 4 Categories',
      sublabelColor: 'default',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
    },
    {
      label: 'PATRONS & SPONSORS',
      value: `${totalSponsorsCount} Dignitaries`,
      sublabel: 'Malghar Village Supporters',
      sublabelColor: 'orange',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
    },
    {
      label: 'TOP CASH PRIZE',
      value: `₹${topAwardAmount.toLocaleString('en-IN')}`,
      sublabel: 'First Prize Champions',
      sublabelColor: 'green',
      icon: <Award className="w-4 h-4 text-[#174478]" />,
    },
  ];

  return (
    <PortalPageWrapper
      pageTitle="Tournament Awards & Sponsorships"
      kpis={kpis}
      customToolbar={
        <div className="p-2 sm:p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-[#07101e] transition-colors">
          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search awards, sponsors, or dedications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8fafc] dark:bg-[#0b172a] border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#174478] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-[#0b172a] outline-none transition"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by Award Category"
                className="appearance-none bg-[#f8fafc] dark:bg-[#0b172a] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold pl-2.5 pr-7 py-1.5 rounded focus:border-[#174478] dark:focus:border-emerald-500 outline-none cursor-pointer transition-colors"
              >
                <option value="All">All Categories ({awards.length})</option>
                <option value="Championship">Championship & Teams</option>
                <option value="Individual">Individual Honors</option>
                <option value="Match Awards">Match Awards (10 Matches)</option>
                <option value="Mementos & Medals">Mementos & Medals</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter by Award Type"
                className="appearance-none bg-[#f8fafc] dark:bg-[#0b172a] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold pl-2.5 pr-7 py-1.5 rounded focus:border-[#174478] dark:focus:border-emerald-500 outline-none cursor-pointer transition-colors"
              >
                <option value="All">All Types</option>
                <option value="cash">Cash Prize</option>
                <option value="trophy">Trophy</option>
                <option value="medal">Medals</option>
                <option value="memento">Memento</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Add Award Button with polygon clip */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-[#174478] dark:bg-emerald-600 hover:bg-[#123660] dark:hover:bg-emerald-500 text-white text-xs font-bold px-3 sm:px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Award</span>
            </button>

            {/* Export CSV Button with polygon clip */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-[#174478] dark:bg-slate-800 hover:bg-[#123660] dark:hover:bg-slate-700 text-white text-xs font-bold px-3 sm:px-4 py-1.5 transition shadow-xs cursor-pointer [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)] border border-transparent dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetToDefault}
              title="Reset to official 32 awards"
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#174478] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
      pagination={{
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        onPageChange: (p) => setCurrentPage(p),
        onPageSizeChange: (s) => {
          setPageSize(s);
          setCurrentPage(1);
        },
        pageSizeOptions: [10, 20, 50],
      }}
    >
      <div className="w-full">
        {/* TOP SPOTLIGHT FEATURE CARDS FOR FLAGSHIP PRIZES */}
        <div className="p-3 sm:p-4 bg-[#fbfcfe] dark:bg-[#050c18] border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Spotlight 1: 1st Prize Cash */}
            <div className="relative overflow-hidden rounded-lg border border-amber-200 dark:border-amber-700/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white dark:to-[#091528] p-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-transparent dark:border-amber-700/50">
                  CHAMPION REWARD
                </span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-1.5">
                <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">₹9,000</div>
                <p className="text-xs font-bold text-[#174478] dark:text-amber-400 truncate">First Prize Cash Prize</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Sponsored by: <span className="font-semibold text-slate-700 dark:text-slate-300">Ashish Kilaje & Akshay Kilaje</span>
                </p>
              </div>
            </div>

            {/* Spotlight 2: 2nd Prize Cash */}
            <div className="relative overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-200/40 via-slate-100/20 to-white dark:to-[#091528] p-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-transparent dark:border-slate-700">
                  RUNNER-UP REWARD
                </span>
                <Medal className="w-4 h-4 text-slate-500" />
              </div>
              <div className="mt-1.5">
                <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">₹7,000</div>
                <p className="text-xs font-bold text-[#174478] dark:text-slate-200 truncate">Second Prize Cash Prize</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Sponsored by: <span className="font-semibold text-slate-700 dark:text-slate-300">Sunil Sheth Waje (Sarpanch)</span>
                </p>
              </div>
            </div>

            {/* Spotlight 3: 1st Prize Trophy */}
            <div className="relative overflow-hidden rounded-lg border border-[#cbd5e1] dark:border-slate-700 bg-gradient-to-br from-blue-50/50 via-white to-white dark:to-[#091528] p-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#174478] dark:text-blue-300 bg-[#f0f4f9] dark:bg-blue-950/50 px-1.5 py-0.2 rounded border border-transparent dark:border-blue-800/40">
                  CHAMPIONS TROPHY
                </span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-1.5">
                <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">₹5,000</div>
                <p className="text-xs font-bold text-[#174478] dark:text-blue-300 truncate">First Prize Trophy</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Sponsored by: <span className="font-semibold text-slate-700 dark:text-slate-300">Yash Yashwant Latke</span>
                </p>
              </div>
            </div>

            {/* Spotlight 4: Man of the Series */}
            <div className="relative overflow-hidden rounded-lg border border-emerald-200 dark:border-emerald-700/40 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white dark:to-[#091528] p-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-transparent dark:border-emerald-800/40">
                  TOURNAMENT MVP
                </span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-1.5">
                <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">₹3,000</div>
                <p className="text-xs font-bold text-[#174478] dark:text-emerald-400 truncate">Man of the Series</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Sponsored by: <span className="font-semibold text-slate-700 dark:text-slate-300">Samir Subhash Helekar</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* OFFICIAL DATA TABLE (EXACT MATCH TO PLAYERS & STATS DIRECTORY) */}
        <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[950px] border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafc] dark:bg-[#07101e] border-b border-slate-200 dark:border-slate-800 text-[#1e3a5f] dark:text-slate-200 font-bold text-xs select-none">
                <th scope="col" className="w-12 py-3.5 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedAwards.length && paginatedAwards.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#174478] dark:text-emerald-500 focus:ring-0 cursor-pointer bg-white dark:bg-slate-900"
                  />
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-left cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Award Title & Honor</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-left cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-left cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Prize Value (₹)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-4 text-left cursor-pointer hover:text-[#174478] dark:hover:text-emerald-400"
                  onClick={() => handleSort('sponsor')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Sponsoring Dignitary / Dedication</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-left">
                  <div className="flex items-center gap-1.5">
                    <span>Award Type / Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th scope="col" className="py-3.5 px-4 text-right pr-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#020712]">
              {paginatedAwards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No tournament awards found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedAwards.map((award) => {
                  const rowId = String(award.id);
                  const isSelected = selectedRows.includes(rowId);

                  return (
                    <tr
                      key={award.id}
                      className={`transition-colors hover:bg-[#f8fafc] dark:hover:bg-slate-900/60 ${
                        isSelected ? 'bg-[#f0f7ff] dark:bg-blue-950/30' : 'bg-white dark:bg-[#020712]'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-left whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(rowId)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#174478] dark:text-emerald-500 focus:ring-0 cursor-pointer bg-white dark:bg-slate-900"
                        />
                      </td>

                      {/* Award Title & Recipient with dot badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#f0f4f9] dark:bg-slate-800 border border-[#cbd5e1] dark:border-slate-700 text-[#174478] dark:text-blue-300 flex items-center justify-center shadow-2xs relative">
                            {award.type === 'cash' ? (
                              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : award.type === 'trophy' ? (
                              <Trophy className="w-4 h-4 text-amber-500" />
                            ) : award.type === 'medal' ? (
                              <Medal className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                            ) : (
                              <Gift className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                            )}
                          </div>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm tracking-tight hover:text-[#174478] dark:hover:text-emerald-400 transition-colors">
                              {award.title}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                              {award.recipient || 'Official Tournament Prize'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Pill */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block bg-[#f1f5f9] dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs px-3 py-1 rounded shadow-2xs border border-transparent dark:border-slate-700">
                          {award.category}
                        </span>
                      </td>

                      {/* Prize Value Pill */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e8f8f0] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 font-bold font-mono text-xs shadow-2xs border border-transparent dark:border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          <span>₹{award.amount.toLocaleString('en-IN')}</span>
                        </span>
                      </td>

                      {/* Sponsoring Dignitary / Dedication */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#e8f1fb] dark:bg-blue-950/40 text-[#174478] dark:text-blue-300 font-medium text-xs shadow-2xs w-fit border border-transparent dark:border-blue-900/40">
                            <span>{award.sponsor}</span>
                          </div>
                          {award.dedication && (
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 italic font-medium flex items-center gap-1 pl-1">
                              <Heart className="w-2.5 h-2.5 text-rose-500 inline shrink-0" />
                              <span>{award.dedication}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Award Type / Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider bg-[#f0fdf4] dark:bg-emerald-950/50 text-[#15803d] dark:text-emerald-300 shadow-2xs uppercase border border-transparent dark:border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                          <span>VERIFIED {award.type.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(award)}
                            title="Edit Award & Sponsorship"
                            className="w-8 h-8 rounded-lg bg-[#edf3fa] dark:bg-slate-800 hover:bg-[#dbe7f6] dark:hover:bg-slate-700 text-[#174478] dark:text-blue-300 flex items-center justify-center transition shadow-2xs cursor-pointer border border-transparent dark:border-slate-700"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAward(award.id)}
                            title="Delete Award"
                            className="w-8 h-8 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* IN-APP TOAST NOTIFICATION (NO LOCALHOST ALERT/CONFIRM) */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-[#174478] text-white px-4 py-2.5 rounded-lg shadow-lg border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/70 hover:text-white ml-2 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </PortalPageWrapper>
  );
};
