import Link from 'next/link';
import { ShieldCheck, Droplet, CheckCircle2, Phone, Calendar, Clock, Heart } from 'lucide-react';
import PageHeaderBanner from '@/components/layout/PageHeaderBanner';

export const metadata = {
  title: 'Vaccination Centre & Blood Bank | Al Insaf General Hospital Ltd.',
  description: 'Comprehensive immunization schedules for infants, children, adults, travelers, and 24/7 blood bank transfusion services.',
};

export default function VaccinationPage() {
  const vaccines = [
    { name: 'EPI Routine Vaccines (BCG, Pentavalent, Polio, PCV, MR)', target: 'Infants & Children (0-2 Years)' },
    { name: 'Hepatitis B & Hepatitis A Adult Vaccine', target: 'Adults, Healthcare Workers & Travelers' },
    { name: 'HPV (Human Papillomavirus) Cervical Cancer Vaccine', target: 'Adolescents & Women (9-26 Years)' },
    { name: 'Influenza (Flu Shot) Annual Booster', target: 'Elderly, Asthmatic & Chronic Patients' },
    { name: 'Typhoid Conjugate & Rabies Post-Exposure', target: 'General Public & Emergency Bite Cases' },
    { name: 'Pneumococcal (Prevnar 13 / Pneumovax 23)', target: 'Infants, Elderly & Immunocompromised' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Glossy Header Banner */}
      <PageHeaderBanner
        badge="Preventive & Transfusion Medicine"
        badgeBn="প্রতিরোধ ও ট্রান্সফিউশন মেডিসিন"
        title="Vaccination Centre & Blood Bank"
        titleBn="টিকাদান কেন্দ্র ও ব্লাড ব্যাংক"
        description="Safe immunizations for all age groups and 24/7 emergency blood transfusion services."
        descriptionBn="সকল বয়সের শিশুদের ও প্রাপ্তবয়স্কদের নিরাপদ টিকাদান এবং ২৪ ঘণ্টা জরুরি রক্ত পরিসঞ্চালন সেবা।"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Vaccination Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Hospital Immunization Centre</h2>
                <p className="text-xs text-slate-500">Maintained under strict cold chain storage (2°C to 8°C)</p>
              </div>
            </div>
            <div className="text-xs font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl">
              Open Daily: 09:00 AM - 08:00 PM
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaccines.map((v, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start space-x-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{v.name}</h4>
                  <p className="text-xs text-primary-600 font-medium mt-0.5">Target: {v.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 24/7 Blood Bank Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">24/7 Emergency Blood Bank</h2>
                <p className="text-xs text-slate-500">Licensed blood transfusion & apheresis component separation</p>
              </div>
            </div>
            <a
              href="tel:09666787800"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow inline-flex items-center self-start sm:self-auto"
            >
              <Phone className="w-4 h-4 mr-1.5" />
              Emergency Blood Desk
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-100 space-y-2">
              <h4 className="text-sm font-bold text-rose-950">Packed Red Blood Cells (PRBC)</h4>
              <p className="text-xs text-rose-800">
                Screened for HIV, HBV, HCV, Syphilis, and Malaria using automated chemiluminescence.
              </p>
            </div>

            <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-100 space-y-2">
              <h4 className="text-sm font-bold text-amber-950">Fresh Frozen Plasma (FFP)</h4>
              <p className="text-xs text-amber-800">
                Separated immediately and stored at -30°C for bleeding and clotting factor deficiencies.
              </p>
            </div>

            <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100 space-y-2">
              <h4 className="text-sm font-bold text-emerald-950">Platelet Concentrates & Apheresis</h4>
              <p className="text-xs text-emerald-800">
                Single donor platelets (SDP) and random donor platelets for dengue and oncological patients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
