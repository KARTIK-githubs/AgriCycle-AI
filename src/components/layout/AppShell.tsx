import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { Footer } from './Footer';

export const AppShell: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50 text-soil-900">
      <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />
      <MobileDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
