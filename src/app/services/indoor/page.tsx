import Link from 'next/link';
import { BedDouble, HeartPulse, CheckCircle2, ShieldAlert, Phone, Users, Clock } from 'lucide-react';

export const metadata = {
  title: 'Indoor Medical Services | Al Insaf General Hospital Ltd.',
  description: 'Explore our 500+ beds inpatient facilities, VIP cabins, general wards, and 24/7 dedicated nursing care.',
};

export default function IndoorServicesPage() {
  const cabinTypes = [
    {
      title: 'Deluxe VIP Suite',
      price: '৳8,500 / day',
      features: ['Central AC', 'Attached Deluxe Washroom', 'Refrigerator & LED TV', 'Attendant Sofa Bed', '24/7 Priority Doctor Visit', 'Complimentary Meal for Attendant'],
    },
    {
      title: 'Single Executive AC Cabin',
      price: '৳4,500 / day',
      features: ['Air Conditioned', 'Private Bathroom', 'LED TV with Cable', 'Attendant Couch', 'Intercom & Nurse Call Button'],
    },
    {
      title: 'Double Sharing AC Cabin',
      price: '৳2,500 / day',
      features: ['Air Conditioned', 'Partition Privacy Curtain', 'Attendant Chair', '24/7 Nursing Assistance'],
    },
    {
      title: 'General Male / Female Wards',
      price: '৳1,200 / day',
      features: ['Clean Spacious Ward', 'Duty Medical Officer rounds', 'Oxygen & Suction point at every bed', 'Nutritious Inpatient Diet'],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="bg-[#384349] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            500+ Bed Inpatient Hospital
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-3">
            Indoor Medical Services
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
            Safe, comfortable, and comprehensive inpatient recovery under the supervision of leading clinical specialists.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
              Inpatient Care Excellence
            </span>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              Comfort, Compassion & Round-the-Clock Monitoring
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Our inpatient medical care ensures prompt clinical attention, continuous vital signs monitoring, and hygienic dietary management. With over 500 beds spread across specialized medical, surgical, pediatric, and gynecological floors, we provide seamless admission to discharge care.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-800">
              <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-primary-600" />
                <span>Central Medical Gas System</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-primary-600" />
                <span>Emergency Crash Carts on every floor</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
              alt="Hospital Inpatient Cabin"
              className="rounded-3xl shadow-xl border-4 border-white object-cover w-full h-[360px]"
            />
          </div>
        </div>

        {/* Cabin Types Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900">Accommodation Categories</h3>
            <p className="text-xs text-slate-500 mt-1">Select from our range of comfortable patient cabins and recovery wards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cabinTypes.map((cabin, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{cabin.title}</h4>
                  <div className="text-sm font-black text-primary-700 mt-1">{cabin.price}</div>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    {cabin.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-start text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/patient-guide/admission"
                    className="w-full inline-flex items-center justify-center py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    Admission Guide
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
