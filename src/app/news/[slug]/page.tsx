import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INITIAL_NEWS } from '@/lib/seed-data';
import { Calendar, ArrowLeft, Share2, Tag, ShieldCheck } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return INITIAL_NEWS.map((item) => ({
    slug: item.slug,
  }));
}

export default function NewsDetailPage({ params }: Props) {
  const article = INITIAL_NEWS.find((n) => n.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Glossy Header Banner */}
      <div className="relative bg-gradient-to-b from-[#2a3338] via-[#384349] to-[#232a2e] text-white py-14 sm:py-16 overflow-hidden border-b border-slate-700/60 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[650px] h-48 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <Link
            href="/news"
            className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to All News
          </Link>
          <span className="inline-block text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 border border-white/20 mb-3 shadow-inner">
            {article.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-sm">
            {article.title}
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-300 mt-4">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Published on{' '}
              {new Date(article.publishDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="rounded-2xl overflow-hidden shadow-md max-h-[400px]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
            <p className="font-semibold text-slate-900 text-base sm:text-lg">
              {article.summary}
            </p>
            <p>{article.content}</p>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/news"
              className="text-xs font-bold text-slate-600 hover:text-primary-600 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              View Other Updates
            </Link>

            <Link
              href="/appointments"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow"
            >
              Book Doctor Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
