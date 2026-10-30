import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronDown,
} from 'lucide-react';
import { PortalPageWrapper } from '../components/portal/PortalPageWrapper';
import { apiClient } from '../api/client';
import type { AwardItem } from './AwardsPage';

const STORAGE_KEY = 'mpl_awards_data_v1';

export const AwardFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AwardItem['category']>('Individual');
  const [type, setType] = useState<AwardItem['type']>('cash');
  const [amount, setAmount] = useState<number | ''>(1000);
  const [sponsor, setSponsor] = useState('');
  const [recipient, setRecipient] = useState('');
  const [dedication, setDedication] = useState('');

  // Load existing award if editing
  useEffect(() => {
    if (isEdit && id) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const list: AwardItem[] = JSON.parse(saved);
          const found = list.find((item) => String(item.id) === String(id));
          if (found) {
            setTitle(found.title);
            setCategory(found.category);
            setType(found.type);
            setAmount(found.amount);
            setSponsor(found.sponsor);
            setRecipient(found.recipient || '');
            setDedication(found.dedication || '');
          }
        }
      } catch (e) {
        console.error('Failed loading award for editing', e);
      }
    }
  }, [isEdit, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const list: AwardItem[] = saved ? JSON.parse(saved) : [];

      if (isEdit && id) {
        // Update existing item
        const updated = list.map((item) =>
          String(item.id) === String(id)
            ? {
                ...item,
                title: title.trim(),
                category,
                type,
                amount: Number(amount) || 0,
                sponsor: sponsor.trim() || 'MPL Organizing Committee',
                dedication: dedication.trim() || undefined,
                recipient: recipient.trim() || undefined,
              }
            : item
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } else {
        // Add new item
        const nextId = list.reduce((max, a) => Math.max(max, a.id), 0) + 1;
        const newAward: AwardItem = {
          id: nextId,
          title: title.trim(),
          category,
          type,
          amount: Number(amount) || 0,
          sponsor: sponsor.trim() || 'MPL Organizing Committee',
          dedication: dedication.trim() || undefined,
          recipient: recipient.trim() || undefined,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([newAward, ...list]));

        // Sync with backend API
        apiClient.post('/awards/', {
          title: newAward.title,
          category: newAward.category,
          award_type: newAward.type,
          amount: newAward.amount,
          sponsor: newAward.sponsor,
          dedication: newAward.dedication || '',
          recipient: newAward.recipient || '',
        }).catch(() => {});
      }

      // Return directly to awards list without alert
      navigate('/portal/awards');
    } catch (e) {
      console.error('Failed saving award', e);
    }
  };

  return (
    <PortalPageWrapper
      pageTitle={isEdit ? 'Edit Tournament Award' : 'Add New Tournament Award'}
      kpis={[]}
      hideToolbar={true}
    >
      {/* Exact UI format matching reference screenshot: Clean 3-column rows, separate labels, no background border box */}
      <div className="py-8 sm:py-12 px-4 sm:px-10 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* ROW 1: 3 COLUMNS (Award title, Category, Award type) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Award title */}
            <div>
              <label htmlFor="award-title" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Award title
              </label>
              <div className="relative">
                <input
                  id="award-title"
                  type="text"
                  required
                  placeholder="e.g. Best Bowler, First Prize Cash"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs ${
                    title.trim().length > 2
                      ? 'border-emerald-400 focus:border-emerald-500 pr-9'
                      : 'border-slate-200 focus:border-[#174478] hover:border-slate-300'
                  }`}
                />
                {title.trim().length > 2 && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="award-category" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  id="award-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="Championship">Championship & Teams</option>
                  <option value="Individual">Individual Honors</option>
                  <option value="Match Awards">Match Awards (10 Matches)</option>
                  <option value="Mementos & Medals">Mementos & Medals</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Award type */}
            <div>
              <label htmlFor="award-type" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Award type
              </label>
              <div className="relative">
                <select
                  id="award-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full appearance-none px-3.5 pr-8 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs cursor-pointer font-medium"
                >
                  <option value="cash">Cash Prize</option>
                  <option value="trophy">Trophy</option>
                  <option value="medal">Medals</option>
                  <option value="memento">Memento</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ROW 2: 3 COLUMNS (Cash value, Sponsoring dignitary, Intended recipient) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Cash value / cost */}
            <div>
              <label htmlFor="award-amount" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Cash value / cost (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs sm:text-sm pointer-events-none">
                  ₹
                </span>
                <input
                  id="award-amount"
                  type="number"
                  min="0"
                  step="50"
                  required
                  placeholder="e.g. 1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs font-mono"
                />
              </div>
            </div>

            {/* Sponsoring dignitary */}
            <div>
              <label htmlFor="award-sponsor" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Sponsoring dignitary
              </label>
              <input
                id="award-sponsor"
                type="text"
                required
                placeholder="e.g. Ashish Kilaje & Akshay Kilaje"
                value={sponsor}
                onChange={(e) => setSponsor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs"
              />
            </div>

            {/* Intended recipient */}
            <div>
              <label htmlFor="award-recipient" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Intended recipient
              </label>
              <input
                id="award-recipient"
                type="text"
                placeholder="e.g. Champion Team, Orange Cap Winner"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs"
              />
            </div>
          </div>

          {/* ROW 3: FULL WIDTH (Dedication / In Memory Of & notes) */}
          <div>
            <label htmlFor="award-dedication" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
              Dedication & notes
            </label>
            <textarea
              id="award-dedication"
              rows={3}
              placeholder="e.g. In Memory of Subhash Krishna Helekar, special dedication or tournament recognition details..."
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#174478] rounded-lg text-slate-800 text-xs sm:text-sm outline-none transition shadow-2xs resize-none"
            />
          </div>

          {/* BOTTOM ACTION BAR (Exact match to screenshot: helper on left, buttons on right) */}
          <div className="pt-6 sm:pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Provide clear details for the award. Official records will be visible on the live portal directory.
            </p>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => navigate('/portal/awards')}
                className="px-5 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-600 font-semibold rounded-lg transition text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#174478] hover:bg-[#123660] text-white font-bold rounded-lg transition shadow-xs text-xs sm:text-sm cursor-pointer"
              >
                {isEdit ? 'Save Changes' : 'Create Award'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PortalPageWrapper>
  );
};
