'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
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
  UserCheck,
  X,
  ZoomIn,
  Sparkles
} from 'lucide-react';
import { DoctorCardSkeleton } from '@/components/ui/Skeleton';
import PageHeaderBanner from '@/components/layout/PageHeaderBanner';
import { INITIAL_DOCTORS, INITIAL_DEPARTMENTS } from '@/lib/seed-data';
import { Doctor } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

const DAYS = ['All Days', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function DoctorsContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();

  const initialDept = searchParams?.get('department') || 'All Departments';
  const initialQuery = searchParams?.get('q') || '';

  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [selectedDay, setSelectedDay] = useState('All Days');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedDoctorForImage, setSelectedDoctorForImage] = useState<Doctor | null>(null);

  // Close image modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDoctorForImage(null);
      }
    };
    if (selectedDoctorForImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDoctorForImage]);

  const departments = ['All Departments', ...INITIAL_DEPARTMENTS.map((d) => d.name)];
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        if (data?.doctors && data.doctors.length > 0) {
          setDoctors(data.doctors);
        } else {
          // If database is empty or returns no results, fallback to initial seed data
          setDoctors(INITIAL_DOCTORS);
        }
      })
      .catch((err) => {
        // If database connection crashed or network failed, fallback to seed data
        console.warn('Database error while loading doctors, falling back to seed data:', err);
        setDoctors(INITIAL_DOCTORS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
                <span>{language === 'bn' ? 'ফিল্টার করুন' : 'Filter Directory'}</span>
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
                  {language === 'bn' ? 'রিসেট' : 'Reset'}
                </button>
              )}
            </div>

            {/* Department Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'bn' ? 'বিভাগ / স্পেশালিটি' : 'Specialty / Department'}
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>
                    {dept === 'All Departments' && language === 'bn' ? 'সকল বিভাগ' : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Day of Week Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'bn' ? 'রোগী দেখার দিন' : 'Visiting Day'}
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
                    <span>
                      {language === 'bn'
                        ? day === 'All Days' ? 'সকল দিন'
                        : day === 'Saturday' ? 'শনিবার'
                        : day === 'Sunday' ? 'রবিবার'
                        : day === 'Monday' ? 'সোমবার'
                        : day === 'Tuesday' ? 'মঙ্গলবার'
                        : day === 'Wednesday' ? 'বুধবার'
                        : day === 'Thursday' ? 'বৃহস্পতিবার'
                        : 'শুক্রবার'
                        : day}
                    </span>
                    {selectedDay === day && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Need Help Box */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 space-y-2">
              <div className="font-bold flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                {language === 'bn' ? 'ডাক্তার খুঁজতে সাহায্য প্রয়োজন?' : 'Need Help Finding a Doctor?'}
              </div>
              <p className="text-[11px] text-emerald-800">
                {language === 'bn'
                  ? 'ডাক্তারের শিডিউল ও সিরিয়াল কনফার্মেশনের জন্য আমাদের ওপিডি ডেস্কে কল করুন: '
                  : 'Call our 24/7 OPD desk at '}
                <span className="font-bold">{t('hotline')}</span>

              </p>
            </div>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-800">
              {language === 'bn' ? 'মোট পাওয়া গেছে ' : 'Found '}
              <span className="text-primary-600">{filteredDoctors.length}</span>
              {language === 'bn' ? ' জন বিশেষজ্ঞ ডাক্তার' : ' Specialist Doctors'}
            </span>
            <span className="text-xs text-slate-500">
              {language === 'bn' ? 'পদবী ও বিভাগ অনুযায়ী সাজানো' : 'Sorted by Seniority & Department'}
            </span>
          </div>

          {loading ? (
            <DoctorCardSkeleton count={6} />
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'bn' ? 'কোনো ডাক্তার পাওয়া যায়নি' : 'No doctors found matching filters'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'অনুসন্ধান ক্লিয়ার করুন অথবা "সকল বিভাগ" নির্বাচন করুন।'
                  : 'Try clearing your search query or selecting "All Departments".'}
              </p>
              <button
                onClick={() => {
                  setSelectedDept('All Departments');
                  setSelectedDay('All Days');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow"
              >
                {language === 'bn' ? 'সকল ডাক্তার দেখুন' : 'Show All Doctors'}
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
                      <div
                        onClick={() => setSelectedDoctorForImage(doc)}
                        className="relative group/avatar cursor-pointer flex-shrink-0"
                        title="Click to enlarge doctor photo"
                      >
                        <img
                          src={doc.imageUrl}
                          alt={doc.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-500 shadow-md group-hover/avatar:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white">
                          <ZoomIn className="w-5 h-5 drop-shadow" />
                          <span className="text-[9px] font-bold mt-0.5 tracking-tight">
                            {language === 'bn' ? 'বড় ছবি' : 'Enlarge'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 min-w-0">
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
                        {language === 'bn' ? 'বিশেষজ্ঞতা: ' : 'Speciality: '}
                        <span className="font-semibold text-slate-700">{doc.specialty}</span>
                      </p>
                    </div>

                    {/* Schedule & Room */}
                    <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 text-primary-600 mr-2 flex-shrink-0" />
                        <span>
                          {language === 'bn' ? 'সময়সূচী: ' : 'Hours: '}
                          <strong className="text-slate-900">{doc.visitingHours}</strong>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-primary-600 mr-2 flex-shrink-0" />
                        <span>
                          {language === 'bn' ? 'চেম্বার: ' : 'Chamber: '}
                          <strong className="text-slate-900">{doc.roomNumber}</strong>
                        </span>
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
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        {language === 'bn' ? 'ভিজিট ফি' : 'Consultation'}
                      </div>
                      <div className="text-sm font-black text-slate-900">৳{doc.consultationFee}</div>
                    </div>

                    <Link
                      href={`/appointments?doctor=${encodeURIComponent(doc.name)}&department=${encodeURIComponent(doc.department)}`}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow transition-all hover:scale-105"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {language === 'bn' ? 'সিরিয়াল নিন' : 'Book Appointment'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Doctor Image Pop-up Modal */}
      {selectedDoctorForImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all"
          onClick={() => setSelectedDoctorForImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 space-y-0 transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedDoctorForImage.department}
                </span>
                <span className="text-xs text-slate-300">Doctor Profile Photo</span>
              </div>
              <button
                onClick={() => setSelectedDoctorForImage(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Image Showcase */}
            <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-6">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                <img
                  src={selectedDoctorForImage.imageUrl}
                  alt={selectedDoctorForImage.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Doctor Info & Action Footer */}
            <div className="p-5 sm:p-6 space-y-4 bg-white">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-slate-900">
                  {selectedDoctorForImage.name}
                </h3>
                <p className="text-xs font-bold text-emerald-700">
                  {selectedDoctorForImage.designation}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {selectedDoctorForImage.qualifications}
                </p>
                {selectedDoctorForImage.specialty && (
                  <p className="text-xs text-slate-500">
                    Speciality: <span className="font-semibold text-slate-700">{selectedDoctorForImage.specialty}</span>
                  </p>
                )}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="truncate"><strong>Visiting:</strong> {selectedDoctorForImage.visitingHours}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="truncate"><strong>Chamber:</strong> {selectedDoctorForImage.roomNumber}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorForImage(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors text-center"
                >
                  Close Preview
                </button>
                <Link
                  href={`/appointments?doctor=${encodeURIComponent(selectedDoctorForImage.name)}&department=${encodeURIComponent(selectedDoctorForImage.department)}`}
                  className="w-1/2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow transition-all text-center flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DoctorsDirectoryPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Glossy Header Banner */}
      <PageHeaderBanner
        badge="Expert Medical Faculty"
        badgeBn="অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকবৃন্দ"
        title="Find Our Specialist Doctors"
        titleBn="আমাদের বিশেষজ্ঞ ডাক্তারদের তালিকা"
        description="Consult with over 200+ renowned professors, senior consultants, and surgeons in Dhaka."
        descriptionBn="ধানমন্ডি, ঢাকায় ২০০-রও বেশি খ্যাতনামা অধ্যাপক, সিনিয়র কনসালটেন্ট ও বিশেষজ্ঞ চিকিৎসকের অ্যাপয়েন্টমেন্ট নিন।"
      />

      <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Doctor Directory...</div>}>
        <DoctorsContent />
      </Suspense>
    </div>
  );
}
