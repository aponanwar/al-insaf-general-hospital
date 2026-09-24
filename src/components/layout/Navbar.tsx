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
  Award,
  Globe,
  Newspaper,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '@/lib/seed-data';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();

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

  const isAboutActive =
    pathname.startsWith('/about-us') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/news') ||
    pathname.startsWith('/contact-us');

  const isServicesActive =
    pathname.startsWith('/patient-guide') || pathname.startsWith('/services');

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
          scrolled ? 'shadow-md py-2' : 'border-b border-slate-100 py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Hospital Brand & Logo */}
            <Link href="/" className="flex items-center space-x-3 group py-1 flex-shrink-0">
              <div className="w-11 h-11 rounded-full flex items-center justify-center p-0.5 shadow-md shadow-slate-200 group-hover:scale-105 transition-transform bg-white border border-slate-100">
                <img
                  src="/images/logo.png"
                  alt="Al Insaf General Hospital"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold text-slate-600 tracking-tight leading-none group-hover:text-primary-600 transition-colors">

                  {language === 'bn' ? 'আল ইনসাফ জেনারেল' : 'AL INSAF GENERAL'} <br></br>
                  <span className="text-primary-600 font-bold ">{language === 'bn' ? 'হাসপাতাল (প্রাঃ)' : 'HOSPITAL (PVT.)'}</span>
                </span>
                {/* <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wider uppercase mt-1">
                  {t('hospital.subname')}
                </span> */}
              </div>
            </Link>

            {/* Desktop Navigation - 5 Balanced & Clean Main Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {/* 1. Home */}
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  pathname === '/'
                    ? 'text-primary-700 bg-primary-50/80 font-bold'
                    : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                {t('nav.home')}
              </Link>

              {/* 2. About AIGH (Dropdown containing About, Mission, Leadership, Management, Staff, News, Contact) */}
              <div className="relative group">
                <button
                  type="button"
                  className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isAboutActive
                      ? 'text-primary-700 bg-primary-50/80 font-bold'
                      : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{t('nav.about')}</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-slate-400 group-hover:text-primary-600 transition-transform group-hover:rotate-180" />
                </button>

                <div className="absolute left-0 top-full hidden group-hover:block w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 dropdown-enter z-50">
                  <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'bn' ? 'পরিচিতি ও প্রশাসন' : 'About & Leadership'}
                  </div>
                  <Link
                    href="/about-us"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Building2 className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.about.glance')}</span>
                  </Link>
                  <Link
                    href="/about-us#mission"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.about.mission')}</span>
                  </Link>
                  <Link
                    href="/about-us#leadership"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Award className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.about.leadership')}</span>
                  </Link>
                  <Link
                    href="/about-us#management"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Users className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.about.management')}</span>
                  </Link>
                  <Link
                    href="/staff"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.about.staff')}</span>
                  </Link>

                  <div className="my-1.5 border-t border-slate-100" />
                  <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'bn' ? 'যোগাযোগ ও মিডিয়া' : 'Media & Contact'}
                  </div>

                  {/* Media & News - Moved inside About dropdown */}
                  <Link
                    href="/news"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Newspaper className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.news')}</span>
                  </Link>

                  {/* Contact Us - Moved inside About dropdown */}
                  <Link
                    href="/contact-us"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.contact')}</span>
                  </Link>
                </div>
              </div>

              {/* 3. Specialities Mega Menu */}
              <div className="relative group">
                <Link
                  href="/specialities"
                  className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    pathname.startsWith('/specialities')
                      ? 'text-primary-700 bg-primary-50/80 font-bold'
                      : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{t('nav.specialities')}</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-slate-400 group-hover:text-primary-600 transition-transform group-hover:rotate-180" />
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[880px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 dropdown-enter z-50">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{t('nav.specialities.title')}</h3>
                      <p className="text-xs text-slate-500">{t('nav.specialities.subtitle')}</p>
                    </div>
                    <Link
                      href="/specialities"
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center group/link"
                    >
                      <span>{t('nav.specialities.viewAll')}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
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

              {/* 4. Doctors Directory */}
              <Link
                href="/doctors"
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  pathname.startsWith('/doctors')
                    ? 'text-primary-700 bg-primary-50/80 font-bold'
                    : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                {t('nav.doctors')}
              </Link>

              {/* 5. Patients & Services Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isServicesActive
                      ? 'text-primary-700 bg-primary-50/80 font-bold'
                      : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{t('nav.patientGuide')}</span>
                  <ChevronDown className="w-4 h-4 ml-1 text-slate-400 group-hover:text-primary-600 transition-transform group-hover:rotate-180" />
                </button>

                <div className="absolute left-0 top-full hidden group-hover:block w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 dropdown-enter z-50">
                  <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('nav.services.hospitalServices')}
                  </div>
                  <Link
                    href="/services/indoor"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Building2 className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.services.indoor')}</span>
                  </Link>
                  <Link
                    href="/services/outdoor"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Stethoscope className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.services.outdoor')}</span>
                  </Link>
                  <Link
                    href="/services/facilities"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.services.facilities')}</span>
                  </Link>

                  <div className="my-1.5 border-t border-slate-100" />
                  <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('nav.patientResources')}
                  </div>
                  <Link
                    href="/patient-guide/admission"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.guide.admission')}</span>
                  </Link>
                  <Link
                    href="/patient-guide/rates"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <Clock className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.guide.rates')}</span>
                  </Link>
                  <Link
                    href="/patient-guide/vaccination"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 mr-3 text-primary-500 shrink-0" />
                    <span>{t('nav.guide.vaccination')}</span>
                  </Link>
                </div>
              </div>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Language Switcher Toggle (EN / বাংলা) */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-primary-500 bg-slate-50 hover:bg-white text-xs font-bold transition-all shadow-sm group"
                title={language === 'en' ? 'বাংলা ভাষায় দেখুন' : 'Switch to English'}
                aria-label="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-primary-600 group-hover:rotate-45 transition-transform" />
                <span className={language === 'bn' ? 'text-primary-700 font-extrabold' : 'text-slate-400 font-normal'}>
                  বাংলা
                </span>
                <span className="text-slate-300">/</span>
                <span className={language === 'en' ? 'text-primary-700 font-extrabold' : 'text-slate-400 font-normal'}>
                  EN
                </span>
              </button>

              {/* Quick Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  searchOpen
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-100'
                }`}
                aria-label="Search"
                title="Search Doctors & Departments"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Book Appointment CTA */}
              <Link
                href="/appointments"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {t('nav.appointmentBtn')}
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-primary-600 hover:bg-slate-100 rounded-lg"
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
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
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
                  {t('nav.searchClear')}
                </button>
              )}
            </div>

            {/* Instant search suggestions */}
            {searchQuery.trim() !== '' && (
              <div className="max-w-3xl mx-auto mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-3 max-h-60 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {t('nav.matchingDepts')}
                </div>
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
                    {t('nav.searchAllDoctors')} &quot;{searchQuery}&quot; &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center p-0.5 bg-white border border-slate-100 shrink-0">
                  <img src="/images/logo.png" alt="Al Insaf Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-slate-800 text-sm">
                  {language === 'bn' ? 'আল ইনসাফ হাসপাতাল' : 'Al Insaf Hospital'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Language Switcher Pill */}
            <div className="px-5 pt-3">
              <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
                <span className="text-slate-500 text-[11px] px-2">ভাষা / Language:</span>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => language !== 'bn' && toggleLanguage()}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      language === 'bn' ? 'bg-primary-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    onClick={() => language !== 'en' && toggleLanguage()}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      language === 'en' ? 'bg-primary-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Links */}
            <div className="p-5 space-y-3 flex-1 overflow-y-auto text-sm">
              <Link
                href="/"
                className="block py-2 font-semibold text-slate-800 hover:text-primary-600 border-b border-slate-50"
              >
                {t('nav.home')}
              </Link>

              {/* About AIGH Section */}
              <div className="py-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1">
                  {t('nav.about')}
                </div>
                <div className="pl-2 space-y-1.5 border-l-2 border-primary-200 mt-1">
                  <Link href="/about-us" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.about.glance')}
                  </Link>
                  <Link href="/about-us#mission" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.about.mission')}
                  </Link>
                  <Link href="/about-us#leadership" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.about.leadership')}
                  </Link>
                  <Link href="/about-us#management" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.about.management')}
                  </Link>
                  <Link href="/staff" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.about.staff')}
                  </Link>
                  <Link href="/news" className="block py-1 text-slate-700 hover:text-primary-600 font-medium">
                    {t('nav.news')}
                  </Link>
                  <Link href="/contact-us" className="block py-1 text-slate-700 hover:text-primary-600 font-medium">
                    {t('nav.contact')}
                  </Link>
                </div>
              </div>

              {/* Doctors & Specialities */}
              <Link
                href="/doctors"
                className="block py-2 font-semibold text-slate-800 hover:text-primary-600 border-b border-slate-50"
              >
                {t('nav.doctors')}
              </Link>
              <Link
                href="/specialities"
                className="block py-2 font-semibold text-slate-800 hover:text-primary-600 border-b border-slate-50"
              >
                {t('nav.specialities')} (24+)
              </Link>

              {/* Services & Guide Section */}
              <div className="py-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1">
                  {t('nav.patientGuide')}
                </div>
                <div className="pl-2 space-y-1.5 border-l-2 border-emerald-200 mt-1">
                  <Link href="/services/indoor" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.services.indoor')}
                  </Link>
                  <Link href="/services/outdoor" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.services.outdoor')}
                  </Link>
                  <Link href="/services/facilities" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.services.facilities')}
                  </Link>
                  <Link href="/patient-guide/rates" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.guide.rates')}
                  </Link>
                  <Link href="/patient-guide/admission" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.guide.admission')}
                  </Link>
                  <Link href="/patient-guide/vaccination" className="block py-1 text-slate-700 hover:text-primary-600">
                    {t('nav.guide.vaccination')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Bottom CTAs */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <Link
                href="/appointments"
                className="w-full flex items-center justify-center py-3 text-sm font-bold text-white bg-primary-600 rounded-xl shadow-md hover:bg-primary-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('nav.appointmentBtn')}
              </Link>
              <a
                href="tel:09666787800"
                className="w-full flex items-center justify-center py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl"
              >
                <PhoneCall className="w-4 h-4 mr-2 text-primary-600" />
                {t('nav.callHotline')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
