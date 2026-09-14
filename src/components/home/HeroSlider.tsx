'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Welcome to Al Insaf General Hospital',
    subtitle: 'An Advanced Center for Medical Services & Diagnostics',
    description: 'A 500+ bed tertiary hospital delivering excellence, compassionate care, and state-of-the-art medical technology in Bangladesh.',
    ctaText: 'Explore Specialties',
    ctaLink: '/specialities',
    secondaryCtaText: 'Book Appointment',
    secondaryCtaLink: '/appointments',
    bgImage: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1600',
    badge: 'Tertiary Care Hospital',
  },
  {
    id: 2,
    title: 'Trusted Health Partner for Life',
    subtitle: 'Advanced Medicine • Compassionate Care',
    description: 'Over 200+ renowned professors, senior consultants, and surgeons across 24+ specialized clinical disciplines.',
    ctaText: 'Find Your Doctor',
    ctaLink: '/doctors',
    secondaryCtaText: 'View Rate Charts',
    secondaryCtaLink: '/patient-guide/rates',
    bgImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1600',
    badge: '200+ Specialist Doctors',
  },
  {
    id: 3,
    title: 'Casualty, Accident & 24/7 Emergency Care',
    subtitle: 'Immediate Multi-Disciplinary Critical Response',
    description: 'Dedicated Trauma Center, 50-bed modern ICU/CCU/NICU, in-house pharmacy, and 24/7 cardiac emergency unit.',
    ctaText: 'Emergency Services',
    ctaLink: '/services/facilities',
    secondaryCtaText: 'Contact Hospital',
    secondaryCtaLink: '/contact-us',
    bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600',
    badge: '24/7 Emergency & ICU',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] overflow-hidden bg-slate-900">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background image with dual gradient overlays */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-7000 scale-105"
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/40" />

          {/* Slide Content */}
          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl text-white space-y-5 animate-fadeIn">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-300 backdrop-blur-md">
                <HeartPulse className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>{slide.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                {slide.title}
              </h1>

              <p className="text-base sm:text-lg text-emerald-200 font-medium">
                {slide.subtitle}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-lg shadow-emerald-900/40 transition-all hover:scale-105"
                >
                  {slide.ctaText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  href={slide.secondaryCtaLink}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-100 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-md transition-all hover:scale-105"
                >
                  <Calendar className="w-4 h-4 mr-2 text-primary-300" />
                  {slide.secondaryCtaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-all"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-all"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-primary-400' : 'w-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
