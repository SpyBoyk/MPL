import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const RootLayout: React.FC = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#02050d] text-slate-900 dark:text-slate-100 w-full overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
