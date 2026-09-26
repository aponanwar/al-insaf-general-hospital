'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { HOSPITAL_CONFIG } from '@/lib/constants';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

export const translations: Record<string, { en: string; bn: string }> = {
  // Brand & General
  'hospital.name': { en: HOSPITAL_CONFIG.nameEn.toUpperCase(), bn: HOSPITAL_CONFIG.nameBn },
  'hospital.subname': { en: 'General Hospital Ltd.', bn: 'জেনারেল হাসপাতাল লিঃ' },
  'hospital.motto': { en: 'Excellence in Healthcare & Diagnostics', bn: 'উন্নত স্বাস্থ্যসেবা ও নির্ভুল রোগ নির্ণয়ে বিশ্বস্ত' },
  'hospital.tagline': {
    en: 'The premier healthcare institution of Al Insaf Group, delivering tertiary medical care with 500+ beds, 24/7 emergency response, modern ICUs, and 24+ specialized clinical departments in Dewanganj, Jamalpur, Bangladesh.',
    bn: 'আল ইনসাফ গ্রুপের প্রধান স্বাস্থ্যসেবা প্রতিষ্ঠান— ৫০০+ শয্যা, ২৪/৭ জরুরি সেবা, আধুনিক আইসিইউ এবং ২৪টিরও বেশি বিশেষায়িত চিকিৎসা বিভাগ নিয়ে দেওয়ানগঞ্জ, জামালপুরে অবস্থিত।'
  },
  'hospital.address': {
    en: HOSPITAL_CONFIG.addressEn,
    bn: HOSPITAL_CONFIG.addressBn
  },
  'hotline': {
    en: HOSPITAL_CONFIG.phone,
    bn: '০১৩০৩-৩৫৯৯০৫'
  },
  'hotline.alt': {
    en: HOSPITAL_CONFIG.phoneAlt,
    bn: '০১৯১৩-১২৯০২০'
  },
  'email': {
    en: HOSPITAL_CONFIG.email,
    bn: HOSPITAL_CONFIG.email
  },
  'hotline.floating': { en: '24/7 Hotline', bn: '২৪/৭ হটলাইন' },

  // Navbar Links
  'nav.home': { en: 'Home', bn: 'হোম' },
  'nav.about': { en: 'About AIGH', bn: 'পরিচিতি' },
  'nav.about.glance': { en: 'At a Glance', bn: 'এক নজরে হাসপাতাল' },
  'nav.about.mission': { en: 'Vision & Mission', bn: 'লক্ষ্য ও উদ্দেশ্য' },
  'nav.about.leadership': { en: 'Chairman & MD Message', bn: 'চেয়ারম্যান ও এমডি বার্তা' },
  'nav.about.management': { en: 'Management Team', bn: 'ব্যবস্থাপনা পর্ষদ' },
  'nav.about.staff': { en: 'Staff & Hospital Team', bn: 'কর্মকর্তা ও কর্মচারী' },
  'nav.specialities': { en: 'Specialities', bn: 'স্পেশালিটি' },
  'nav.specialities.title': { en: 'Our Medical Departments & Specialities', bn: 'আমাদের বিশেষায়িত চিকিৎসা বিভাগসমূহ' },
  'nav.specialities.subtitle': { en: 'Comprehensive super-specialized treatment across 24+ medical wings', bn: '২৪টিরও বেশি বিশেষায়িত বিভাগে আধুনিক চিকিৎসা ও সেবা' },
  'nav.specialities.viewAll': { en: 'View All Specialities', bn: 'সকল বিভাগ দেখুন' },
  'nav.doctors': { en: 'Our Doctors', bn: 'ডাক্তারবৃন্দ' },
  'nav.patientGuide': { en: 'Patients Guide', bn: 'রোগী নির্দেশিকা' },
  'nav.services.hospitalServices': { en: 'Hospital Services', bn: 'হাসপাতাল সেবাসমূহ' },
  'nav.services.indoor': { en: 'Indoor & Cabin Services', bn: 'ইনডোর ও কেবিন সেবা' },
  'nav.services.outdoor': { en: 'Outdoor & Consultation', bn: 'আউটডোর ও কনসাল্টেশন' },
  'nav.services.facilities': { en: 'In-Patient Facilities & ICU', bn: 'ইন-পেশেন্ট সেবা ও আইসিইউ' },
  'nav.patientResources': { en: 'Patient Resources', bn: 'রোগীর তথ্য ও গাইড' },
  'nav.guide.admission': { en: 'Admission & Payment Guide', bn: 'ভর্তি ও পেমেন্ট নির্দেশিকা' },
  'nav.guide.rates': { en: 'Hospital Rate Charts', bn: 'হাসপাতাল ফি তালিকা' },
  'nav.guide.vaccination': { en: 'Vaccination & Blood Bank', bn: 'টিকাদান ও ব্লাড ব্যাংক' },
  'nav.news': { en: 'Media & News', bn: 'সংবাদ ও নোটিশ' },
  'nav.contact': { en: 'Contact', bn: 'যোগাযোগ' },
  'nav.appointmentBtn': { en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট নিন' },
  'nav.searchPlaceholder': { en: 'Search doctors, departments, treatments or rate charts...', bn: 'ডাক্তার, বিভাগ, চিকিৎসা বা ফি তালিকা খুঁজুন...' },
  'nav.searchClear': { en: 'Clear', bn: 'মুছুন' },
  'nav.matchingDepts': { en: 'Matching Departments & Specialties', bn: 'সম্পর্কিত বিভাগ ও স্পেশালিটি' },
  'nav.searchAllDoctors': { en: 'Search all doctors for', bn: 'ডাক্তার খুঁজুন' },
  'nav.callHotline': {
    en: `Call Hotline: ${HOSPITAL_CONFIG.phone}`,
    bn: `হটলাইন কল করুন: ${HOSPITAL_CONFIG.phone}`
  },


  // TopHeader
  'top.admission': { en: 'Admission', bn: 'ভর্তি তথ্য' },
  'top.amenities': { en: 'Amenities', bn: 'সুযোগ-সুবিধা' },
  'top.newsEvents': { en: 'News & Events', bn: 'সংবাদ ও ইভেন্ট' },
  'top.rateCharts': { en: 'Rate Charts', bn: 'ফি তালিকা' },
  'top.emergency': { en: '24/7 Emergency & Ambulance', bn: '২৪/৭ জরুরি ও অ্যাম্বুলেন্স সেবা' },

  // Footer
  'footer.services': { en: 'Hospital Services', bn: 'হাসপাতাল সেবা' },
  'footer.quickLinks': { en: 'Quick Links', bn: 'প্রয়োজনীয় লিংক' },
  'footer.emergencyHelp': { en: '24/7 Emergency Help', bn: '২৪/৭ জরুরি সহায়তা' },
  'footer.emergencyDesc': {
    en: 'Emergency casualty, round-the-clock cardiac care, trauma service, and ICU admission available.',
    bn: '২৪ ঘণ্টা জরুরি ক্যাজুয়ালটি, কার্ডিয়াক কেয়ার, ট্রমা সার্ভিস ও আইসিইউ ভর্তি সেবা চালু রয়েছে।'
  },
  'footer.ambulanceHotline': { en: 'Ambulance & Hotline', bn: 'অ্যাম্বুলেন্স ও হটলাইন' },
  'footer.bookDoctor': { en: 'Book Doctor Now', bn: 'ডাক্তার অ্যাপয়েন্টমেন্ট' },
  'footer.privacy': { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' },
  'footer.terms': { en: 'Terms of Service', bn: 'ব্যবহারের শর্তাবলী' },
  'footer.adminPortal': { en: 'Staff / Admin Portal', bn: 'স্টাফ / অ্যাডমিন পোর্টাল' },
  'footer.rights': { en: 'All rights reserved.', bn: 'সর্বস্বত্ব সংরক্ষিত।' },

  // Hero Slider
  'hero.badge': { en: 'TERTIARY HEALTHCARE & DIAGNOSTICS', bn: 'উন্নত টারশিয়ারি স্বাস্থ্যসেবা ও ডায়াগনস্টিক' },
  'hero.slide1.title': { en: 'Advanced Compassionate Care with 500+ Beds & 24/7 ICU', bn: '৫০০+ শয্যা ও ২৪/৭ আইসিইউ সুবিধাসহ আধুনিক মানবিক চিকিৎসা সেবা' },
  'hero.slide1.desc': {
    en: 'Delivering international standard healthcare with specialized medical wings, expert consultants, modern operation theatres, and cutting-edge diagnostics in Dhaka.',
    bn: 'আন্তর্জাতিক মানের আধুনিক অপারেশন থিয়েটার, অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক এবং অত্যাধুনিক প্রযুক্তির নির্ভুল ডায়াগনস্টিক সেবা।'
  },
  'hero.slide2.title': { en: '24/7 Emergency, Trauma Care & Modern Critical Units', bn: '২৪ ঘণ্টা ইমার্জেন্সি, ট্রমা কেয়ার ও আধুনিক ক্রিটিক্যাল কেয়ার ইউনিট' },
  'hero.slide2.desc': {
    en: 'Dedicated trauma team, advanced life support ambulances, and immediate ICU/CCU readiness for all critical patients.',
    bn: 'জরুরি ট্রমা টিম, অ্যাডভান্সড লাইফ সাপোর্ট অ্যাম্বুলেন্স এবং মুমূর্ষু রোগীর জন্য তাৎক্ষণিক আইসিইউ ও সিসিইউ প্রস্তুতি।'
  },
  'hero.slide3.title': { en: 'Expert Consultants Across 24+ Medical Specialties', bn: '২৪টিরও বেশি বিভাগে দেশের শীর্ষস্থানীয় বিশেষজ্ঞ চিকিৎসকবৃন্দ' },
  'hero.slide3.desc': {
    en: 'Cardiology, Neurology, Medicine, Paediatrics, Oncology, Gynae, Nephrology, Orthopaedics and more under one roof.',
    bn: 'কার্ডিওলজি, নিউরোলজি, মেডিসিন, শিশু রোগ, অনকোলজি, গাইনি, কিডনি ও অর্থোপেডিকস সব বিভাগ এক ছাদের নিচে।'
  },
  'hero.btn.appointment': { en: 'Book Appointment Online', bn: 'অনলাইনে অ্যাপয়েন্টমেন্ট নিন' },
  'hero.btn.findDoctor': { en: 'Find a Specialist Doctor', bn: 'বিশেষজ্ঞ ডাক্তার খুঁজুন' },
  'hero.btn.services': { en: 'Explore Services & Tariffs', bn: 'হাসপাতাল সেবাসমূহ ও ফি' },
  'hero.btn.emergency': { en: `Emergency: ${HOSPITAL_CONFIG.emergencyPhone}`, bn: `জরুরি সেবা: ${HOSPITAL_CONFIG.emergencyPhone}` },

  // Quick Cards
  'quick.emergency.title': { en: '24/7 Emergency Care', bn: '২৪ ঘণ্টা জরুরি সেবা' },
  'quick.emergency.desc': { en: 'Instant casualty, trauma response & ICU standby round the clock.', bn: 'দিনরাত সার্বক্ষণিক ইমার্জেন্সি ও দ্রুত আইসিইউ ভর্তি সুবিধা।' },
  'quick.emergency.cta': { en: 'Emergency Hotline', bn: 'জরুরি হটলাইন' },

  'quick.doctors.title': { en: 'Specialist Doctors', bn: 'বিশেষজ্ঞ চিকিৎসক' },
  'quick.doctors.desc': { en: 'Leading professors, surgeons and medical consultants across 24+ fields.', bn: '২৪টিরও বেশি বিশেষায়িত বিভাগে দেশের সেরা বিশেষজ্ঞ ও সার্জনগণ।' },
  'quick.doctors.cta': { en: 'Browse Doctors', bn: 'ডাক্তার তালিকা দেখুন' },

  'quick.appointment.title': { en: 'Online Appointment', bn: 'অনলাইন অ্যাপয়েন্টমেন্ট' },
  'quick.appointment.desc': { en: 'Book your doctor consultation serial online in under 2 minutes.', bn: 'ঘরে বসেই মাত্র ২ মিনিটে ডাক্তারের সিরিয়াল নিশ্চিত করুন।' },
  'quick.appointment.cta': { en: 'Book Serial Now', bn: 'সিরিয়াল নিন' },

  'quick.rates.title': { en: 'Transparent Rates', bn: 'স্বচ্ছ ফি তালিকা' },
  'quick.rates.desc': { en: 'Affordable pathology, imaging, cabin and OT tariff charts available.', bn: 'সকল প্যাথলজি, এক্স-রে, সিটি স্ক্যান, কেবিন ও ওটি ফি তালিকা।' },
  'quick.rates.cta': { en: 'View Rate Charts', bn: 'ফি তালিকা দেখুন' },

  // Why Choose Us
  'why.badge': { en: 'WHY CHOOSE AL INSAF', bn: 'কেন আল ইনসাফ হাসপাতাল বেছে নেবেন' },
  'why.title': { en: 'Excellence In Every Step of Your Healthcare Journey', bn: 'আপনার সুস্থতায় আমাদের প্রতিটি পদক্ষেপ নিখুঁত ও যত্নশীল' },
  'why.desc': {
    en: 'Equipped with 500+ modern beds, state-of-the-art diagnostic imaging, and highly reputed doctors, Al Insaf General Hospital is committed to delivering quality tertiary healthcare at affordable rates.',
    bn: '৫০০+ আধুনিক শয্যা, বিশ্বমানের ডায়াগনস্টিক প্রযুক্তি এবং দেশের স্বনামধন্য চিকিৎসকদের সমন্বয়ে আল ইনসাফ হাসপাতাল সর্বদা সুলভ মূল্যে উন্নত সেবা দিতে অঙ্গীকারবদ্ধ।'
  },
  'why.f1.title': { en: '500+ Beds & Modern Infrastructure', bn: '৫০০+ শয্যা ও আধুনিক অবকাঠামো' },
  'why.f1.desc': { en: 'Spacious general wards, VIP cabins, deluxe suites, and dedicated sterile surgical blocks.', bn: 'পরিচ্ছন্ন জেনারেল ওয়ার্ড, ভিআইপি কেবিন, ডিলাক্স স্যুট ও আধুনিক সার্জিক্যাল ব্লক।' },
  'why.f2.title': { en: 'World-Class ICUs & Critical Care', bn: 'উন্নত আইসিইউ ও সিসিইউ সুবিধা' },
  'why.f2.desc': { en: '24/7 central oxygen, advanced multi-parameter monitors, and high-end ventilators.', bn: '২৪ ঘণ্টা সেন্ট্রাল অক্সিজেন, অত্যাধুনিক ভেন্টিলেটর ও মাল্টি-প্যারামিটার মনিটর।' },
  'why.f3.title': { en: 'Precision Diagnostics & Labs', bn: 'নির্ভুল ল্যাব ও ডায়াগনস্টিক' },
  'why.f3.desc': { en: 'Automated 128-slice CT scan, 1.5T MRI, digital 4D ultrasound, and automated biochemistry.', bn: '১২৮-স্লাইস সিটি স্ক্যান, ১.৫টি এমআরআই, ৪ডি আল্ট্রাসাউন্ড ও সম্পূর্ণ অটোমেটেড প্যাথলজি।' },
  'why.f4.title': { en: '24/7 In-House Pharmacy & Blood Bank', bn: '২৪ ঘণ্টা ফার্মেসি ও ব্লাড ব্যাংক' },
  'why.f4.desc': { en: 'Genuine medicines and round-the-clock screened blood components availability.', bn: 'শতভাগ মানসম্মত ওষুধ ও সার্বক্ষণিক নিরাপদ রক্ত ও রক্ত উপাদান সরবরাহ।' },

  // Stats Counter
  'stats.beds': { en: 'Total Bed Capacity', bn: 'মোট শয্যা সংখ্যা' },
  'stats.doctors': { en: 'Specialist Consultants', bn: 'বিশেষজ্ঞ চিকিৎসক' },
  'stats.departments': { en: 'Medical Specialities', bn: 'চিকিৎসা বিভাগ' },
  'stats.patients': { en: 'Patients Served', bn: 'সন্তুষ্ট সেবাগ্রহীতা' },

  // Latest News & Events
  'news.badge': { en: 'HOSPITAL UPDATES', bn: 'হাসপাতাল আপডেট' },
  'news.title': { en: 'Latest News, Events & Notices', bn: 'সর্বশেষ সংবাদ, ইভেন্ট ও নোটিশ' },
  'news.desc': { en: 'Stay informed about our latest clinical programs, free screening camps, and hospital announcements.', bn: 'হাসপাতালের নতুন স্বাস্থ্যসেবা কার্যক্রম, ফ্রি মেডিকেল ক্যাম্প এবং গুরুত্বপূর্ণ নোটিশসমূহ জানুন।' },
  'news.viewAll': { en: 'View All News & Notices', bn: 'সকল সংবাদ ও নোটিশ দেখুন' },
  'news.readMore': { en: 'Read Full Article', bn: 'বিস্তারিত পড়ুন' },

  // Testimonials
  'test.badge': { en: 'PATIENT EXPERIENCES', bn: 'রোগীদের প্রতিক্রিয়া' },
  'test.title': { en: 'What Our Patients Say About Us', bn: 'আমাদের সেবা সম্পর্কে রোগীদের মূল্যবান মন্তব্য' },
  'test.desc': { en: 'Real experiences from patients and families who received care at Al Insaf General Hospital.', bn: 'আল ইনসাফ হাসপাতালে চিকিৎসা গ্রহণকারী সম্মানিত রোগী ও তাদের পরিবারের বাস্তব অভিজ্ঞতা।' },

  // Doctors & Staff Page
  'doc.pageTitle': { en: 'Our Specialist Doctors', bn: 'আমাদের বিশেষজ্ঞ ডাক্তারবৃন্দ' },
  'doc.pageDesc': { en: 'Find highly experienced professors, consultants, and surgeons across all medical departments.', bn: 'সকল বিভাগের অভিজ্ঞ অধ্যাপক, কনসালটেন্ট এবং সার্জনদের তালিকা ও সময়সূচী দেখুন।' },
  'doc.searchPlaceholder': { en: 'Search doctor by name, specialty, or qualification...', bn: 'ডাক্তারের নাম, বিভাগ বা ডিগ্রি দিয়ে খুঁজুন...' },
  'doc.allDepts': { en: 'All Departments', bn: 'সকল বিভাগ' },
  'doc.fee': { en: 'Consultation Fee', bn: 'ভিজিট ফি' },
  'doc.room': { en: 'Room', bn: 'রুম' },
  'doc.visitingHours': { en: 'Visiting Hours', bn: 'রোগী দেখার সময়' },
  'doc.bookAppointment': { en: 'Book Appointment', bn: 'সিরিয়াল নিন' },
  'doc.noDoctors': { en: 'No doctors found matching your filter criteria.', bn: 'আপনার অনুসন্ধানের সাথে মিলিয়ে কোনো ডাক্তার পাওয়া যায়নি।' },

  // Staff Page
  'staff.pageTitle': { en: 'Hospital Staff & Management Directory', bn: 'হাসপাতাল কর্মকর্তা ও কর্মচারী ডিরেক্টরি' },
  'staff.pageDesc': { en: 'Meet our dedicated administration, nursing, laboratory, pharmacy, and hospital staff members.', bn: 'হাসপাতাল পরিচালনা, নার্সিং, ল্যাবরেটরি ও ফার্মেসির নিবেদিতপ্রাণ কর্মকর্তা-কর্মচারীদের তালিকা।' },

  // Common Actions
  'action.back': { en: 'Back', bn: 'পিছনে' },
  'action.view': { en: 'View Details', bn: 'বিস্তারিত দেখুন' },
  'action.submit': { en: 'Submit', bn: 'জমা দিন' },
  'action.loading': { en: 'Loading...', bn: 'লোড হচ্ছে...' },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('aigh_language') as Language;
      if (savedLang === 'en' || savedLang === 'bn') {
        setLanguageState(savedLang);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Synchronize document lang attribute & body classes with selected language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      if (language === 'bn') {
        document.documentElement.classList.add('lang-bn');
        document.documentElement.classList.remove('lang-en');
      } else {
        document.documentElement.classList.add('lang-en');
        document.documentElement.classList.remove('lang-bn');
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('aigh_language', lang);
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'bn' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string, defaultText?: string): string => {
    const entry = translations[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
