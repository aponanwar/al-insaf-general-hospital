'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Contact,
  Stethoscope,
  Receipt,
  Users,
  MessageSquare,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Activity,
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  isDynamicBadge?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard Overview',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Appointments',
    href: '/admin/appointments',
    icon: Calendar,
  },
  {
    name: 'Patient Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
    isDynamicBadge: true,
  },
  {
    name: 'Staff List & HR',
    href: '/admin/staff',
    icon: Contact,
    badge: '9 Roles',
  },
  {
    name: 'Doctors List',
    href: '/admin/doctors',
    icon: Stethoscope,
  },
  {
    name: 'Rates & Tariffs',
    href: '/admin/rates',
    icon: Receipt,
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [unreadInquiries, setUnreadInquiries] = useState<number>(0);

  useEffect(() => {
    fetch('/api/inquiries')
      .then((res) => res.json())
      .then((data) => {
        if (data?.inquiries) {
          const unread = data.inquiries.filter((i: any) => i.status === 'Unread').length;
          setUnreadInquiries(unread);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/admin/login';
    }
  };

  const NavLinks = () => (
    <div className="space-y-1.5 px-3 py-4">
      <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        Management Categories
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </div>
            {item.isDynamicBadge && unreadInquiries > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-rose-500 text-white shadow-sm animate-pulse">
                {unreadInquiries} New
              </span>
            )}
            {item.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                }`}
              >
                {item.badge}
              </span>
            )}
            {!item.badge && (!item.isDynamicBadge || unreadInquiries === 0) && isActive && (
              <ChevronRight className="w-3.5 h-3.5 text-white/70" />
            )}
          </Link>
        );
      })}

      <div className="pt-6 px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        Public Links
      </div>

      <Link
        href="/"
        target="_blank"
        className="group flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-all"
      >
        <div className="flex items-center space-x-3">
          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
          <span>Hospital Portal</span>
        </div>
      </Link>

      <Link
        href="/staff"
        target="_blank"
        className="group flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-all"
      >
        <div className="flex items-center space-x-3">
          <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
          <span>Public Staff Page</span>
        </div>
      </Link>
    </div>
  );

  return (
    <>
      {/* Mobile Topbar with Hamburger */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">Al Insaf Hospital</div>
            <div className="text-[10px] text-emerald-400 font-medium">Admin Control Panel</div>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 text-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Al Insaf General</div>
              <div className="text-[10px] text-emerald-400">Admin Panel</div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center px-3.5 py-2.5 bg-rose-600/15 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-xl border border-rose-500/30 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loggingOut ? 'Logging out...' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-slate-900 border-r border-slate-800 text-white min-h-screen sticky top-0 h-screen">
        {/* Header Branding */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-black text-white tracking-wide truncate">
                AL INSAF HOSPITAL
              </h2>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          <NavLinks />
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
          <div className="flex items-center space-x-3 px-1">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-200 truncate">Hospital Admin</div>
              <div className="text-[10px] text-slate-400 truncate">Super Admin Role</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center px-3 py-2 bg-rose-600/15 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-xl border border-rose-500/30 transition-all shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </aside>
    </>
  );
}
