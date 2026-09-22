'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Phone,
  Building2,
  Stethoscope,
  HeartPulse,
  Pill,
  Shield,
  Sparkles,
  Award,
  ChevronRight,
  Filter,
  UserCheck,
  CheckCircle2,
  BadgeCheck,
  BedDouble,
  Microscope,
  Trash2,
  Clock,
  X,
  ZoomIn,
  Calendar
} from 'lucide-react';
import { StaffRowSkeleton } from '@/components/ui/Skeleton';
import PageHeaderBanner from '@/components/layout/PageHeaderBanner';
import { INITIAL_STAFF } from '@/lib/seed-data';
import { Staff, StaffRole } from '@/lib/types';

// Exact serial order specified by the user
const ROLE_CATEGORIES = [
  {
    key: 'administrative',
    label: 'Administrative',
    icon: Building2,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    activeColor: 'bg-blue-600 text-white',
    desc: 'Hospital directors, administrative leads, accounts, and human resources.',
  },
  {
    key: 'doctor',
    label: 'Doctor',
    icon: Stethoscope,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    activeColor: 'bg-emerald-600 text-white',
    desc: 'Renowned professors, senior consultants, and clinical specialists from the doctors roster.',
  },
  {
    key: 'nurse',
    label: 'Nurse',
    icon: HeartPulse,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    activeColor: 'bg-rose-600 text-white',
    desc: 'Nursing superintendents, ICU/CCU nurses, and general inpatient caregivers.',
  },
  {
    key: 'pharmacist',
    label: 'Pharmacist',
    icon: Pill,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
    activeColor: 'bg-teal-600 text-white',
    desc: 'Licensed hospital pharmacists and clinical medication dispensers.',
  },
  {
    key: 'receptionist',
    label: 'Receptionist',
    icon: Users,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    activeColor: 'bg-purple-600 text-white',
    desc: 'Front desk executives, patient admission officers, and emergency triage staff.',
  },
  {
    key: 'security',
    label: 'Security',
    icon: Shield,
    color: 'text-slate-700 bg-slate-100 border-slate-300',
    activeColor: 'bg-slate-800 text-white',
    desc: 'Security officers, surveillance teams, and hospital campus safety guards.',
  },
  {
    key: 'wardboy',
    label: 'Ward Boy',
    icon: BedDouble,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    activeColor: 'bg-amber-600 text-white',
    desc: 'Ward attendants, patient transport assistants, and stretcher handlers.',
  },
  {
    key: 'technician',
    label: 'Technician',
    icon: Microscope,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    activeColor: 'bg-indigo-600 text-white',
    desc: 'Radiology, 128-slice CT/MRI technologist, and pathology lab technicians.',
  },
  {
    key: 'cleaner',
    label: 'Cleaner',
    icon: Sparkles,
    color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    activeColor: 'bg-cyan-700 text-white',
    desc: 'Sanitation supervisors, cabin hygiene staff, and infection control handlers.',
  },
];

