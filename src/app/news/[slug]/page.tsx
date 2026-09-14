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
      {/* Banner */}
      <div className="bg-[#384349] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to All News
          </Link>
          <span className="inline-block text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 mb-3">
            {article.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
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
