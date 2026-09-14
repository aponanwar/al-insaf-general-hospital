'use client';

import { usePathname } from 'next/navigation';
import TopHeader from '@/components/layout/TopHeader';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="min-h-screen bg-slate-100 font-sans text-slate-900">{children}</div>;
  }

  return (
    <>
      <TopHeader />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
