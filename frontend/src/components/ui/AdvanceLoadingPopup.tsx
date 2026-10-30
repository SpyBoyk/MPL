import React, { useEffect, useState } from 'react';
import {
  Radio,
  Sparkles,
  Shield,
  Activity,
  CheckCircle2,
  X,
  Zap,
  Layers,
  Database,
  Cpu,
} from 'lucide-react';

interface AdvanceLoadingPopupProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  duration?: number; // ms to auto complete, default 2400
}

export const AdvanceLoadingPopup: React.FC<AdvanceLoadingPopupProps> = ({
  isOpen,
  onClose,
  title = 'MALGHAR PREMIER LEAGUE',
  subtitle = 'Lohar Wadi Stadium · Match Center',
  duration = 2400,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Connecting to Lohar Wadi Stadium...', icon: <Radio className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'Loading 6 Malghar Village Teams...', icon: <Shield className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Loading 58 Malghar Village Players...', icon: <Cpu className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'Getting Match Scores & Standings...', icon: <Database className="w-3.5 h-3.5 text-purple-400" /> },
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const intervalTime = 40;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, Math.round(prev + increment));
        if (next >= 75) setCurrentStep(3);
        else if (next >= 50) setCurrentStep(2);
        else if (next >= 25) setCurrentStep(1);
        else setCurrentStep(0);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onClose) onClose();
          }, 400);
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      {/* Background Radial Glow */}
      <div className="absolute w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-[260px] sm:w-[400px] h-[260px] sm:h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none translate-x-12 translate-y-12 sm:translate-x-20 sm:translate-y-20" />

      {/* Main HUD Card */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#060d1a] via-[#040813] to-[#02050c] border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Futuristic Corner Tech Accents */}
        <div className="absolute top-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl sm:rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-r-2 border-amber-400 rounded-tr-xl sm:rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl sm:rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-r-2 border-amber-400 rounded-br-xl sm:rounded-br-2xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="relative w-7 h-7 shrink-0 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center shadow-inner">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider sm:tracking-widest text-cyan-400 uppercase truncate block">
                {title}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 truncate block">{subtitle}</span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 shrink-0 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center Futuristic Orbital Radar / Hologram */}
        <div className="py-4 sm:py-6 flex flex-col items-center justify-center relative">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            {/* Outer Spinning Ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40 animate-spin [animation-duration:10s]" />
            <div className="absolute inset-2 rounded-full border border-amber-400/30 animate-spin [animation-duration:6s] [animation-direction:reverse]" />
            <div className="absolute inset-5 sm:inset-6 rounded-full border border-cyan-400/50 animate-ping [animation-duration:2.5s]" />

            {/* Center Percentage Display */}
            <div className="relative z-10 flex flex-col items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#030712] border border-cyan-400/60 shadow-lg shadow-cyan-500/30">
              <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tighter">
                {progress}%
              </span>
              <span className="text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                LOADING
              </span>
            </div>
          </div>

          {/* Equalizer Waveform Lines */}
          <div className="flex items-center gap-1 mt-3 sm:mt-4">
            {[40, 75, 55, 90, 60, 100, 70, 85, 45, 95, 65, 80].map((h, i) => (
              <div
                key={i}
                style={{
                  height: `${Math.max(6, Math.round(h * (progress / 100)))}px`,
                }}
                className={`w-0.5 sm:w-1 rounded-full transition-all duration-150 ${
                  i % 2 === 0 ? 'bg-cyan-400' : 'bg-amber-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Telemetry Step Pipeline */}
        <div className="space-y-2 py-2">
          {steps.map((step, idx) => {
            const isDone = currentStep > idx || progress === 100;
            const isCurrent = currentStep === idx && progress < 100;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-1.5 sm:p-2 rounded-xl border text-[10px] sm:text-xs font-mono transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-cyan-950/40 border-cyan-400/60 text-cyan-200 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  {step.icon}
                  <span className="truncate text-[10px] sm:text-[11px] font-medium">{step.label}</span>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] text-slate-600 font-bold shrink-0">WAIT</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Energy Progress Bar */}
        <div className="pt-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1 font-bold">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" /> TOURNAMENT MATCH CENTER
            </span>
            <span className="text-amber-400 font-bold">{progress}% READY</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-75"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
