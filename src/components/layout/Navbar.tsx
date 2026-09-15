'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Search,
  Menu,
  X,
  PhoneCall,
  Calendar,
  HeartPulse,
  Stethoscope,
  Building2,
  Users,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '@/lib/seed-data';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Track scroll for sticky navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const departments = INITIAL_DEPARTMENTS;

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
          scrolled ? 'shadow-md py-1' : 'border-b border-slate-100 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Hospital Logo */}
            <Link href="/" className="flex items-center space-x-3 group py-1">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-800 tracking-tight leading-none group-hover:text-primary-600 transition-colors">
                  AL INSAF <span className="text-primary-600 font-bold">HOSPITAL</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase mt-1">
                  General Hospital Ltd.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {/* Home */}
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  pathname === '/'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>

              {/* About AIGH Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className={`flex items-center px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    pathname.startsWith('/about-us')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <span>About AIGH</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-slate-400 group-hover:text-primary-600 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 dropdown-enter">
                  <Link
                    href="/about-us"
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Building2 className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>At a Glance</span>
                  </Link>
                  <Link
                    href="/about-us#mission"
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>Vision & Mission</span>
                  </Link>
                  <Link
                    href="/about-us#leadership"
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Award className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>Chairman & MD Message</span>
                  </Link>
                  <Link
                    href="/about-us#management"
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Users className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>Management Team</span>
                  </Link>
                  <Link
                    href="/staff"
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>Staff & Hospital Team</span>
                  </Link>
                </div>
              </div>

              {/* Specialities Mega Menu */}
              <div className="relative group">
                <Link
                  href="/specialities"
                  className={`flex items-center px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    pathname.startsWith('/specialities')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Specialities</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-slate-400 group-hover:text-primary-600 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[900px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 dropdown-enter">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Our Medical Departments & Specialities</h3>
                      <p className="text-xs text-slate-500">Comprehensive super-specialized treatment across 24+ medical wings</p>
                    </div>
                    <Link
                      href="/specialities"
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      View All Specialities &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-2.5 max-h-[380px] overflow-y-auto pr-2">
                    {departments.map((dept) => (
                      <Link
                        key={dept.slug}
                        href={`/specialities/${dept.slug}`}
                        className="group/item flex items-center text-xs font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 p-2 rounded-lg transition-all border border-transparent hover:border-slate-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mr-2 group-hover/item:bg-primary-600 group-hover/item:scale-125 transition-all" />
                        <span className="truncate">{dept.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Doctors Directory */}
              <Link
                href="/doctors"
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  pathname.startsWith('/doctors')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                Our Doctors
              </Link>

              {/* Patients & Services Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className={`flex items-center px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    pathname.startsWith('/patient-guide') || pathname.startsWith('/services')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Patients Guide</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-slate-400 group-hover:text-primary-600 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 dropdown-enter">
                  <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Hospital Services
                  </div>
                  <Link
                    href="/services/indoor"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Building2 className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>Indoor & Cabin Services</span>
                  </Link>
                  <Link
                    href="/services/outdoor"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Stethoscope className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>Outdoor & Consultation</span>
                  </Link>
                  <Link
                    href="/services/facilities"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>In-Patient Facilities & ICU</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Patient Resources
                  </div>
                  <Link
                    href="/patient-guide/admission"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>Admission & Payment Guide</span>
                  </Link>
                  <Link
                    href="/patient-guide/rates"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Clock className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>Hospital Rate Charts</span>
                  </Link>
                  <Link
                    href="/patient-guide/vaccination"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2.5 text-primary-500" />
                    <span>Vaccination & Blood Bank</span>
                  </Link>
                </div>
              </div>

              {/* News & Media */}
              <Link
                href="/news"
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  pathname.startsWith('/news')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                Media & News
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact-us"
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  pathname === '/contact-us'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Quick Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Book Appointment CTA */}
              <Link
                href="/appointments"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 mr-1.5" />
                Book Appointment
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-slate-700 hover:text-primary-600 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Search Dropdown Bar */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 shadow-inner">
            <div className="max-w-3xl mx-auto flex items-center bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden px-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors, departments, treatments or rate charts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2"
                >
                  Clear
                </button>
              )}
            </div>
            {/* Instant search suggestions */}
            {searchQuery.trim() !== '' && (
              <div className="max-w-3xl mx-auto mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-3 max-h-60 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Matching Departments & Specialties</div>
                {departments
                  .filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 5)
                  .map((dept) => (
                    <Link
                      key={dept.slug}
                      href={`/specialities/${dept.slug}`}
                      className="block text-xs text-slate-700 hover:text-primary-600 hover:bg-slate-50 p-2 rounded"
                    >
                      {dept.name}
                    </Link>
                  ))}
                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center">
                  <Link
                    href={`/doctors?q=${encodeURIComponent(searchQuery)}`}
                    className="text-xs font-bold text-primary-600 hover:underline"
                  >
                    Search all doctors for &quot;{searchQuery}&quot; &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-6 h-6 text-primary-600" />
                <span className="font-bold text-slate-800">Al Insaf General Hospital</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-3 flex-1 overflow-y-auto">
              <Link
                href="/"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                About Us
              </Link>
              <Link
                href="/staff"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Staff & Hospital Team
              </Link>
              <Link
                href="/specialities"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Specialities (24+)
              </Link>
              <Link
                href="/doctors"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Our Doctors
              </Link>
              <Link
                href="/services/indoor"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Indoor Services
              </Link>
              <Link
                href="/services/outdoor"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Outdoor Services
              </Link>
              <Link
                href="/patient-guide/rates"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Rate Charts
              </Link>
              <Link
                href="/patient-guide/admission"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Admission Guide
              </Link>
              <Link
                href="/news"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Media & News
              </Link>
              <Link
                href="/contact-us"
                className="block py-2 text-base font-semibold text-slate-800 hover:text-primary-600"
              >
                Contact Us
              </Link>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <Link
                href="/appointments"
                className="w-full flex items-center justify-center py-3 text-sm font-bold text-white bg-primary-600 rounded-xl shadow-md hover:bg-primary-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Online Appointment
              </Link>
              <a
                href="tel:09666787800"
                className="w-full flex items-center justify-center py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl"
              >
                <PhoneCall className="w-4 h-4 mr-2 text-primary-600" />
                Call Hotline: 09666 787800
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
