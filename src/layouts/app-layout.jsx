import Header from '@/components/header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className='min-h-screen p-10 pt-0'>
        <Header />
        <Outlet />
      </main>
      <footer className="p-5 text-center bg-gray-900 mt-10 font-bold">
        Developed by Abhijith &copy; All rights reserved...
      </footer>
    </div>
  );
}

export default AppLayout;
