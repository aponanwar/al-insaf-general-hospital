'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Printer,
  FileSpreadsheet,
  Download,
  Stethoscope,
  Building2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Appointment, Doctor } from '@/lib/types';
import { INITIAL_DOCTORS } from '@/lib/seed-data';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const [appRes, docRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/doctors')
      ]);

      if (appRes.ok) {
        const data = await appRes.json();
        setAppointments(data.appointments || []);
      }

      if (docRes.ok) {
        const docData = await docRes.json();
        if (docData.doctors && docData.doctors.length > 0) {
          setDoctorsList(docData.doctors);
        }
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoading(id);
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
    } finally {
      setActionLoading(null);
    }
  };

  // Compile full unique list of doctors from DB and appointments
  const allUniqueDoctors = useMemo(() => {
    const map = new Map<string, { name: string; department?: string; room?: string; hours?: string; fee?: number; phone?: string }>();
    
    // Seed doctors
    doctorsList.forEach((d) => {
      map.set(d.name, {
        name: d.name,
        department: d.department,
        room: d.roomNumber,
        hours: d.visitingHours,
        fee: d.consultationFee,
        phone: d.phone || '01303-359905'
      });
    });

    // Doctors from actual appointments
    appointments.forEach((a) => {
      if (a.doctorName && !map.has(a.doctorName)) {
        map.set(a.doctorName, {
          name: a.doctorName,
          department: a.department,
          phone: '01303-359905'
        });
      }
    });

    return Array.from(map.values());
  }, [doctorsList, appointments]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
      const matchesDoctor = selectedDoctor === 'All' || apt.doctorName === selectedDoctor;
      const matchesDate = !selectedDate || apt.appointmentDate === selectedDate;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        apt.trackingId.toLowerCase().includes(q) ||
        apt.patientName.toLowerCase().includes(q) ||
        apt.patientPhone.includes(q) ||
        apt.doctorName.toLowerCase().includes(q) ||
        (apt.department && apt.department.toLowerCase().includes(q)) ||
        (apt.symptoms && apt.symptoms.toLowerCase().includes(q));

      return matchesStatus && matchesDoctor && matchesDate && matchesSearch;
    });
  }, [appointments, statusFilter, selectedDoctor, selectedDate, searchQuery]);

  // Selected Doctor Summary
  const selectedDoctorDetails = useMemo(() => {
    if (selectedDoctor === 'All') return null;
    return allUniqueDoctors.find((d) => d.name === selectedDoctor) || null;
  }, [selectedDoctor, allUniqueDoctors]);

  // Doctor Specific Statistics
  const doctorStats = useMemo(() => {
    const list = selectedDoctor === 'All' 
      ? appointments 
      : appointments.filter((a) => a.doctorName === selectedDoctor);

    return {
      total: list.length,
      pending: list.filter((a) => a.status === 'Pending').length,
      confirmed: list.filter((a) => a.status === 'Confirmed').length,
      completed: list.filter((a) => a.status === 'Completed').length,
      cancelled: list.filter((a) => a.status === 'Cancelled').length,
    };
  }, [appointments, selectedDoctor]);

  // Excel / CSV Export with UTF-8 BOM
  const exportToExcel = () => {
    if (filteredAppointments.length === 0) {
      alert('No appointments found for the selected filter to export.');
      return;
    }

    const headers = [
      'Sl No',
      'Tracking ID',
      'Patient Name',
      'Contact Phone',
      'Age',
      'Gender',
      'Doctor Name',
      'Department',
      'Appointment Date',
      'Time Slot',
      'Symptoms / Remarks',
      'Status',
      'Booked At'
    ];

    const rows = filteredAppointments.map((apt, index) => [
      index + 1,
      `"${apt.trackingId}"`,
      `"${apt.patientName.replace(/"/g, '""')}"`,
      `="${apt.patientPhone}"`, // Formatted as text in Excel
      apt.patientAge || 'N/A',
      apt.patientGender || 'N/A',
      `"${apt.doctorName.replace(/"/g, '""')}"`,
      `"${(apt.department || '').replace(/"/g, '""')}"`,
      `"${apt.appointmentDate}"`,
      `"${apt.preferredTimeSlot}"`,
      `"${(apt.symptoms || '').replace(/"/g, '""')}"`,
      apt.status,
      apt.createdAt ? new Date(apt.createdAt).toLocaleString() : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\r\n');

    // UTF-8 BOM for Microsoft Excel character encoding compatibility
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const docPrefix = selectedDoctor !== 'All' ? selectedDoctor.replace(/[^a-zA-Z0-9]/g, '_') : 'All_Doctors';
    const datePrefix = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `AlInsaf_Appointments_${docPrefix}_${datePrefix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // PDF / Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6 sm:py-8 print:bg-white print:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 print:px-0 print:space-y-4">
        
        {/* Print Only Official Hospital Header Banner */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                আল-ইনসাফ জেনারেল হাসপাতাল (প্রাঃ)
              </h1>
              <h2 className="text-sm font-bold text-slate-700">
                Al Insaf General Hospital (Pvt.) • Dewanganj, Jamalpur
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Govt. High School Gate, Dewanganj Bazar • 24/7 Hotline: 01303-359905, 01913-129020
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded inline-block">
                OPD SERIAL REPORT
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Printed: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-slate-900">Doctor Filter: </span>
              <span className="font-semibold text-primary-900">{selectedDoctor === 'All' ? 'All Registered Doctors' : selectedDoctor}</span>
              {selectedDoctorDetails?.department && (
                <span className="text-slate-600"> ({selectedDoctorDetails.department})</span>
              )}
            </div>
            <div>
              <span className="font-bold text-slate-900">Total Serials Listed: </span>
              <span className="font-bold text-slate-900">{filteredAppointments.length}</span>
            </div>
          </div>
        </div>

        {/* Top Header & Export Action Controls (Screen Only) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/dashboard"
              className="p-2.5 bg-white rounded-2xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-0.5">
                <Link href="/admin/dashboard" className="hover:text-primary-600">Admin Dashboard</Link>
                <span>/</span>
                <span className="text-slate-800 font-bold">Appointment Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Doctor Appointments & Serials
              </h1>
              <p className="text-xs text-slate-500">
                Filter per doctor, confirm serial bookings, export to Excel & print PDF schedule
              </p>
            </div>
          </div>

          {/* Export & Refresh Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchAppointments}
              disabled={loading}
              className="inline-flex items-center px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 shadow-xs transition-colors"
              title="Refresh Appointments"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all"
              title="Download appointments as Excel (.csv)"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md shadow-slate-900/20 transition-all"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Doctor-wise Selector & Overview Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5 print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Stethoscope className="w-4 h-4 text-primary-600" />
                <span>Select Doctor / Consultant:</span>
              </label>
              <p className="text-xs text-slate-500">
                Separate and manage appointment serials specifically for individual doctors
              </p>
            </div>

            <div className="relative w-full lg:w-96">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 hover:bg-slate-100/80 border-2 border-primary-500/30 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="All">🏥 All Doctors ({appointments.length} Total Serials)</option>
                {allUniqueDoctors.map((doc, idx) => {
                  const count = appointments.filter((a) => a.doctorName === doc.name).length;
                  return (
                    <option key={idx} value={doc.name}>
                      👨‍⚕️ {doc.name} ({count} serials)
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Doctor Info & Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
            <div className="bg-primary-50/70 border border-primary-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-primary-800 uppercase tracking-wider">Total Serials</span>
              <div className="text-2xl font-black text-primary-950 mt-0.5">{doctorStats.total}</div>
              <span className="text-[10px] text-primary-600">
                {selectedDoctor === 'All' ? 'All hospital bookings' : 'For this doctor'}
              </span>
            </div>

            <div className="bg-amber-50/70 border border-amber-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending</span>
              <div className="text-2xl font-black text-amber-700 mt-0.5">{doctorStats.pending}</div>
              <span className="text-[10px] text-amber-600">Awaiting confirmation</span>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Confirmed</span>
              <div className="text-2xl font-black text-emerald-700 mt-0.5">{doctorStats.confirmed}</div>
              <span className="text-[10px] text-emerald-600">Ready for visit</span>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Completed</span>
              <div className="text-2xl font-black text-blue-700 mt-0.5">{doctorStats.completed}</div>
              <span className="text-[10px] text-blue-600">Visited chamber</span>
            </div>

            <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col justify-center">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Chamber Info</span>
              <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
                {selectedDoctorDetails?.room || 'OPD Chamber'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {selectedDoctorDetails?.hours || '03:00 PM - 07:00 PM'}
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 justify-between items-center print:hidden">
          <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, phone, tracking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-1.5">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="p-2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                  title="Clear Date Filter"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 w-full lg:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse print:text-[10px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 print:bg-slate-200 print:text-slate-900 print:text-[10px]">
                  <th className="py-3.5 px-4 sm:px-6">Sl</th>
                  <th className="py-3.5 px-4 sm:px-6">Tracking ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Patient Info</th>
                  <th className="py-3.5 px-4 sm:px-6">Doctor & Department</th>
                  <th className="py-3.5 px-4 sm:px-6">Date & Slot</th>
                  <th className="py-3.5 px-4 sm:px-6">Symptoms</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs print:divide-slate-300">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-6" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-36 mb-1" /><Skeleton className="h-3 w-24" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-20" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-28" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      <td className="py-4 px-6 text-right print:hidden"><Skeleton className="h-8 w-20 ml-auto rounded-lg" /></td>
                    </tr>
                  ))
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No appointments found matching the selected doctor and filter.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt, idx) => (
                    <tr key={apt._id || apt.trackingId || idx} className="hover:bg-slate-50/80 print:hover:bg-transparent">
                      <td className="py-4 px-4 sm:px-6 text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-primary-700">
                        {apt.trackingId}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-slate-900">{apt.patientName}</div>
                        <div className="text-[11px] text-slate-600 font-medium flex items-center mt-0.5">
                          <Phone className="w-3 h-3 mr-1 text-emerald-600 shrink-0" />
                          <a href={`tel:${apt.patientPhone}`} className="hover:text-primary-600 font-mono">
                            {apt.patientPhone}
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {apt.patientAge} Yrs • {apt.patientGender} {apt.patientAddress ? `• ${apt.patientAddress}` : ''}
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-semibold text-slate-900">{apt.doctorName}</div>
                        <div className="text-[11px] text-slate-500">{apt.department}</div>
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-medium text-slate-800">{apt.appointmentDate}</div>
                        <div className="text-[11px] text-slate-500">{apt.preferredTimeSlot}</div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 max-w-[180px] truncate text-slate-600" title={apt.symptoms}>
                        {apt.symptoms || 'General Consultation'}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800 print:border print:border-emerald-500'
                              : apt.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800 print:border print:border-blue-500'
                              : apt.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 print:border print:border-rose-500'
                              : 'bg-amber-100 text-amber-800 print:border print:border-amber-500'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right space-x-1.5 whitespace-nowrap print:hidden">
                        {apt.status !== 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(apt._id || apt.trackingId, 'Confirmed')}
                            disabled={actionLoading === (apt._id || apt.trackingId)}
                            title="Confirm serial"
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status !== 'Completed' && (
                          <button
                            onClick={() => handleStatusChange(apt._id || apt.trackingId, 'Completed')}
                            disabled={actionLoading === (apt._id || apt.trackingId)}
                            title="Mark as completed"
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors disabled:opacity-50"
                          >
                            Complete
                          </button>
                        )}
                        {apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(apt._id || apt.trackingId, 'Cancelled')}
                            disabled={actionLoading === (apt._id || apt.trackingId)}
                            title="Cancel serial"
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[11px] rounded-lg transition-colors disabled:opacity-50"
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

        {/* Print Only Signatures Footer */}
        <div className="hidden print:flex justify-between items-end pt-16 mt-12 border-t border-slate-300 text-xs">
          <div className="text-center">
            <div className="w-48 border-t border-slate-600 mb-1"></div>
            <p className="font-bold text-slate-800">OPD Receptionist / Manager</p>
            <p className="text-[10px] text-slate-500">Al Insaf General Hospital</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-t border-slate-600 mb-1"></div>
            <p className="font-bold text-slate-800">Doctor / Consultant Signature</p>
            <p className="text-[10px] text-slate-500">{selectedDoctor === 'All' ? 'Consultant on Duty' : selectedDoctor}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
