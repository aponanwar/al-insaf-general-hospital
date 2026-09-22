import Link from 'next/link';
import {
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Calendar
} from 'lucide-react';
import PageHeaderBanner from '@/components/layout/PageHeaderBanner';

export const metadata = {
  title: 'Admission & Payment Guide | Al Insaf General Hospital Ltd.',
  description: 'Comprehensive patient guide on hospital admission procedures, required documents, advance payment policies, and discharge guidelines.',
};

export default function AdmissionGuidePage() {
  const steps = [
    {
      step: '01',
      title: 'Doctor Recommendation & Admission Order',
      desc: 'Admission begins with an official admission advice issued by a hospital consultant from the Emergency Department or OPD chamber.',
    },
    {
      step: '02',
      title: 'Registration & Bed Selection Desk',
      desc: 'Visit the 24/7 Inpatient Admission Desk on the Ground Floor. Choose your preferred accommodation (VIP Cabin, Single AC, Double Sharing, or General Ward).',
    },
    {
      step: '03',
      title: 'Initial Deposit & Documentation',
      desc: 'Submit patient ID/NID copy, complete the admission agreement form, and deposit the initial advance payment according to the chosen bed category.',
    },
    {
      step: '04',
      title: 'Transfer to Ward / Cabin & Nurse Handover',
      desc: 'Our customer care officer accompanies the patient directly to the assigned room and hands over medical records to the floor nursing station.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Glossy Header Banner */}
      <PageHeaderBanner
        badge="Patient Support & Guidelines"
        badgeBn="রোগী সহায়তা ও নির্দেশিকা"
        title="Admission & Payment Guide"
        titleBn="হাসপাতাল ভর্তি ও পেমেন্ট নির্দেশিকা"
        description="Everything you need to know about inpatient admission, payment options, visitor rules, and discharge formalities."
        descriptionBn="হাসপাতালে ভর্তি প্রক্রিয়া, বিল পরিশোধের নিয়মাবলী, ভিজিটর শিডিউল ও ছাড়পত্র সম্পর্কিত তথ্যাবলী।"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Step by Step Admission Flow */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Admission Process in 4 Simple Steps
            </h2>
            <p className="text-xs text-slate-500 mt-1">Our customer care staff is available 24 hours at the ground floor admission lobby.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents & Payment Modes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <FileText className="w-5 h-5 text-primary-600 mr-2" />
              Documents to Bring for Admission
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Doctor&apos;s written admission advice slip or emergency prescription</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Patient&apos;s National ID / Passport / Birth Certificate copy</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Previous medical investigation reports, ECG, and imaging films</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Corporate insurance card / employee ID (if corporate coverage applies)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <CreditCard className="w-5 h-5 text-primary-600 mr-2" />
              Accepted Payment Methods & Billing
            </h3>
            <p className="text-xs text-slate-600">
              We accept all major cashless digital payments as well as physical cash at our 24/7 billing counters.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-800 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                Visa / MasterCard / AMEX
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                bKash / Nagad / Rocket
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                Bank Transfer / Cheque
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                Cash at Billing Desk
              </div>
            </div>
          </div>
        </div>

        {/* Visiting Hours & Rules */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 space-y-3 text-amber-900 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 text-base font-bold">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span>Visiting Hours & Attendant Protocol</span>
          </div>
          <p>
            • Inpatient general visiting hours are daily from <strong>04:30 PM to 07:00 PM</strong>.
          </p>
          <p>
            • Only <strong>one attendant</strong> with the official hospital attendant pass is permitted to stay with the patient overnight in cabins/wards.
          </p>
          <p>
            • For critical care ICU/CCU, visiting is restricted to 10 minutes between 05:00 PM - 06:00 PM for close family members only.
          </p>
        </div>
      </div>
    </div>
  );
}
