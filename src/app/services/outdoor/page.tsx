import Link from 'next/link';
import { Stethoscope, Clock, Calendar, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '@/lib/seed-data';

export const metadata = {
  title: 'Outdoor & OPD Consultation Services | Al Insaf General Hospital Ltd.',
  description: 'Explore our specialized outpatient department (OPD) consultation clinics, diagnostic testing, and visiting schedules.',
};

export default function OutdoorServicesPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="bg-[#384349] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Outpatient Department (OPD)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-3">
            Outdoor Consultation & Diagnostics
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
            Convenient consultation shifts from morning to late night with country&apos;s leading medical specialists.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Schedule & Operational Hours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Morning Shift</h3>
            <p className="text-xs text-slate-600">09:00 AM to 02:00 PM (Saturday - Thursday)</p>
            <p className="text-xs text-slate-500">General OPD consultations, pathology sample collection, and routine imaging.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Evening Shift</h3>
            <p className="text-xs text-slate-600">04:00 PM to 09:30 PM (Saturday - Thursday)</p>
            <p className="text-xs text-slate-500">Super-specialist consultant chambers, endoscopic procedures, and follow-ups.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">24/7 Emergency OPD</h3>
            <p className="text-xs text-slate-600">Open 24 Hours • 365 Days a Year</p>
            <p className="text-xs text-slate-500">Casualty trauma care, acute chest pain, nebulization, and urgent dressing.</p>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900">OPD Specialty Clinics</h3>
              <p className="text-xs text-slate-500">Consult with specialists in any of the following 24+ branches</p>
            </div>
            <Link
              href="/appointments"
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow inline-flex items-center"
            >
              <Calendar className="w-4 h-4 mr-1.5" />
              Book OPD Serial
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_DEPARTMENTS.map((dept) => (
              <Link
                key={dept.slug}
                href={`/specialities/${dept.slug}`}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-500 hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-primary-500 group-hover:scale-125 transition-transform" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-primary-700">{dept.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
