'use client';

import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  HeartPulse,
  ShieldCheck,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: About & Contacts (2 spans) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center p-0.5 bg-white shadow-lg shrink-0">
                <img src="/images/logo.png" alt="Al Insaf Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">

                <span className="text-xl font-black text-white tracking-tight">
                  {language === 'bn' ? 'আল ইনসাফ ' : 'AL INSAF '}
                  <span className="text-primary-400">{language === 'bn' ? 'হাসপাতাল' : 'HOSPITAL'}</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {t('hospital.subname')}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              {t('hospital.tagline')}
            </p>

            <div className="space-y-2.5 pt-2 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                <span>{t('hospital.address')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:01303359905" className="hover:text-white font-semibold text-emerald-400">
                  {t('hotline')} ({language === 'bn' ? 'হটলাইন' : 'Hotline'})
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:alinsafhospital2025@gmail.com" className="hover:text-white">
                  alinsafhospital2025@gmail.com
                </a>
              </div>
            </div>

          </div>

          {/* Col 2: Hospital Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <ShieldCheck className="w-4 h-4 text-primary-400 mr-2" />
              {t('footer.services')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/indoor" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.services.indoor')}
                </Link>
              </li>
              <li>
                <Link href="/services/outdoor" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.services.outdoor')}
                </Link>
              </li>
              <li>
                <Link href="/services/facilities" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.services.facilities')}
                </Link>
              </li>
              <li>
                <Link href="/patient-guide/rates" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.guide.rates')}
                </Link>
              </li>
              <li>
                <Link href="/patient-guide/vaccination" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.guide.vaccination')}
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.appointmentBtn')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <Clock className="w-4 h-4 text-primary-400 mr-2" />
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about-us" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.about.glance')}
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.doctors')}
                </Link>
              </li>
              <li>
                <Link href="/specialities" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.specialities')}
                </Link>
              </li>
              <li>
                <Link href="/patient-guide/admission" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.guide.admission')}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.news')}
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency & Quick Appointment Card */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer.emergencyHelp')}
            </h4>
            <p className="text-xs text-slate-400">
              {t('footer.emergencyDesc')}
            </p>
            <div className="bg-emerald-950/60 border border-emerald-800/50 p-3 rounded-xl text-center">
              <div className="text-[11px] text-emerald-300 uppercase font-semibold">
                {t('footer.ambulanceHotline')}
              </div>
              <div className="text-lg font-black text-emerald-400 tracking-wider">
                {t('hotline')}
              </div>
            </div>
            <Link
              href="/appointments"
              className="w-full block text-center py-2.5 px-4 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              {t('footer.bookDoctor')}
            </Link>
          </div>
        </div>

        {/* Bottom copyright & admin portal link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-3 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} {language === 'bn' ? 'আল ইনসাফ জেনারেল হাসপাতাল লিঃ। ' : 'Al Insaf General Hospital Ltd. '}
            {t('footer.rights')}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-slate-400">{t('footer.privacy')}</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-400">{t('footer.terms')}</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-emerald-400 flex items-center text-slate-400 font-medium">
              <Lock className="w-3 h-3 mr-1 text-slate-500" />
              {t('footer.adminPortal')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
