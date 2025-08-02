"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast'; // ✅ Add this
import SideNav from './_components/SideNav';
import Header from './_components/Header';

function Layout({ children }) {
  return (
    <SessionProvider>
      {/* Toast Notification System */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar - visible only on md+ screens */}
        <aside className="hidden md:block md:w-64 fixed h-full bg-white shadow-lg z-30">
          <SideNav />
        </aside>

        {/* Main content area */}
        <div className="flex-1 w-full md:ml-64">
          <Header />
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}

export default Layout;