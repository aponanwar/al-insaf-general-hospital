'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { INITIAL_NEWS } from '@/lib/seed-data';
import { useLanguage } from '@/context/LanguageContext';

export default function LatestNewsSection() {
  const newsList = INITIAL_NEWS.slice(0, 3);
  const { language, t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              {t('news.badge')}
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              {t('news.title')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {t('news.desc')}
            </p>
          </div>
          <Link
            href="/news"
            className="mt-4 md:mt-0 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline"
          >
            <span>{t('news.viewAll')}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsList.map((item, idx) => (
            <article
              key={idx}
              className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-200">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full text-white shadow-md ${
                      item.category === 'Notice'
                        ? 'bg-amber-600'
                        : item.category === 'Event'
                        ? 'bg-purple-600'
                        : 'bg-primary-600'
                    }`}
                  >
                    {language === 'bn'
                      ? item.category === 'Notice'
                        ? 'নোটিশ'
                        : item.category === 'Event'
                        ? 'ইভেন্ট'
                        : 'সংবাদ'
                      : item.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-slate-400 space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                    <span>
                      {new Date(item.publishDate).toLocaleDateString(
                        language === 'bn' ? 'bn-BD' : 'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <Link
                  href={`/news/${item.slug}`}
                  className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 pt-2 border-t border-slate-200/60"
                >
                  <span>{t('news.readMore')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
