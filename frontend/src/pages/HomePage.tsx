import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Users,
  Shield,
  Calendar,
  Flame,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Target,
  FileCheck,
  ShieldCheck,
  Radio,
  LayoutDashboard,
  BarChart3,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { useAdvanceLoading } from '../context/LoadingContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { showLoader } = useAdvanceLoading();

  // Official 4 franchise logos for the 4-column "Our Teams" showcase
  const teamLogoIcons = [
    {
      id: 'team-logo-1',
      code: 'LG',
      name: 'Lakshmikant Group',
      src: '/images/Gemini_Generated_Image_56ytdy56ytdy56yt.png',
      alt: 'Lakshmikant Group Logo',
      borderGlow: 'hover:border-amber-400',
      badge: 'border-amber-500/60 text-amber-300 bg-amber-950/80',
    },
    {
      id: 'team-logo-2',
      code: 'A11',
      name: 'Aaradhya 11',
      src: '/images/Gemini_Generated_Image_fd48y5fd48y5fd48.png',
      alt: 'Aaradhya 11 Logo',
      borderGlow: 'hover:border-blue-400',
      badge: 'border-blue-500/60 text-blue-300 bg-blue-950/80',
    },
    {
      id: 'team-logo-3',
      code: 'DF',
      name: 'Dharmveer Fighter',
      src: '/images/Gemini_Generated_Image_jv233jv233jv233j.png',
      alt: 'Dharmveer Fighter Logo',
      borderGlow: 'hover:border-emerald-400',
      badge: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/80',
    },
    {
      id: 'team-logo-4',
      code: 'S11',
      name: 'Saish 11',
      src: '/images/Gemini_Generated_Image_i5x7wui5x7wui5x7.png',
      alt: 'Saish 11 Logo',
      borderGlow: 'hover:border-purple-400',
      badge: 'border-purple-500/60 text-purple-300 bg-purple-950/80',
    },
  ];

  const handleLaunchPortalWithLoader = () => {
    showLoader('MALGHAR PREMIER LEAGUE', 'Lohar Wadi Stadium · Match Center', 1800);
    setTimeout(() => {
      navigate('/portal');
    }, 1800);
  };

  const handleLaunchWithLoader = (url: string, title: string, subtitle: string) => {
    showLoader(title, subtitle, 1600);
    setTimeout(() => {
      navigate(url);
    }, 1600);
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#02050d] text-slate-900 dark:text-slate-100 font-sans pb-12 overflow-x-hidden transition-colors duration-300">
      {/* 0. WHOLE PAGE CRISP AMBIENT BACKGROUND (SHARP, NO BLUR) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/images/stadium_floodlit_pitch.jpg"
          alt="Lohar Wadi Stadium Ambient Background"
          className="w-full h-full object-cover object-center opacity-30 dark:opacity-35 brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-100/90 to-slate-200/95 dark:from-[#02050d]/80 dark:via-[#02050d]/85 dark:to-[#02050d]/95 transition-colors" />
      </div>

      {/* 1. TOP MATCH INFO STRIP */}
      <div className="relative z-10 w-full bg-white/95 dark:bg-[#040915]/95 border-b border-slate-200 dark:border-slate-800 py-2 sm:py-2.5 px-3 sm:px-4 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 font-mono">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-black text-amber-600 dark:text-amber-400 tracking-wider text-[11px] sm:text-xs">
              MALGHAR PREMIER LEAGUE 2026
            </span>
            <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-700 dark:text-slate-300 hidden md:inline font-bold text-[11px]">
              LOHAR WADI STADIUM · 4TH SEASON
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-slate-600 dark:text-slate-400 font-semibold text-[10px] sm:text-xs">
            <button
              onClick={() => showLoader('MALGHAR PREMIER LEAGUE', 'Lohar Wadi Stadium · Match Center', 2200)}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/80 border border-amber-400/60 text-[9px] sm:text-[10px] font-mono text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400 animate-pulse" />
              <span>LIVE MATCH CENTER</span>
            </button>
            <span className="text-sky-600 dark:text-cyan-400 font-bold">6 TEAMS</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">58 PLAYERS</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold hidden sm:inline">₹50,000 PRIZE</span>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC MOVING TICKER RIBBON 1 (LEFT TO RIGHT STREAMING) */}
      <div className="relative z-10 w-full overflow-hidden bg-gradient-to-r from-blue-100/90 via-sky-50 to-blue-100/90 dark:from-[#0d2a4c]/90 dark:via-[#071325]/95 dark:to-[#0d2a4c]/90 border-y border-sky-300/40 dark:border-cyan-500/30 py-2 transition-colors">
        <div className="animate-marquee-left flex items-center gap-8 text-[11px] font-mono font-bold tracking-widest text-blue-900 dark:text-cyan-300 whitespace-nowrap uppercase">
          <span>🏏 LOHAR WADI STADIUM LIVE MATCHES</span>
          <span>•</span>
          <span className="text-amber-700 dark:text-amber-400">MALGHAR VILLAGE CRICKET CHAMPIONSHIP</span>
          <span>•</span>
          <span className="text-emerald-700 dark:text-emerald-400">1 VILLAGE · 6 LOCAL TEAMS FIGHTING FOR THE TROPHY</span>
          <span>•</span>
          <span className="text-sky-700 dark:text-cyan-200">58 MALGHAR LOCAL PLAYERS IN ACTION</span>
          <span>•</span>
          <span className="text-purple-700 dark:text-purple-300">4 SEASONS HISTORY (2023 TO 2026)</span>
          <span>•</span>
          <span>🏏 LOHAR WADI STADIUM LIVE MATCHES</span>
          <span>•</span>
          <span className="text-amber-700 dark:text-amber-400">MALGHAR VILLAGE CRICKET CHAMPIONSHIP</span>
          <span>•</span>
          <span className="text-emerald-700 dark:text-emerald-400">1 VILLAGE · 6 LOCAL TEAMS FIGHTING FOR THE TROPHY</span>
          <span>•</span>
          <span className="text-sky-700 dark:text-cyan-200">58 MALGHAR LOCAL PLAYERS IN ACTION</span>
        </div>
      </div>

      {/* 3. MAIN BENTO GRID MATRIX CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6 sm:space-y-10">
        {/* ROW 1: APEX HERO BENTO (8 Cols) [FROM LEFT] + LIVE STADIUM ARENA SHOWCASE (4 Cols) [FROM RIGHT] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* BENTO 1: APEX HERO CARD (8 Cols) - ANIMATING FROM THE LEFT ON SCROLL */}
          <ScrollReveal direction="left" distance={60} delay={100} className="lg:col-span-8 h-full">
            <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-8 md:p-12 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[540px] h-full group bg-white dark:bg-slate-950 transition-colors">
              {/* Real Cricket Equipment on Green Grass (CRISP & UNBLURRED) */}
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src="/images/cricket-equipments-green-grass.jpg"
                  alt="Cricket Equipment on Green Grass"
                  className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700 opacity-80 dark:opacity-85 brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-[#02050e]/95 dark:via-[#02050e]/75 dark:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-[#02050e]/90 dark:via-transparent dark:to-transparent" />
              </div>

              {/* Precision SVG Pitch Geometry (NO BLUR) */}
              <svg
                className="absolute top-1/2 right-4 -translate-y-1/2 w-[500px] h-[400px] opacity-25 dark:opacity-35 pointer-events-none hidden sm:block"
                viewBox="0 0 500 400"
                fill="none"
              >
                <ellipse cx="250" cy="200" rx="230" ry="160" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="10 6" />
                <ellipse cx="250" cy="200" rx="170" ry="110" stroke="#38bdf8" strokeWidth="1.2" />
                <rect x="235" y="160" width="30" height="80" rx="3" stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245,158,11,0.08)" />
                <line x1="225" y1="172" x2="275" y2="172" stroke="#64748b" strokeWidth="1.5" />
                <line x1="225" y1="228" x2="275" y2="228" stroke="#64748b" strokeWidth="1.5" />
              </svg>

              {/* Top Eyebrow Badge (Entering from Left) with Official Logo */}
              <div className="relative z-10 space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-3 px-3 sm:px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-amber-500/80 dark:border-amber-400 shadow-xl backdrop-blur-md">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-amber-500/40 dark:border-amber-400/40 bg-white dark:bg-slate-900 flex items-center justify-center p-0.5 shadow-md shrink-0">
                    <img
                      src="/images/mpl-logo-clean.png"
                      alt="MPL Official Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500" />
                      </span>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                        MALGHAR PREMIER LEAGUE 2026
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                      Lohar Wadi Stadium · 1 Village · 6 Teams · 58 Players
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-slate-950 dark:text-white font-heading">
                  The Biggest Stage of{' '}
                  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 dark:from-amber-200 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(245,158,11,0.5)]">
                    Village Cricket.
                  </span>
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-200 max-w-2xl font-medium leading-relaxed drop-shadow">
                  Welcome to Malghar Premier League! 1 village, 6 local teams, and 58 village players. Follow your local teams,
                  check live match scores, see player records, and watch exciting cricket under the night lights at Lohar Wadi Stadium.
                </p>
              </div>

              {/* Bottom Actions - Full Width Stack on Mobile for Easy Tapping */}
              <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-6 sm:pt-8 w-full sm:w-auto">
                <button
                  onClick={handleLaunchPortalWithLoader}
                  className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#174478] via-[#1d5b9f] to-[#123660] hover:brightness-110 text-white font-black text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-xl shadow-[#174478]/40 hover:-translate-y-0.5 transition-all border border-cyan-400 cursor-pointer w-full sm:w-auto"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-300" />
                  <span>See Matches & Scores</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/portal/players"
                  className="flex items-center justify-center gap-2 bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-slate-300 dark:border-slate-600 shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                >
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Our Village Players</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* BENTO 2: HIGH-DEFINITION STADIUM FLOODLIT ARENA SHOWCASE (4 Cols) - ANIMATING FROM THE RIGHT ON SCROLL */}
          <ScrollReveal direction="right" distance={60} delay={150} className="lg:col-span-4 h-full">
            <div className="relative rounded-2xl sm:rounded-3xl border border-slate-700 shadow-2xl overflow-hidden min-h-[260px] sm:min-h-[500px] h-full flex flex-col justify-end group bg-slate-950">
              <img
                src="/images/stadium_floodlit_pitch.jpg"
                alt="Lohar Wadi Stadium Pitch"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95 brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02050e] via-[#02050e]/35 to-transparent" />

              <div className="relative z-10 p-4 sm:p-6 space-y-1.5 sm:space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-900/95 border border-amber-400 text-[9px] sm:text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider shadow">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Lohar Wadi Stadium
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                  Night Matches Under Floodlights
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-100 drop-shadow leading-relaxed font-semibold">
                  A beautiful ground and electrifying night atmosphere where all village fans come together.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* DYNAMIC MOVING TICKER RIBBON 2 (RIGHT TO LEFT STREAMING OPPOSITE DIRECTION) */}
        <div className="relative z-10 w-full overflow-hidden bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 dark:from-[#2a1b04]/90 dark:via-[#191002]/95 dark:to-[#2a1b04]/90 border-y border-amber-500/30 py-2">
          <div className="animate-marquee-right flex items-center gap-8 text-[11px] font-mono font-bold tracking-widest text-amber-800 dark:text-amber-300 whitespace-nowrap uppercase">
            <span>🏆 LAKSHMIKANT GROUP (LG)</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-300">AARADHYA 11 (A11)</span>
            <span>•</span>
            <span className="text-yellow-600 dark:text-yellow-300">DHARMVEER FIGHTER (DF)</span>
            <span>•</span>
            <span className="text-orange-600 dark:text-orange-300">SAISH 11 (S11)</span>
            <span>•</span>
            <span className="text-purple-600 dark:text-purple-300">SHIVNERI 11 (SN11)</span>
            <span>•</span>
            <span className="text-cyan-700 dark:text-cyan-300">OMKAR 11 (OM11)</span>
            <span>•</span>
            <span>🏆 LAKSHMIKANT GROUP (LG)</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-300">AARADHYA 11 (A11)</span>
            <span>•</span>
            <span className="text-yellow-600 dark:text-yellow-300">DHARMVEER FIGHTER (DF)</span>
          </div>
        </div>

        {/* ROW 2: "OUR TEAMS" (VILLAGE CHAMPIONS) SECTION - Dedicated Sharp Stadium Background */}
        <section className="relative rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-8 shadow-xl dark:shadow-2xl space-y-4 sm:space-y-6 overflow-hidden bg-white/95 dark:bg-slate-950 backdrop-blur-md">
          {/* Distinct, Crisp Stadium Arena Background (NO BLUR) */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/images/action-stadium.jpg"
              alt="Stadium Crowd Arena"
              className="w-full h-full object-cover object-center opacity-10 dark:opacity-45 brightness-100"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95 dark:from-[#02050d]/85 dark:via-[#02050d]/75 dark:to-[#02050d]/90" />
          </div>

          {/* Section Header (Slides in from Left) */}
          <ScrollReveal direction="left" distance={45}>
            <div className="relative z-10 border-b border-slate-200 dark:border-slate-700 pb-3 sm:pb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Village Champions</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 sm:mt-1 tracking-tight">
                  Our 6 Teams
                </h2>
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                Official Teams
              </span>
            </div>
          </ScrollReveal>

          {/* 2-Col on Mobile / 4-Col on Desktop Team Logo Grid with Alternating Left and Right Entrance */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {teamLogoIcons.map((logo, index) => {
              // First 2 slide in from Left, last 2 slide in from Right
              const isLeft = index < 2;

              return (
                <ScrollReveal
                  key={logo.id}
                  direction={isLeft ? 'left' : 'right'}
                  distance={50}
                  delay={index * 100}
                >
                  <div
                    className={`group relative bg-slate-50/90 dark:bg-slate-950/85 border border-slate-200/90 dark:border-slate-700/80 ${logo.borderGlow} rounded-xl sm:rounded-2xl p-3 sm:p-6 transition-all duration-300 flex flex-col items-center justify-between shadow-md dark:shadow-xl hover:-translate-y-1.5 overflow-hidden h-full`}
                  >
                    {/* Pedestal Top Shimmer Line */}
                    <div className="absolute top-0 inset-x-4 sm:inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

                    {/* Team Code Badge */}
                    <div className="w-full flex items-center justify-between relative z-10 mb-1.5 sm:mb-2">
                      <span className={`text-[9px] sm:text-[10px] font-mono font-black px-2 sm:px-2.5 py-0.5 rounded border ${logo.badge}`}>
                        {logo.code}
                      </span>
                      <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-400 shadow-sm" />
                    </div>

                    {/* Logo Emblem Container */}
                    <div className="w-full h-32 sm:h-52 lg:h-60 flex items-center justify-center p-1 sm:p-2 relative z-10">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
                      />
                    </div>

                    {/* Base Pedestal Label */}
                    <div className="w-full pt-2 sm:pt-3 mt-1 sm:mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 relative z-10 font-bold">
                      <span className="truncate">{logo.name}</span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase shrink-0">Team</span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* ROW 3: TOURNAMENT CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {/* Card 1: Standings with Crisp Golden Trophy Background (From Left) */}
          <ScrollReveal direction="left" distance={60} delay={100}>
            <button
              onClick={() => handleLaunchWithLoader('/portal/points-table', 'MALGHAR PREMIER LEAGUE', 'Points Table & Team Ranks')}
              className="w-full text-left group relative rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 p-5 sm:p-6 flex flex-col justify-between shadow-md dark:shadow-xl hover:-translate-y-1.5 transition-all overflow-hidden min-h-[190px] sm:min-h-[240px] bg-slate-950 cursor-pointer block h-full"
            >
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src="/images/cricket_golden_trophy.jpg"
                  alt="Championship Trophy"
                  className="w-full h-full object-cover object-center opacity-85 brightness-105 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02050d] via-[#02050d]/55 to-[#02050d]/30" />
              </div>

              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/25 border border-amber-400 flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                </div>
                <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors drop-shadow-md">
                  Points Table
                </h3>
                <p className="text-xs text-slate-100 mt-1 leading-relaxed drop-shadow font-semibold">
                  See which team is on top, points won, and who qualifies for the semi-finals.
                </p>
              </div>
              <div className="mt-4 sm:mt-6 pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-bold text-amber-400 relative z-10">
                <span>View Points Table</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </ScrollReveal>

          {/* Card 2: Fixtures with Crisp Floodlit Arena Background (From Left) */}
          <ScrollReveal direction="left" distance={60} delay={150}>
            <button
              onClick={() => handleLaunchWithLoader('/portal/matches', 'MALGHAR PREMIER LEAGUE', 'Match Dates & Timings')}
              className="w-full text-left group relative rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-cyan-400 p-5 sm:p-6 flex flex-col justify-between shadow-md dark:shadow-xl hover:-translate-y-1.5 transition-all overflow-hidden min-h-[190px] sm:min-h-[240px] bg-slate-950 cursor-pointer block h-full"
            >
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src="/images/stadium_floodlit_pitch.jpg"
                  alt="Stadium Floodlit Arena"
                  className="w-full h-full object-cover object-center opacity-85 brightness-105 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02050d] via-[#02050d]/55 to-[#02050d]/30" />
              </div>

              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-500/25 border border-cyan-400 flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
                </div>
                <h3 className="text-base font-black text-white group-hover:text-cyan-400 transition-colors drop-shadow-md">
                  Matches & Schedule
                </h3>
                <p className="text-xs text-slate-100 mt-1 leading-relaxed drop-shadow font-semibold">
                  Complete match dates, evening game timings, and playoff finals.
                </p>
              </div>
              <div className="mt-4 sm:mt-6 pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-bold text-cyan-400 relative z-10">
                <span>View All Matches</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </ScrollReveal>

          {/* Card 3: Top Batsmen & Bowlers (From Right) */}
          <ScrollReveal direction="right" distance={60} delay={100}>
            <button
              onClick={() => handleLaunchWithLoader('/portal/statistics', 'MALGHAR PREMIER LEAGUE', 'Top Batsmen & Bowlers')}
              className="w-full text-left group relative rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-orange-400 p-5 sm:p-6 flex flex-col justify-between shadow-md dark:shadow-xl hover:-translate-y-1.5 transition-all overflow-hidden min-h-[190px] sm:min-h-[240px] bg-slate-950 cursor-pointer block h-full"
            >
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src="/images/cricket_ball_turf.jpg"
                  alt="Cricket Ball on Turf"
                  className="w-full h-full object-cover object-center opacity-85 brightness-105 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02050d] via-[#02050d]/55 to-[#02050d]/30" />
              </div>

              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-500/25 border border-orange-400 flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300" />
                </div>
                <h3 className="text-base font-black text-white group-hover:text-orange-400 transition-colors drop-shadow-md">
                  Orange & Purple Cap
                </h3>
                <p className="text-xs text-slate-100 mt-1 leading-relaxed drop-shadow font-semibold">
                  Most runs by batsmen (Orange Cap) and most wickets by bowlers (Purple Cap).
                </p>
              </div>
              <div className="mt-4 sm:mt-6 pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-bold text-orange-400 relative z-10">
                <span>View Top Scorers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </ScrollReveal>

          {/* Card 4: Team Players (From Right) */}
          <ScrollReveal direction="right" distance={60} delay={150}>
            <button
              onClick={() => handleLaunchWithLoader('/portal/teams', 'MALGHAR PREMIER LEAGUE', '6 Teams · 58 Village Players')}
              className="w-full text-left group relative rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 p-5 sm:p-6 flex flex-col justify-between shadow-md dark:shadow-xl hover:-translate-y-1.5 transition-all overflow-hidden min-h-[190px] sm:min-h-[240px] bg-slate-950 cursor-pointer block h-full"
            >
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src="/images/cricket-equipments-green-grass.jpg"
                  alt="Cricket Squads Equipment"
                  className="w-full h-full object-cover object-center opacity-85 brightness-105 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02050d] via-[#02050d]/55 to-[#02050d]/30" />
              </div>

              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/25 border border-emerald-400 flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                </div>
                <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors drop-shadow-md">
                  Teams & Squads
                </h3>
                <p className="text-xs text-slate-100 mt-1 leading-relaxed drop-shadow font-semibold">
                  See player lists of all 6 village teams and their team captains.
                </p>
              </div>
              <div className="mt-4 sm:mt-6 pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-bold text-emerald-400 relative z-10">
                <span>View All Teams</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </ScrollReveal>
        </section>

        {/* ROW 3.5: STADIUM HIGHLIGHTS STRIP (2-COL ON MOBILE, TEXT APPEARING FROM LEFT AND RIGHT AT EVERY SCROLL) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Stat 1: Sliding from Left on every scroll */}
          <ScrollReveal direction="left" distance={70} delay={50}>
            <div className="relative rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#050b18]/90 p-3.5 sm:p-5 overflow-hidden shadow-sm dark:shadow-lg group hover:border-cyan-500/80 transition-all">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 truncate">
                  MATCH GROUND
                </span>
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">Lohar Wadi</div>
              <div className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold mt-1 truncate">Lohar Wadi Stadium</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">Malghar Village</div>
            </div>
          </ScrollReveal>

          {/* Stat 2: Sliding from Left on every scroll */}
          <ScrollReveal direction="left" distance={70} delay={100}>
            <div className="relative rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#050b18]/90 p-3.5 sm:p-5 overflow-hidden shadow-sm dark:shadow-lg group hover:border-amber-500/80 transition-all">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 truncate">
                  NIGHT LIGHTS
                </span>
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">Bright Lights</div>
              <div className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold mt-1 truncate">High-Power LED Towers</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">Evening Night Matches</div>
            </div>
          </ScrollReveal>

          {/* Stat 3: Sliding from Right on every scroll */}
          <ScrollReveal direction="right" distance={70} delay={50}>
            <div className="relative rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#050b18]/90 p-3.5 sm:p-5 overflow-hidden shadow-sm dark:shadow-lg group hover:border-emerald-500/80 transition-all">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 truncate">
                  VILLAGE HEROES
                </span>
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">58 Players</div>
              <div className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold mt-1 truncate">1 Village · 6 Local Teams</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">Malghar Local Talent</div>
            </div>
          </ScrollReveal>

          {/* Stat 4: Sliding from Right on every scroll */}
          <ScrollReveal direction="right" distance={70} delay={100}>
            <div className="relative rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#050b18]/90 p-3.5 sm:p-5 overflow-hidden shadow-sm dark:shadow-lg group hover:border-purple-500/80 transition-all">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 truncate">
                  GRAND PRIZE
                </span>
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">₹50,000</div>
              <div className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold mt-1 truncate">Winner's Cup & Cash</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">Season 2026 Champion</div>
            </div>
          </ScrollReveal>
        </section>

        {/* ROW 4: PLAYERS INFORMATION BANNER - Left Content from Left, Right Action from Right */}
        <section className="relative rounded-2xl sm:rounded-3xl border border-cyan-500 p-5 sm:p-10 lg:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden group bg-slate-950">
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/images/action-batsman.jpg"
              alt="Action Cricket Batsman Shot"
              className="w-full h-full object-cover object-center opacity-85 brightness-105 scale-100 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#02050e]/95 via-[#02050e]/80 to-[#02050e]/50" />
          </div>

          {/* Left Text (Entering from Left on Scroll) */}
          <ScrollReveal direction="left" distance={50} className="space-y-2.5 sm:space-y-3 max-w-xl text-center lg:text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyan-950/90 text-cyan-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-cyan-400 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" /> Village Cricket Talent
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-md">
              Check Player Scores, Runs & Bowling Records
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-semibold drop-shadow">
              Every village player has their own profile page! See how many runs your favorite batsman scored,
              how many wickets your bowler took, and their performance over the last 4 seasons (2023 to 2026).
            </p>
          </ScrollReveal>

          {/* Right Action Buttons (Entering from Right on Scroll - Mobile Stack) */}
          <ScrollReveal direction="right" distance={50} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 shrink-0 relative z-10 w-full sm:w-auto">
            <button
              onClick={handleLaunchPortalWithLoader}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>View Player Records</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/portal/players"
              className="bg-slate-900/95 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-slate-600 shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Users className="w-4 h-4 text-cyan-300" />
              <span>All 58 Players</span>
            </Link>
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
};
