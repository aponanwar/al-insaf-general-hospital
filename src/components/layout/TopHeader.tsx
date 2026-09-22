'use client';

import Link from 'next/link';
import { Phone, Mail, Clock, ChevronRight, Facebook, Twitter, Instagram } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TopHeader() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#384349] text-white text-xs border-b border-slate-700/40 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          {/* Left Quick Links & Contact Info */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-center space-x-3 text-slate-300">
              <Link href="/patient-guide/admission" className="hover:text-emerald-400 transition-colors flex items-center">
                <ChevronRight className="w-3 h-3 mr-0.5 text-emerald-400" />
                {t('top.admission')}
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/services/facilities" className="hover:text-emerald-400 transition-colors flex items-center">
                <ChevronRight className="w-3 h-3 mr-0.5 text-emerald-400" />
                {t('top.amenities')}
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/news" className="hover:text-emerald-400 transition-colors flex items-center">
                <ChevronRight className="w-3 h-3 mr-0.5 text-emerald-400" />
                {t('top.newsEvents')}
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/patient-guide/rates" className="hover:text-emerald-400 transition-colors flex items-center">
                <ChevronRight className="w-3 h-3 mr-0.5 text-emerald-400" />
                {t('top.rateCharts')}
              </Link>
            </div>

            <div className="h-3 w-px bg-slate-600 hidden lg:block" />

            <div className="flex items-center space-x-4">
              <a href="tel:09666787800" className="flex items-center text-slate-200 hover:text-white font-medium">
                <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-400 animate-pulse" />
                <span>{t('hotline')}</span>
              </a>
              <a href="mailto:info@alinsafhospital.com" className="flex items-center text-slate-200 hover:text-white">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                <span>info@alinsafhospital.com</span>
              </a>
            </div>
          </div>

          {/* Right: 24/7 Hotline Badge & Social Links */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-emerald-700/60 px-2.5 py-0.5 rounded text-[11px] font-semibold text-emerald-100 tracking-wide">
              <Clock className="w-3 h-3 mr-1" />
              {t('top.emergency')}
            </div>

            <div className="flex items-center space-x-2 text-slate-300">
              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:scale-110 transition-transform p-1"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:scale-110 transition-transform p-1"
                aria-label="Twitter"
                title="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/8801711000000?text=Hello%20Al%20Insaf%20General%20Hospital,%20I%20need%20information."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 hover:scale-110 transition-transform p-1"
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
              >
                {/* Custom Crisp WhatsApp SVG Icon */}
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.03C9.36 7.03 9.08 7.09 8.84 7.35C8.61 7.61 7.95 8.22 7.95 9.48C7.95 10.74 8.87 11.95 9 12.12C9.13 12.29 10.8 14.86 13.36 15.96C13.97 16.22 14.44 16.38 14.81 16.5C15.42 16.69 15.98 16.66 16.42 16.6C16.91 16.53 17.93 15.99 18.14 15.39C18.35 14.79 18.35 14.28 18.29 14.17C18.23 14.06 18.06 14 17.8 13.87C17.54 13.74 16.27 13.11 16.03 13.03C15.8 12.94 15.63 12.9 15.46 13.16C15.29 13.42 14.8 14 14.65 14.17C14.5 14.34 14.35 14.36 14.09 14.23C13.83 14.1 12.99 13.82 12 12.94C11.23 12.25 10.71 11.4 10.56 11.14C10.41 10.88 10.54 10.74 10.67 10.61C10.79 10.49 10.93 10.3 11.07 10.14C11.21 9.97 11.26 9.85 11.35 9.68C11.44 9.5 11.39 9.34 11.33 9.21C11.26 9.08 10.75 7.82 10.54 7.3C10.33 6.8 10.12 6.87 9.96 6.86C9.81 6.86 9.64 6.86 9.47 6.86L9.53 7.03Z" />
                </svg>
              </a>

              {/* Gmail / Webmail */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=info@alinsafhospital.com&su=Inquiry%20from%20Website"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-400 hover:scale-110 transition-transform p-1"
                aria-label="Gmail"
                title="Send via Gmail"
              >
                {/* Custom Crisp Gmail M-envelope SVG Icon */}
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 hover:scale-110 transition-transform p-1"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
