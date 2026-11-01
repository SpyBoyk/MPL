import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

const ICONS: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

// One shared visual language for every toast across the whole app — the
// landing/auth pages and the portal use different themes, so the toast
// deliberately carries its own fixed dark surface rather than matching
// whichever page it happens to appear on.
const ACCENT: Record<ToastType, string> = {
  success: 'text-emerald-400 border-emerald-500/30',
  error: 'text-rose-400 border-rose-500/30',
  info: 'text-sky-400 border-sky-500/30',
};

let nextId = 1;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        aria-live="polite"
        className="fixed inset-x-0 bottom-4 sm:bottom-6 z-[9999] flex flex-col items-center gap-2 px-4 pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto w-full max-w-sm sm:max-w-md flex items-start gap-3 rounded-xl border bg-slate-900/95 backdrop-blur px-4 py-3 shadow-2xl shadow-black/40 ${ACCENT[toast.type]}`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${ACCENT[toast.type].split(' ')[0]}`} />
                <p className="flex-1 text-sm font-medium text-white leading-snug">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss"
                  className="shrink-0 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
