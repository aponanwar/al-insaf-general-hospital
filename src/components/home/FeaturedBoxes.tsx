'use client';

import Link from 'next/link';
import { PhoneCall, MessageSquareText, FileSpreadsheet, BedDouble, Stethoscope, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FeaturedBoxes() {
  const { language } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Welcome Description Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
        <div className="lg:col-span-5">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            {language === 'bn' ? 'আল ইনসাফ হাসপাতাল পরিচিতি' : 'About Al Insaf Hospital'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 leading-snug">
            {language === 'bn' ? (
              <>
                স্বাগতম আপনাকে <br />
                <span className="text-primary-600">আল ইনসাফ জেনারেল হাসপাতালে</span>
              </>
            ) : (
              <>
                Welcome to <br />
                <span className="text-primary-600">Al Insaf General Hospital</span>
              </>
            )}
          </h2>
        </div>
        <div className="lg:col-span-7 text-slate-600 text-sm sm:text-base leading-relaxed border-l-0 lg:border-l-2 lg:border-slate-200 lg:pl-8">
          {language === 'bn'
            ? 'আল ইনসাফ গ্রুপের সর্ববৃহৎ স্বাস্থ্যসেবা প্রতিষ্ঠান আল ইনসাফ জেনারেল হাসপাতাল ২০১০ সাল থেকে সেবা দিয়ে আসছে। আধুনিক অবকাঠামো, উন্নত ডায়াগনস্টিক প্রযুক্তি এবং ২০০-রও বেশি অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকের সমন্বয়ে আমরা রোগীদের সর্বোচ্চ মানের চিকিৎসা সেবা নিশ্চিত করতে বদ্ধপরিকর।'
            : 'The most prestigious healthcare concern of Al Insaf Group, Al Insaf General Hospital started its journey in 2010. By the grace of Almighty Allah, it now boasts sound infrastructure, advanced diagnostic technologies, and an enviable faculty of over 200+ specialist doctors committed to uncompromising perfection in medical care.'}
        </div>
      </div>

      {/* 3 Full Width Highlight Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          href="/contact-us"
          className="group bg-slate-200/90 hover:bg-slate-300/90 p-6 rounded-2xl flex items-center space-x-4 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <PhoneCall className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-700">
              {language === 'bn' ? '২৪ ঘণ্টা সার্বক্ষণিক সেবা' : '24 Hours Service'}
            </h4>
            <p className="text-xs text-slate-600">
              {language === 'bn' ? 'জরুরি বিভাগ ও অ্যাম্বুলেন্স হটলাইন ২৪/৭ প্রস্তুত' : 'Emergency & Ambulance hotline available 24/7'}
            </p>
          </div>
        </Link>

        <Link
          href="/contact-us#inquiry"
          className="group bg-slate-200/90 hover:bg-slate-300/90 p-6 rounded-2xl flex items-center space-x-4 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <MessageSquareText className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-700">
              {language === 'bn' ? 'অনলাইন অনুসন্ধান ও বার্তা' : 'Online Inquiry'}
            </h4>
            <p className="text-xs text-slate-600">
              {language === 'bn' ? 'যেকোনো তথ্যের জন্য সরাসরি বার্তা পাঠান' : 'Submit queries directly to hospital desk'}
            </p>
          </div>
        </Link>

        <Link
          href="/patient-guide/rates"
          className="group bg-slate-200/90 hover:bg-slate-300/90 p-6 rounded-2xl flex items-center space-x-4 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-700">
              {language === 'bn' ? 'হাসপাতাল ফি তালিকা' : 'Hospital Rate Charts'}
            </h4>
            <p className="text-xs text-slate-600">
              {language === 'bn' ? 'সকল টেস্ট, কেবিন, ওটি ও আইসিইউর স্বচ্ছ তালিকা' : 'Transparent tariffs for beds, ICU & diagnostics'}
            </p>
          </div>
        </Link>
      </div>

      {/* Dual Big Visual Cards: Indoor vs Outdoor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/services/indoor"
          className="relative h-64 rounded-3xl overflow-hidden shadow-lg group flex items-end p-8"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent" />
          <div className="relative z-10 text-white flex justify-between items-center w-full">
            <div>
              <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                <BedDouble className="w-4 h-4" />
                <span>{language === 'bn' ? '৫০০+ শয্যাবিশিষ্ট ইনডোর ব্যবস্থা' : '500+ Bed Inpatient Facility'}</span>
              </div>
              <h3 className="text-2xl font-black">
                {language === 'bn' ? 'ইনডোর ও কেবিন সেবা' : 'Indoor Medical Service'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {language === 'bn' ? 'ডিলাক্স কেবিন, মাল্টি-প্যারা আইসিইউ, এইচডিইউ, সিসিইউ ও আধুনিক ওটি' : 'Deluxe Cabins, Multi-para ICU, HDU, CCU, & Modern OTs'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary-500 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </Link>

        <Link
          href="/services/outdoor"
          className="relative h-64 rounded-3xl overflow-hidden shadow-lg group flex items-end p-8"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent" />
          <div className="relative z-10 text-white flex justify-between items-center w-full">
            <div>
              <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Stethoscope className="w-4 h-4" />
                <span>{language === 'bn' ? 'বিশেষজ্ঞ কনসালটেশন ও ডায়াগনস্টিক' : 'Specialist Consultation & Labs'}</span>
              </div>
              <h3 className="text-2xl font-black">
                {language === 'bn' ? 'আউটডোর (ওপিডি) সেবা' : 'Outdoor (OPD) Service'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {language === 'bn' ? '২৪+ বিশেষায়িত চেম্বার, ১২৮-স্লাইস সিটি, ১.৫টি এমআরআই ও অটো ল্যাব' : '24+ Specialty OPD chambers, 128-slice CT, 1.5T MRI, & Automated Lab'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary-500 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
