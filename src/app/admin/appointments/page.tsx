'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  User,
  Printer
} from 'lucide-react';
import { TableSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { Appointment } from '@/lib/types';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
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
      console.error('Failed to update appointment status', error);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      apt.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Appointment Management</h1>
              <p className="text-xs text-slate-500">View, confirm, and update patient doctor serials</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl shadow-sm hover:bg-slate-50"
            >
              <Printer className="w-4 h-4 mr-1.5 text-primary-600" />
              Print Schedule
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Tracking ID, patient name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-6">Tracking ID</th>
                  <th className="py-3.5 px-6">Patient Info</th>
                  <th className="py-3.5 px-6">Doctor & Wing</th>
                  <th className="py-3.5 px-6">Date & Slot</th>
                  <th className="py-3.5 px-6">Symptoms</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-36 mb-1" /><Skeleton className="h-3 w-24" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-20" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-28" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-8 w-20 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No appointments matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="py-4 px-6 font-mono font-bold text-primary-700">
                        {apt.trackingId}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{apt.patientName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center mt-0.5">
                          <Phone className="w-3 h-3 mr-1 text-slate-400" />
                          {apt.patientPhone}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {apt.patientAge} Yrs • {apt.patientGender}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{apt.doctorName}</div>
                        <div className="text-[11px] text-slate-500">{apt.department}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-800">{apt.appointmentDate}</div>
                        <div className="text-[11px] text-slate-500">{apt.preferredTimeSlot}</div>
                      </td>
                      <td className="py-4 px-6 max-w-[180px] truncate text-slate-600">
                        {apt.symptoms || 'General Consultation'}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : apt.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusChange(apt._id || apt.trackingId, 'Confirmed')}
                          title="Confirm"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt._id || apt.trackingId, 'Completed')}
                          title="Complete"
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-sm"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt._id || apt.trackingId, 'Cancelled')}
                          title="Cancel"
                          className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[11px] rounded-lg"
                        >
                          Cancel
                        </button>
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
