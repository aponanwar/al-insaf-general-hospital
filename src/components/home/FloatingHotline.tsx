'use client';

import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FloatingHotline() {
  const { t, language } = useLanguage();
  const [minimized, setMinimized] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center group print:hidden transition-all duration-300"
      role="complementary"
      aria-label="Emergency Hotline"
    >
      {/* Expanded Floating Button */}
      <div className="relative flex items-center">
        {/* Pulsing ambient aura */}
        <span className="absolute -inset-1 bg-red-600 rounded-full blur-md opacity-70 group-hover:opacity-100 animate-pulse transition duration-300 pointer-events-none" />

        {/* Action Link */}
        <a
          href="tel:01303359905"
          className="relative flex items-center space-x-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
          title={language === 'bn' ? 'জরুরি হটলাইনে কল করুন' : 'Call 24/7 Emergency Hotline'}
          aria-label={language === 'bn' ? 'জরুরি হটলাইনে কল করুন' : 'Call 24/7 Emergency Hotline'}
        >
          {/* Animated Call Icon with Ripple */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-40 animate-ping" />
            <PhoneCall className="w-5 h-5 animate-bounce text-white drop-shadow" />
          </div>

          {/* Labels & Number */}
          <div className="flex flex-col text-left">
            <div className="flex items-center space-x-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100">
                {t('hotline.floating', '24/7 Emergency')}
              </span>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white font-mono drop-shadow-sm">
              {t('hotline')}
            </span>
          </div>
        </a>

      </div>
    </div>
  );
}
