'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith('/admin/login') ||
    pathname?.startsWith('/admin/forgot-password') ||
    pathname?.startsWith('/admin/reset-password');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-100">
        {children}
      </main>
    </div>
  );
}
