'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, CheckCircle2, Shield, Clock, Award, Users } from 'lucide-react';

const ACCORDION_ITEMS = [
  {
    id: 1,
    title: 'More Experience & Clinical Excellence',
    content:
      'In the healthcare sector, service excellence is the hallmark of Al Insaf General Hospital. With decades of institutional legacy, our clinicians and nursing workforce maintain committed adherence to international medical guidelines.',
    icon: Award,
  },
  {
    id: 2,
    title: 'The Right Answers & Diagnostics Precision',
    content:
      'Al Insaf General Hospital aims to provide unparalleled clinical accuracy to the people of Bangladesh. Powered by high-speed 128-slice CT, 1.5 Tesla MRI, and automated 5-part hematology labs, we eliminate guesswork and ensure precise diagnoses.',
    icon: CheckCircle2,
  },
  {
    id: 3,
    title: 'Seamless 24/7 Continuum of Care',
    content:
      'Our outpatient specialist clinics run conveniently from morning through late evening. Meanwhile, our Casualty Trauma Center, Emergency Medicine Department, Blood Bank, and Intensive Care Units operate 24/7 round the clock 365 days a year.',
    icon: Clock,
  },
  {
    id: 4,
    title: 'Unparalleled Medical & Surgical Expertise',
    content:
      'Over 200+ senior professors, fellows, and surgeons across 24+ super-specialized wings offer comprehensive inpatient and outpatient treatments, including minimally invasive laparoscopic surgery, joint replacement, and neuro-interventions.',
    icon: Users,
  },
];

export default function WhyChooseUs() {
  const [openId, setOpenId] = useState<number>(1);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? 0 : id);
  };

  return (
    <section className="bg-slate-100 py-16 lg:py-24 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hospital Image with Overlays */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
                alt="Hospital ICU and Diagnostic Excellence"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
                  Advanced Critical Care
                </span>
                <h4 className="text-lg font-bold mt-2">50-Bed ICU, CCU & NICU Infrastructure</h4>
                <p className="text-xs text-slate-300">Equipped with Servo mechanical ventilators and 1:1 nurse-to-patient ratio.</p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3 hidden sm:flex">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900">500+ Beds</div>
                <div className="text-xs text-slate-500 font-medium">Tertiary Healthcare Provider</div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                Why Patients Trust Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Committed to Quality, <br />
                <span className="text-primary-600">Uncompromising Perfection</span>
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Discover why over 30,000+ patients choose Al Insaf General Hospital for their diagnosis and clinical treatments every year.
              </p>
            </div>

            <div className="space-y-3">
              {ACCORDION_ITEMS.map((item) => {
                const isOpen = openId === item.id;
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-white border-primary-500 shadow-md ring-1 ring-primary-500/20'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.id)}
                      className="w-full flex items-center justify-between p-5 text-left transition-colors"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                            isOpen
                              ? 'bg-primary-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-base font-bold text-slate-900">
                          {item.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-primary-600' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
