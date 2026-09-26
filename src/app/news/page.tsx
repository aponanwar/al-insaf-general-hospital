import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight, Bell, Newspaper, Sparkles } from 'lucide-react';
import PageHeaderBanner from '@/components/layout/PageHeaderBanner';
import { INITIAL_NEWS } from '@/lib/seed-data';
import { HOSPITAL_CONFIG } from '@/lib/constants';

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://alinsafhospital.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Hospital News, Medical Events & Health Camps | Al Insaf General Hospital',
  description:
    'Stay updated with the latest news, free health screening camps, doctor schedules, mother & child wing announcements, and health bulletins from Al Insaf General Hospital, Dewanganj.',
  keywords: [
    'Al Insaf Hospital News',
    'Health Camp Dewanganj',
    'Medical News Jamalpur',
    'Hospital Notices Dewanganj',
    'Free Medical Camp Dewanganj',
    'হাসপাতাল সংবাদ দেওয়ানগঞ্জ',
    'ফ্রি মেডিকেল ক্যাম্প জামালপুর',
  ],
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: 'Hospital News, Events & Notices | Al Insaf General Hospital',
    description:
      'Latest clinical milestones, free health camps, and institutional announcements at Al Insaf General Hospital.',
    url: `${baseUrl}/news`,
    images: [
      {
        url: `${baseUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Al Insaf General Hospital News and Events',
      },
    ],
  },
};

const newsListSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Hospital News, Events & Health Notices',
  description: 'Announcements, clinical achievements, and health camp bulletins from Al Insaf General Hospital.',
  url: `${baseUrl}/news`,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: INITIAL_NEWS.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'NewsArticle',
        headline: item.title,
        datePublished: item.publishDate,
        url: `${baseUrl}/news/${item.slug}`,
        image: item.imageUrl,
        publisher: {
          '@type': 'Hospital',
          name: HOSPITAL_CONFIG.nameEn,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/logo.png`,
          },
        },
      },
    })),
  },
};

export default function NewsPage() {
  const news = INITIAL_NEWS;

  return (
    <div className="bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsListSchema) }}
      />
      {/* Glossy Header Banner */}
      <PageHeaderBanner
        badge="Media & Communication"
        badgeBn="সংবাদ ও জনসংযোগ"
        title="Hospital News, Events & Notices"
        titleBn="হাসপাতাল সংবাদ, ইভেন্ট ও নোটিশ"
        description="Stay updated with clinical milestones, health workshops, and institutional announcements."
        descriptionBn="হাসপাতালের সর্বশেষ স্বাস্থ্য ক্যাম্প, ফ্রি মেডিকেল ক্যাম্পেইন এবং গুরুত্বপূর্ণ নোটিশসমূহ।"
      />

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
