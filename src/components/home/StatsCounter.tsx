'use client';

import { Users, Award, UserCheck, Hospital } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function StatsCounter() {
  const { language } = useLanguage();

  const stats = [
    {
      icon: Users,
      value: language === 'bn' ? '৩০,০০০+' : '30,000+',
      label: language === 'bn' ? 'সন্তুষ্ট সুস্থ রোগী' : 'Happy Patients Treated',
      desc: language === 'bn' ? 'সকল বিভাগে সফল চিকিৎসা সেবা' : 'Recovered & well-cared across all wings',
    },
    {
      icon: Award,
      value: language === 'bn' ? '১৫+' : '15+',
      label: language === 'bn' ? 'বছরের বিশ্বস্ত অভিজ্ঞতা' : 'Years of Excellence',
      desc: language === 'bn' ? '২০১০ সাল থেকে আধুনিক চিকিৎসাসেবা' : 'Pioneering modern medical care since 2010',
    },
    {
      icon: UserCheck,
      value: language === 'bn' ? '২০০+' : '200+',
      label: language === 'bn' ? 'খ্যাতনামা বিশেষজ্ঞ ডাক্তার' : 'Renowned Doctors',
      desc: language === 'bn' ? 'অধ্যাপক, বিশেষজ্ঞ ও সার্জনবৃন্দ' : 'Professors, specialists & surgical consultants',
    },
    {
      icon: Hospital,
      value: language === 'bn' ? '৪০০+' : '400+',
      label: language === 'bn' ? 'নিবেদিত নার্স ও কর্মী' : 'Dedicated Staff & Nurses',
      desc: language === 'bn' ? '২৪/৭ রোগীর আন্তরিক সেবা ও সাপোর্ট' : '24/7 patient support and emergency assistance',
    },
  ];

  return (
    <section className="bg-gradient-to-r from-primary-800 via-primary-700 to-emerald-900 text-white py-14 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center space-y-2 group">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 group-hover:scale-110 group-hover:bg-white group-hover:text-primary-700 transition-all shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-emerald-100">
                  {stat.label}
                </div>
                <p className="text-xs text-emerald-200/80 max-w-[200px] mx-auto hidden sm:block">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
