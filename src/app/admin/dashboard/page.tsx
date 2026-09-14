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
  CheckCircle2
} from 'lucide-react';
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
    <div className="bg-slate-100 min-h-screen">
      {/* Top Admin Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Al Insaf General Hospital CMS</h1>
              <p className="text-[11px] text-slate-400">Master Administrative Panel</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
            >
              <Database className="w-3.5 h-3.5 mr-1.5" />
              {seeding ? 'Seeding MongoDB...' : 'Seed Initial Data'}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-lg border border-rose-500/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {seedMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center justify-between">
            <span>{seedMessage}</span>
            <button onClick={() => setSeedMessage('')} className="text-slate-400 hover:text-slate-600 text-xs">Dismiss</button>
          </div>
        )}

        {/* MongoDB Live Diagnostics Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
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
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[11px] text-slate-500 font-medium">Admin Users</span>
                <div className="text-base font-bold text-slate-900">{dbStatus.counts.users}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[11px] text-slate-500 font-medium">Doctors in DB</span>
                <div className="text-base font-bold text-slate-900">{dbStatus.counts.doctors}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[11px] text-slate-500 font-medium">Appointments</span>
                <div className="text-base font-bold text-slate-900">{dbStatus.counts.appointments}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-[11px] text-slate-500 font-medium">Inquiries</span>
                <div className="text-base font-bold text-slate-900">{dbStatus.counts.inquiries}</div>
              </div>
            </div>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Total Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{appointments.length}</div>
            <p className="text-xs text-slate-500">All registered patient serials</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-500">Pending Review</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600">{pendingAppointments}</div>
            <p className="text-xs text-slate-500">Awaiting confirmation</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-500">Active Doctors</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{doctorsCount || 12}</div>
            <p className="text-xs text-slate-500">Professors & Consultants</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-blue-500">Patient Queries</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{inquiries.length}</div>
            <p className="text-xs text-slate-500">Online inquiry submissions</p>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/admin/appointments"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-500 hover:shadow-md transition-all flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Manage Appointments</h4>
              <p className="text-xs text-slate-500">Filter, confirm, or reschedule bookings</p>
            </div>
          </Link>

          <Link
            href="/admin/doctors"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-500 hover:shadow-md transition-all flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Add & Edit Doctors</h4>
              <p className="text-xs text-slate-500">Upload photos & update OPD visiting hours</p>
            </div>
          </Link>

          <Link
            href="/patient-guide/rates"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-500 hover:shadow-md transition-all flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Hospital Tariff Rates</h4>
              <p className="text-xs text-slate-500">View diagnostic & cabin price list</p>
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
                {appointments.length === 0 ? (
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
