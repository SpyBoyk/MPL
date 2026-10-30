import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-6 text-amber-400">
        <Trophy className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-heading font-black text-white tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-heading font-bold text-slate-200 mb-3">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
        The match, player, or page you were looking for seems to have stepped out of the crease and been stumped.
      </p>
      <Link
        to="/"
        className="bg-[#174478] hover:bg-[#123660] text-white px-6 py-2.5 font-bold text-sm shadow-xl flex items-center gap-2 [clip-path:polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to MPL Home
      </Link>
    </div>
  );
};
