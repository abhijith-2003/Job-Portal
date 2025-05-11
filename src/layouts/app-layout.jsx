import Header from '@/components/header';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { socialIcons } from '@/data/socialIcons';

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className='min-h-screen p-10 pt-0'>
        <Header />
        <Outlet />
      </main>
      <footer className="w-full py-10 border-t border-gray-800 text-gray-400 text-sm bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img src="/logo.png" className="h-10" alt="Logo" />
            <span>© 2025 Job Portal. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Support</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
          <div className="flex gap-4">
            {socialIcons.map((icon, idx) => (
              <img key={idx} src={icon.src} alt={icon.alt} className="w-7 h-7 rounded-full bg-white/20 p-1" />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
