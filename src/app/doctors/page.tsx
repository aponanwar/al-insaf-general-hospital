'use client';

import { Suspense, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Filter,
  CheckCircle2,
  Phone,
  UserCheck
} from 'lucide-react';
import { INITIAL_DOCTORS, INITIAL_DEPARTMENTS } from '@/lib/seed-data';

const DAYS = ['All Days', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function DoctorsContent() {
  const searchParams = useSearchParams();
  const initialDept = searchParams?.get('department') || 'All Departments';
  const initialQuery = searchParams?.get('q') || '';

  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [selectedDay, setSelectedDay] = useState('All Days');
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const departments = ['All Departments', ...INITIAL_DEPARTMENTS.map((d) => d.name)];
  const doctors = INITIAL_DOCTORS;

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Department filter
      const matchesDept =
        selectedDept === 'All Departments' ||
        doc.department.toLowerCase() === selectedDept.toLowerCase() ||
        doc.department.includes(selectedDept);

      // Day filter
      const matchesDay =
        selectedDay === 'All Days' ||
        doc.visitingDays.some((d) => d.toLowerCase() === selectedDay.toLowerCase());

      // Search Query filter
      const matchesQuery =
        searchQuery === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualifications.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDept && matchesDay && matchesQuery;
    });
  }, [doctors, selectedDept, selectedDay, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <Filter className="w-4 h-4 text-primary-600" />
                <span>Filter Directory</span>
              </div>
              {(selectedDept !== 'All Departments' || selectedDay !== 'All Days' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSelectedDept('All Departments');
                    setSelectedDay('All Days');
                    setSearchQuery('');
                  }}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Department Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Specialty / Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Day of Week Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Visiting Day
              </label>
              <div className="space-y-1">
                {DAYS.map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedDay === day
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{day}</span>
                    {selectedDay === day && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Need Help Box */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 space-y-2">
              <div className="font-bold flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                Need Help Finding a Doctor?
              </div>
              <p className="text-[11px] text-emerald-800">
                Call our 24/7 OPD desk at <span className="font-bold">09666 787800</span> for serial and timing confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-800">
              Found <span className="text-primary-600">{filteredDoctors.length}</span> Specialist Doctors
            </span>
            <span className="text-xs text-slate-500">
              Sorted by Seniority & Department
            </span>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No doctors found matching filters</h3>
              <p className="text-xs text-slate-500">
                Try clearing your search query or selecting &quot;All Departments&quot;.
              </p>
              <button
                onClick={() => {
                  setSelectedDept('All Departments');
                  setSelectedDay('All Days');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow"
              >
                Show All Doctors
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDoctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Avatar & Designation */}
                    <div className="flex items-start space-x-4">
                      <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-500 shadow-md flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
                          {doc.department}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                          {doc.name}
                        </h3>
                        <p className="text-xs font-semibold text-emerald-700">{doc.designation}</p>
                      </div>
                    </div>

                    {/* Qualifications & Specialty */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-xs text-slate-700 font-medium leading-snug">
                        {doc.qualifications}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        Speciality: <span className="font-semibold text-slate-700">{doc.specialty}</span>
                      </p>
                    </div>

                    {/* Schedule & Room */}
                    <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 text-primary-600 mr-2 flex-shrink-0" />
                        <span>Hours: <strong className="text-slate-900">{doc.visitingHours}</strong></span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-primary-600 mr-2 flex-shrink-0" />
                        <span>Chamber: <strong className="text-slate-900">{doc.roomNumber}</strong></span>
                      </div>
                    </div>

                    {/* Visiting Days Pills */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {doc.visitingDays.map((day, dIdx) => (
                        <span
                          key={dIdx}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Consultation</div>
                      <div className="text-sm font-black text-slate-900">৳{doc.consultationFee}</div>
                    </div>

                    <Link
                      href={`/appointments?doctor=${encodeURIComponent(doc.name)}&department=${encodeURIComponent(doc.department)}`}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow transition-all hover:scale-105"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DoctorsDirectoryPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="bg-[#384349] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Expert Medical Faculty
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-3">
            Find Our Specialist Doctors
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
            Consult with over 200+ renowned professors, senior consultants, and surgeons in Dhaka.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Doctor Directory...</div>}>
        <DoctorsContent />
      </Suspense>
    </div>
  );
}
