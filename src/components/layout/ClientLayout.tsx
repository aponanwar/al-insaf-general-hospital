'use client';

import { usePathname } from 'next/navigation';
import TopHeader from '@/components/layout/TopHeader';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900">{children}</div>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <TopHeader />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </LanguageProvider>
  );
}

