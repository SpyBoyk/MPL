import React, { useState } from 'react';
import { KeyRound, Loader2, Copy, Check } from 'lucide-react';
import { apiClient } from '../../api/client';

interface AdminResetPasswordButtonProps {
  playerId: string;
  playerName: string;
}

type Status = 'idle' | 'confirming' | 'loading' | 'success' | 'error';

interface ResetResult {
  username: string;
  temporary_password: string;
}

/** Admin-only control (render gated by isAdmin at the call site) that resets
 * a player's login password to a random temporary one via the backend's
 * admin-only reset endpoint, then shows it once for the admin to relay. */
export const AdminResetPasswordButton: React.FC<AdminResetPasswordButtonProps> = ({ playerId, playerName }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<ResetResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReset = async () => {
    setStatus('loading');
    try {
      const res = await apiClient.post<ResetResult>(`/players/${playerId}/reset-password/`);
      setResult(res.data);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.temporary_password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the password is still visible to copy by hand.
    }
  };

  if (status === 'success' && result) {
    return (
      <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs max-w-sm">
        <p className="font-semibold text-emerald-800 dark:text-emerald-300">
          Password reset for {playerName}. Share this with them now — it won't be shown again.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <code className="flex-1 font-mono text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded px-2 py-1">
            {result.temporary_password}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setResult(null);
          }}
          className="mt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          Done
        </button>
      </div>
    );
  }

  if (status === 'confirming') {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-rose-700 dark:text-rose-400">Reset {playerName}'s password?</span>
        <button
          type="button"
          onClick={handleReset}
          className="px-2.5 py-1 rounded bg-rose-600 text-white font-semibold hover:bg-rose-700 transition cursor-pointer"
        >
          Yes, reset
        </button>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setStatus('confirming')}
        disabled={status === 'loading'}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer disabled:opacity-60"
      >
        {status === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
        Reset password
      </button>
      {status === 'error' && (
        <p className="mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
          Could not reset password. Please try again.
        </p>
      )}
    </div>
  );
};
