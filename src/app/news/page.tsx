import Link from 'next/link';
import { Calendar, ArrowRight, Bell, Newspaper, Sparkles } from 'lucide-react';
import { INITIAL_NEWS } from '@/lib/seed-data';

export const metadata = {
  title: 'Media, News & Events | Al Insaf General Hospital Ltd.',
  description: 'Read the latest announcements, health awareness campaigns, academic conferences, and notices from Al Insaf General Hospital.',
};

export default function NewsPage() {
  const news = INITIAL_NEWS;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="bg-[#384349] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Media & Communication
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-3">
            Hospital News, Events & Notices
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
            Stay updated with clinical milestones, health workshops, and institutional announcements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <article
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden bg-slate-100">
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
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-slate-400 space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                    <span>
                      {new Date(item.publishDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
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
                  className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 pt-3 border-t border-slate-100"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
