'use client';

import { Star, Quote, CheckCircle } from 'lucide-react';
import { INITIAL_TESTIMONIALS } from '@/lib/seed-data';
import { useLanguage } from '@/context/LanguageContext';

export default function TestimonialsSection() {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 bg-slate-100 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            {t('test.badge')}
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            {t('test.title')}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t('test.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-200" />
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.patientName}</h4>
                  <p className="text-xs text-primary-600 font-medium">{item.department}</p>
                </div>
                {item.verified && (
                  <div className="flex items-center text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {language === 'bn' ? 'যাচাইকৃত রোগী' : 'Verified Patient'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