export default function StaffDirectoryPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStaffForImage, setSelectedStaffForImage] = useState<Staff | null>(null);

  // Close image modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedStaffForImage(null);
      }
    };
    if (selectedStaffForImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStaffForImage]);

  // Fetch staff data
  useEffect(() => {
    async function loadStaff() {
      setLoading(true);
      try {
        const res = await fetch('/api/staff');
        const data = await res.json();
        if (data.success && data.staff && data.staff.length > 0) {
          setStaffList(data.staff);
        } else {
          // If database is empty, fallback to seed staff data
          setStaffList(INITIAL_STAFF as Staff[]);
        }
      } catch (err) {
        // If database connection crashes or network fails, fallback to seed data
        console.warn('Database error while loading staff, falling back to seed data:', err);
        setStaffList(INITIAL_STAFF as Staff[]);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, []);

  // Compute counts per role
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: staffList.length };
    ROLE_CATEGORIES.forEach((cat) => {
      counts[cat.key] = staffList.filter((s) => s.role === cat.key).length;
    });
    return counts;
  }, [staffList]);

  // Filtered staff list based on role & search query
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const matchesRole = selectedRole === 'all' || staff.role === selectedRole;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        staff.name?.toLowerCase().includes(query) ||
        staff.staffId?.toLowerCase().includes(query) ||
        staff.phone?.includes(query) ||
        staff.department?.toLowerCase().includes(query);
      return matchesRole && matchesQuery;
    });
  }, [staffList, selectedRole, searchQuery]);

  const activeCategoryObj = ROLE_CATEGORIES.find((c) => c.key === selectedRole);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Glossy Top Banner */}
      <PageHeaderBanner
        badge="Al Insaf Hospital Workforce"
        title="Staff & Medical Team Directory"
        description="Meet our dedicated team of administrators, medical specialists, nurses, pharmacists, and support personnel who make 24/7 patient care possible."
      >
        <div className="flex justify-center items-center space-x-2 text-xs text-slate-300 pt-2">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/about-us" className="hover:text-white transition-colors">
            About Us
          </Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">Staff Directory</span>
        </div>
      </PageHeaderBanner>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Role Categories (In Exact Serial Order) */}
          <aside className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Role Categories
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {staffList.length} Total
              </span>
            </div>

            {/* All Staff Option */}
            <button
              onClick={() => setSelectedRole('all')}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                selectedRole === 'all'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  selectedRole === 'all' ? 'bg-white/20 text-white' : 'bg-white text-emerald-600 shadow-sm'
                }`}>
                  <Users className="w-4 h-4" />
                </div>
                <span>All Hospital Staff</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                selectedRole === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {roleCounts.all || 0}
              </span>
            </button>

            {/* Serial Role Categories */}
            <div className="space-y-1.5 pt-1">
              {ROLE_CATEGORIES.map((cat, idx) => {
                const IconComponent = cat.icon;
                const isSelected = selectedRole === cat.key;
                const count = roleCounts[cat.key] || 0;

                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedRole(cat.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                      isSelected
                        ? `${cat.activeColor} shadow-md`
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`text-[11px] font-mono font-bold w-4 text-center ${
                        isSelected ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        {idx + 1}.
                      </span>
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/20 text-white' : cat.color
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-left font-semibold">{cat.label}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Row-wise Staff List & Search */}
          <main className="lg:col-span-8 space-y-6">
            {/* Search & Header Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                    <span>
                      {selectedRole === 'all' ? 'All Hospital Staff' : activeCategoryObj?.label}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {filteredStaff.length} Members
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedRole === 'all'
                      ? 'Displaying full hospital directory across medical, administrative, and operations.'
                      : activeCategoryObj?.desc}
                  </p>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Name, Staff ID, Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <StaffRowSkeleton count={6} />
            ) : filteredStaff.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">No staff members found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No records match your selected role and search filter. Try clearing the search query or selecting &apos;All Staff&apos;.
                </p>
                <button
                  onClick={() => {
                    setSelectedRole('all');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Row-wise Staff Records */
              <div className="space-y-3">
                {filteredStaff.map((staff, idx) => {
                  const roleObj = ROLE_CATEGORIES.find((r) => r.key === staff.role);

                  return (
                    <div
                      key={staff._id || staff.staffId || idx}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      {/* Left: Image, Staff ID, Name, Role */}
                      <div className="flex items-center space-x-4">
                        {/* Profile Image (Clickable for Pop-up) */}
                        <div
                          onClick={() => setSelectedStaffForImage(staff)}
                          className="relative flex-shrink-0 cursor-pointer group/avatar"
                          title="Click to view full photo"
                        >
                          <img
                            src={
                              staff.imageUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                            }
                            alt={staff.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm group-hover/avatar:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white">
                            <ZoomIn className="w-4 h-4 drop-shadow" />
                            <span className="text-[8px] font-bold mt-0.5">Enlarge</span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white" title="Verified Staff">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {/* Staff ID */}
                            <span className="font-mono text-[11px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {staff.staffId}
                            </span>
                            {/* Role Badge */}
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                                roleObj?.color || 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {roleObj?.label || staff.role}
                            </span>
                          </div>

                          {/* Name */}
                          <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {staff.name}
                          </h3>

                          {/* Designation / Department */}
                          <p className="text-xs text-slate-500 font-medium">
                            {staff.designation ? `${staff.designation} • ` : ''}
                            {staff.department || 'Al Insaf General Hospital'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Phone Number Action & Quick Serial Info */}
                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {staff.phone && (
                          <a
                            href={`tel:${staff.phone.replace(/[^0-9+]/g, '')}`}
                            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-all shadow-sm"
                            title={`Call ${staff.name}`}
                          >
                            <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                            <span>{staff.phone}</span>
                          </a>
                        )}

                        {staff.role === 'doctor' && (
                          <Link
                            href="/appointments"
                            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                          >
                            <span>Book Serial</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Staff / Doctor Photo Pop-up Modal */}
      {selectedStaffForImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all"
          onClick={() => setSelectedStaffForImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 space-y-0 transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedStaffForImage.role}
                </span>
                <span className="text-xs text-slate-300">Staff Photo Preview</span>
              </div>
              <button
                onClick={() => setSelectedStaffForImage(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Image Showcase */}
            <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-6">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                <img
                  src={
                    selectedStaffForImage.imageUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                  }
                  alt={selectedStaffForImage.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Staff Info & Action Footer */}
            <div className="p-5 space-y-4 bg-white">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-slate-900">
                  {selectedStaffForImage.name}
                </h3>
                <div className="text-xs font-mono font-bold text-emerald-700">
                  ID: {selectedStaffForImage.staffId}
                </div>
                <p className="text-xs font-medium text-slate-600">
                  {selectedStaffForImage.designation ? `${selectedStaffForImage.designation} • ` : ''}
                  {selectedStaffForImage.department || 'Al Insaf General Hospital'}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">{selectedStaffForImage.phone}</span>
                </div>
                <a
                  href={`tel:${selectedStaffForImage.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Call Now
                </a>
              </div>

              {selectedStaffForImage.role === 'doctor' && (
                <Link
                  href={`/appointments?doctor=${encodeURIComponent(selectedStaffForImage.name)}`}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow transition-all text-center flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Doctor Appointment</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setSelectedStaffForImage(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors text-center"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
