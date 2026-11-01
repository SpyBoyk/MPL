import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ShieldCheck,
  Users,
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  CircleDollarSign,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { PortalPageWrapper, type KpiTileItem } from '../components/portal/PortalPageWrapper';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

type PaymentStatus = 'unpaid' | 'pending' | 'verified' | 'rejected';

interface AdminUser {
  id: number;
  full_name: string;
  phone_number: string;
  photo: string | null;
  payment_status: PaymentStatus;
  payment_screenshot: string | null;
  payment_note: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
  };
}

const PAYMENT_BADGE: Record<PaymentStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  unpaid: { label: 'Not paid', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', Icon: Clock },
  pending: { label: 'Pending review', cls: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', Icon: Clock },
  verified: { label: 'Verified', cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300', Icon: CheckCircle2 },
  rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300', Icon: XCircle },
};

async function fetchAllUsers(): Promise<AdminUser[]> {
  const all: AdminUser[] = [];
  let url: string | null = '/admin/users/';
  while (url) {
    const res = await apiClient.get(url);
    all.push(...(res.data?.results ?? []));
    const next = res.data?.next as string | null;
    // `next` is an absolute backend URL — keep only the path+query so it
    // still goes through the same apiClient baseURL/proxy.
    url = next ? next.replace(/^https?:\/\/[^/]+\/api/, '') : null;
  }
  return all;
}

export const AdminUsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [actingId, setActingId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { isAdmin } = useAuth();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAllUsers,
    enabled: isAdmin,
  });

  const filtered = useMemo(() => {
    let list = users ?? [];
    if (statusFilter !== 'all') {
      list = list.filter((u) => u.payment_status === statusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.user.username.toLowerCase().includes(q) ||
          u.user.email.toLowerCase().includes(q) ||
          u.phone_number?.includes(q)
      );
    }
    return list;
  }, [users, search, statusFilter]);

  const kpis: KpiTileItem[] = useMemo(() => {
    const list = users ?? [];
    const pending = list.filter((u) => u.payment_status === 'pending').length;
    const verified = list.filter((u) => u.payment_status === 'verified').length;
    const admins = list.filter((u) => u.user.is_staff).length;
    return [
      { label: 'TOTAL ACCOUNTS', value: list.length, sublabel: 'Registered players', icon: <Users className="w-4 h-4 text-[#174478]" /> },
      { label: 'PENDING REVIEW', value: pending, sublabel: 'Awaiting payment check', sublabelColor: 'orange', icon: <Clock className="w-4 h-4 text-amber-500" /> },
      { label: 'VERIFIED PAYMENTS', value: verified, sublabel: 'Confirmed by admin', sublabelColor: 'green', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
      { label: 'ADMIN ACCOUNTS', value: admins, sublabel: 'Staff access', icon: <ShieldCheck className="w-4 h-4 text-[#174478]" /> },
    ];
  }, [users]);

  const handlePaymentAction = async (userId: number, newStatus: 'verified' | 'rejected') => {
    setActingId(userId);
    try {
      await apiClient.post(`/admin/users/${userId}/payment-status/`, { status: newStatus });
      showToast(`Payment marked as ${newStatus}.`, 'success');
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } catch {
      showToast('Could not update payment status. Please try again.', 'error');
    } finally {
      setActingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-24 text-center">
        <ShieldCheck className="w-10 h-10 text-slate-300 dark:text-slate-700" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          You need an admin account to view user management.
        </p>
      </div>
    );
  }

  return (
    <PortalPageWrapper
      pageTitle="User Management"
      kpis={kpis}
      searchPlaceholder="Search by name, username, email or phone..."
      searchValue={search}
      onSearchChange={setSearch}
      hideToolbar={false}
    >
      {/* Payment status filter chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'pending', 'verified', 'rejected', 'unpaid'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === s
                ? 'bg-[#174478] dark:bg-sky-600 text-white'
                : 'bg-white dark:bg-[#0e172e] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {s === 'all' ? 'All' : PAYMENT_BADGE[s].label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0b1329] rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3 hidden sm:table-cell">Contact</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">
                    Loading accounts…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">
                    No accounts match this search/filter.
                  </td>
                </tr>
              )}
              {filtered.map((u) => {
                const badge = PAYMENT_BADGE[u.payment_status];
                return (
                  <tr key={u.id} className="border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#174478]/10 dark:bg-sky-950/60 text-[#174478] dark:text-sky-300 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {u.photo ? (
                            <img src={u.photo} alt={u.full_name} className="w-full h-full object-cover" />
                          ) : (
                            (u.full_name || u.user.username).charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-white truncate">{u.full_name || u.user.username}</p>
                          <p className="text-[11px] text-slate-400 truncate">@{u.user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[180px]">{u.user.email}</p>
                      <p className="text-[11px] text-slate-400">{u.phone_number || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.user.is_active
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          }`}
                        >
                          {u.user.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {u.user.is_staff && (
                          <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#174478]/10 text-[#174478] dark:bg-sky-950/50 dark:text-sky-300">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase ${badge.cls}`}>
                        <badge.Icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                      {u.payment_screenshot && (
                        <a
                          href={u.payment_screenshot}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#174478] dark:text-sky-400 hover:underline w-fit"
                        >
                          <ExternalLink className="w-3 h-3" /> View screenshot
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.payment_status === 'pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={actingId === u.id}
                            onClick={() => handlePaymentAction(u.id, 'verified')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition cursor-pointer disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={actingId === u.id}
                            onClick={() => handlePaymentAction(u.id, 'rejected')}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 transition cursor-pointer disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Banknote className="w-3.5 h-3.5" />
        Verifying a payment or rejecting it updates the player's status immediately — they'll see it reflected on their profile.
        <CircleDollarSign className="w-3.5 h-3.5 ml-auto opacity-0" aria-hidden />
      </p>
    </PortalPageWrapper>
  );
};
