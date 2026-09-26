'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Users,
  MessageSquare,
  Activity,
  Database,
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  PlusCircle,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Server,
  CheckCircle2,
  Contact
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Appointment, Inquiry, Doctor } from '@/lib/types';

interface DbStatus {
  connected: boolean;
  database: string;
  uriMasked: string;
  counts?: {
    users: number;
    doctors: number;
    appointments: number;
    inquiries: number;
  };
  error?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [doctorsCount, setDoctorsCount] = useState<number>(0);
  const [staffCount, setStaffCount] = useState<number>(0);
  const [ratesCount, setRatesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [checkingDb, setCheckingDb] = useState(false);

  const fetchDbStatus = async () => {
    setCheckingDb(true);
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch (err: any) {
      setDbStatus({
        connected: false,
        database: 'al_insaf_hospital',
        uriMasked: 'mongodb://127.0.0.1:27017',
        error: err.message || 'Network error checking MongoDB',
      });
    } finally {
      setCheckingDb(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    fetchDbStatus();
    try {
      // 1. Fetch appointments
      const appRes = await fetch('/api/appointments');
      if (appRes.ok) {
        const data = await appRes.json();
        setAppointments(data.appointments || []);
      }

      // 2. Fetch inquiries
      const inqRes = await fetch('/api/inquiries');
      if (inqRes.ok) {
        const inqData = await inqRes.json();
        setInquiries(inqData.inquiries || []);
      }

      // 3. Fetch doctors
      const docRes = await fetch('/api/doctors');
      if (docRes.ok) {
        const docData = await docRes.json();
        setDoctorsCount(docData.doctors ? docData.doctors.length : 12);
      }

      // 4. Fetch staff
      const staffRes = await fetch('/api/staff?role=all');
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStaffCount(staffData.count || (staffData.staff ? staffData.staff.length : 0));
      }

      // 5. Fetch rates & tariffs
      const rateRes = await fetch('/api/rates');
      if (rateRes.ok) {
        const rateData = await rateRes.json();
        setRatesCount(rateData.rates ? rateData.rates.length : 0);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id || a.trackingId === id ? { ...a, status: newStatus as any } : a))
        );
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedMessage('');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      setSeedMessage(data.message || 'Database seeded successfully.');
      fetchData();
    } catch (err: any) {
      setSeedMessage(err.message || 'Failed to seed database.');
    } finally {
      setSeeding(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const pendingAppointments = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed').length;

  return (
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Artistic Hospital Medical Pattern Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="hospital-ambient-grid" width="160" height="160" patternUnits="userSpaceOnUse">
              {/* Medical Cross */}
              <path d="M70 50 h20 v20 h20 v20 h-20 v20 h-20 v-20 h-20 v-20 h20 z" fill="#0284c7" />
              {/* Heartbeat ECG pulse wave */}
              <path d="M0 80 h30 l8 -25 l12 50 l12 -50 l8 25 h90" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Stethoscope / Ring Circle Accents */}
              <circle cx="20" cy="20" r="4" fill="#0d9488" />
              <circle cx="140" cy="140" r="4" fill="#0284c7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hospital-ambient-grid)" />
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Dashboard Top Header with Hospital Crest Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Subtle medical watermark in banner */}
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-end pr-6">
            <svg viewBox="0 0 200 200" className="w-64 h-64 text-white" fill="currentColor">
              <path d="M80 20 h40 v60 h60 v40 h-60 v60 h-40 v-60 h-60 v-40 h60 z" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Al Insaf General Hospital (Pvt.) • Dewanganj</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Hospital Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Real-time operational dashboard for doctors roster, OPD appointments, HR staff, tariffs, and patient communications
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="inline-flex items-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Database className="w-3.5 h-3.5 mr-1.5" />
                {seeding ? 'Syncing...' : 'Sync/Seed DB'}
              </button>
            </div>
          </div>
        </div>

        {seedMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center justify-between">
            <span>{seedMessage}</span>
            <button onClick={() => setSeedMessage('')} className="text-slate-400 hover:text-slate-600 text-xs">Dismiss</button>
          </div>
        )}

        {/* MongoDB Live Diagnostics Banner */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                dbStatus?.connected ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">Database Connection Status</h3>
                  {dbStatus ? (
                    dbStatus.connected ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Connected (Live)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Disconnected / Offline
                      </span>
                    )
                  ) : (
                    <span className="text-[11px] text-slate-400">Checking...</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Target: {dbStatus?.database || 'al_insaf_hospital'} ({dbStatus?.uriMasked || 'mongodb://127.0.0.1:27017'})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={fetchDbStatus}
                disabled={checkingDb}
                className="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${checkingDb ? 'animate-spin' : ''}`} />
                {checkingDb ? 'Testing...' : 'Test Connection'}
              </button>
              {dbStatus?.connected && (
                <button
                  onClick={handleSeedDatabase}
                  disabled={seeding}
                  className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <Database className="w-3.5 h-3.5 mr-1.5" />
                  {seeding ? 'Syncing...' : 'Sync/Seed DB'}
                </button>
              )}
            </div>
          </div>

          {dbStatus && !dbStatus.connected && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>MongoDB সংযোগ পাওয়া যায়নি (MongoDB Server Not Detected)</span>
              </div>
              <p className="text-amber-800">
                আপনার কম্পিউটারে MongoDB Community Server চালু থাকতে হবে। MongoDB Compass শুধুমাত্র একটি ভিউয়ার (GUI client), এটি ব্যাকগ্রাউন্ড ডাটাবেজ সার্ভিস চালু করে না।
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-300/50 space-y-1">
                  <div className="font-bold text-slate-800">পদ্ধতি ১: লোকাল MongoDB সার্ভিস চালু করুন (Mac)</div>
                  <code className="block bg-slate-900 text-emerald-400 p-2 rounded text-[11px] font-mono">
                    brew services start mongodb-community
                  </code>
                  <div className="text-[11px] text-slate-500">অথবা টার্মিনালে <span className="font-mono font-bold text-slate-700">mongod</span> কমান্ড রান করুন।</div>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-300/50 space-y-1">
                  <div className="font-bold text-slate-800">পদ্ধতি ২: ফ্রি MongoDB Atlas ক্লাউড ডাটাবেজ</div>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-mono text-emerald-700 font-bold">.env.local</span> ফাইলে আপনার Atlas সংযোগ লিংক বসান:
                  </div>
                  <code className="block bg-slate-900 text-emerald-400 p-1.5 rounded text-[10px] font-mono truncate">
                    MONGODB_URI=mongodb+srv://user:pass@cluster0...
                  </code>
                </div>
              </div>
            </div>
          )}

          {dbStatus && dbStatus.connected && dbStatus.counts && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-500 font-medium">Admin Users</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{dbStatus.counts.users}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-500 font-medium">Doctors in DB</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{dbStatus.counts.doctors}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-500 font-medium">Appointments</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{dbStatus.counts.appointments}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-center flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-500 font-medium">Inquiries</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{dbStatus.counts.inquiries}</div>
              </div>
            </div>
          )}
        </div>

        {/* Metric Cards with Centered Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/appointments"
            className="group relative bg-white overflow-hidden p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Serials</span>
            <div className="text-3xl font-black text-slate-900 tracking-tight my-0.5">{appointments.length}</div>
            <p className="text-[10px] text-slate-400 font-medium">Patient bookings</p>
          </Link>

          <Link
            href="/admin/appointments"
            className="group relative bg-white overflow-hidden p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1">Pending</span>
            <div className="text-3xl font-black text-amber-600 tracking-tight my-0.5">{pendingAppointments}</div>
            <p className="text-[10px] text-slate-400 font-medium">Awaiting review</p>
          </Link>

          <Link
            href="/admin/doctors"
            className="group relative bg-white overflow-hidden p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Doctors</span>
            <div className="text-3xl font-black text-slate-900 tracking-tight my-0.5">{doctorsCount || 10}</div>
            <p className="text-[10px] text-slate-400 font-medium">Consultants roster</p>
          </Link>

          <Link
            href="/admin/staff"
            className="group relative bg-white overflow-hidden p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Contact className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 mb-1">Staff</span>
            <div className="text-3xl font-black text-slate-900 tracking-tight my-0.5">{staffCount || 10}</div>
            <p className="text-[10px] text-slate-400 font-medium">9 HR categories</p>
          </Link>

          <Link
            href="/admin/rates"
            className="group relative bg-white overflow-hidden p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 mb-1">Tariff & Rates</span>
            <div className="text-3xl font-black text-slate-900 tracking-tight my-0.5">{ratesCount || 17}</div>
            <p className="text-[10px] text-slate-400 font-medium">Tests & cabin fees</p>
          </Link>

          <Link
            href="/admin/inquiries"
            className={`group relative overflow-hidden p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center ${
              inquiries.filter((i) => i.status === 'Unread').length > 0
                ? 'bg-rose-50/50 border-rose-300 hover:border-rose-500'
                : 'bg-white border-slate-200 hover:border-blue-500'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform ${
              inquiries.filter((i) => i.status === 'Unread').length > 0
                ? 'bg-rose-100 text-rose-600'
                : 'bg-blue-50 text-blue-600'
            }`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
              inquiries.filter((i) => i.status === 'Unread').length > 0 ? 'text-rose-600' : 'text-blue-600'
            }`}>
              Inquiries
            </span>
            <div className="flex items-center justify-center space-x-1.5 my-0.5">
              <div className="text-3xl font-black text-slate-900 tracking-tight">{inquiries.length}</div>
              {inquiries.filter((i) => i.status === 'Unread').length > 0 && (
                <span className="text-[10px] font-extrabold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full">
                  {inquiries.filter((i) => i.status === 'Unread').length} new
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Patient messages</p>
          </Link>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/inquiries"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-500 hover:shadow-md transition-all flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Patient Inquiries</h4>
              <p className="text-[10px] text-slate-500 truncate">Email replies & queries</p>
            </div>
          </Link>

          <Link
            href="/admin/appointments"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-500 hover:shadow-md transition-all flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Appointments</h4>
              <p className="text-[10px] text-slate-500 truncate">Serials & schedule</p>
            </div>
          </Link>

          <Link
            href="/admin/staff"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Contact className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Staff Directory</h4>
              <p className="text-[10px] text-slate-500 truncate">9 role categories & HR</p>
            </div>
          </Link>

          <Link
            href="/admin/doctors"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Doctors List</h4>
              <p className="text-[10px] text-slate-500 truncate">OPD hours & fees</p>
            </div>
          </Link>

          <Link
            href="/admin/rates"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-500 hover:shadow-md transition-all flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Tariffs & Rates</h4>
              <p className="text-[10px] text-slate-500 truncate">Cabin & test charges</p>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-500 hover:shadow-md transition-all flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Admin Accounts</h4>
              <p className="text-[10px] text-slate-500 truncate">User access control</p>
            </div>
          </Link>
        </div>

        {/* Recent Appointments Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Patient Appointments</h3>
              <p className="text-xs text-slate-500">Latest online serial bookings submitted by patients</p>
            </div>
            <button
              onClick={fetchData}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-lg"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Patient Name & Phone</th>
                  <th className="py-3 px-4">Doctor & Department</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-36" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-28" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      <td className="py-3.5 px-4 text-right"><Skeleton className="h-7 w-16 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No appointments received yet.
                    </td>
                  </tr>
                ) : (
                  appointments.slice(0, 10).map((apt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-primary-700">
                        {apt.trackingId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{apt.patientName}</div>
                        <div className="text-[11px] text-slate-500">{apt.patientPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                        <div className="text-[11px] text-slate-500">{apt.department}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{apt.appointmentDate}</div>
                        <div className="text-[11px] text-slate-500">{apt.preferredTimeSlot}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {apt.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(apt._id || apt.trackingId, 'Confirmed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(apt._id || apt.trackingId, 'Cancelled')}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[11px] rounded-lg"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
