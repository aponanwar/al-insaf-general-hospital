import Link from "next/link";
import {
  HeartPulse,
  Activity,
  BedDouble,
  ShieldCheck,
  Zap,
  Droplet,
  Truck,
  Building,
  CheckCircle,
} from "lucide-react";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import type { Metadata } from 'next';
import { HOSPITAL_CONFIG } from '@/lib/constants';

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://alinsafhospital.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Hospital Facilities, Modern ICU, Modular OT & Diagnostic Labs | Al Insaf General Hospital',
  description:
    'Advanced healthcare infrastructure at Al Insaf General Hospital, Dewanganj. Featuring modern ICU/HDU, CCU, Level-3 NICU, Modular Operation Theaters, 24/7 Ambulance, and Digital Diagnostic Labs.',
  keywords: [
    'ICU Facilities Dewanganj',
    'Operation Theater Dewanganj',
    'NICU Child Care Jamalpur',
    'Ambulance Service Dewanganj',
    'Diagnostic Pathology Dewanganj',
    'হাসপাতাল সুযোগ সুবিধা দেওয়ানগঞ্জ',
  ],
  alternates: {
    canonical: '/services/facilities',
  },
  openGraph: {
    title: 'Hospital Facilities & Infrastructure | Al Insaf General Hospital',
    description:
      'Explore our modern ICU, CCU, NICU, Operation Theaters, and 24/7 Ambulance services in Dewanganj, Jamalpur.',
    url: `${baseUrl}/services/facilities`,
    images: [
      {
        url: `${baseUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Hospital Facilities at Al Insaf General Hospital',
      },
    ],
  },
};

const facilitiesSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: 'Hospital Facilities & Critical Care Infrastructure',
  description: 'Critical care units, operation theaters, and diagnostic infrastructure at Al Insaf General Hospital.',
  url: `${baseUrl}/services/facilities`,
  provider: {
    '@type': 'Hospital',
    name: HOSPITAL_CONFIG.nameEn,
    telephone: HOSPITAL_CONFIG.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: HOSPITAL_CONFIG.addressEn,
      addressLocality: 'Dewanganj',
      addressRegion: 'Jamalpur',
      addressCountry: 'BD',
    },
  },
};

export default function FacilitiesPage() {
  const facilities = [
    {
      title: "50-Bed Intensive Care Unit (ICU & HDU)",
      icon: HeartPulse,
      desc: "Equipped with Servo-i mechanical ventilators, continuous hemodynamic monitors, central oxygen, arterial blood gas (ABG) machines, and round-the-clock critical care intensivists.",
      points: [
        "1:1 Nursing Care",
        "Bedside Hemodialysis (CRRT)",
        "Isolation ICU for severe infections",
      ],
    },
    {
      title: "Coronary Care Unit (CCU & Cardiac ICU)",
      icon: Activity,
      desc: "Dedicated unit for acute myocardial infarction (heart attack), cardiac arrhythmias, and post-angioplasty stabilization.",
      points: [
        "Continuous ECG Arrhythmia Detection",
        "Defibrillators & Temporary Pacemaker",
        "24/7 Cardiac Emergency Team",
      ],
    },
    {
      title: "Neonatal & Pediatric ICU (NICU & PICU)",
      icon: BedDouble,
      desc: "Level-3 neonatal intensive care with infant incubators, phototherapy, total parenteral nutrition (TPN), and pediatric mechanical ventilators.",
      points: [
        "High-Frequency Oscillatory Ventilation",
        "Surfactant Therapy",
        "24/7 Neonatologist on duty",
      ],
    },
    {
      title: "Hemodialysis & Renal Care Center",
      icon: Droplet,
      desc: "30-station modern dialysis unit powered by advanced reverse osmosis water purification, offering routine, emergency, and infected-station dialysis.",
      points: [
        "Double-pass RO water filtration",
        "Isolated stations for HBsAg/HCV",
        "Emergency bedside dialysis in ICU",
      ],
    },
    {
      title: "Modular Laminar Flow Operation Theatres",
      icon: ShieldCheck,
      desc: "State-of-the-art OT suites with HEPA air filters, positive pressure, endoscopic 4K towers, and C-Arm fluoroscopy for orthopedic & neuro-surgery.",
      points: [
        "Class 1000 sterile airflow",
        "Laser surgical proctology & urology",
        "Micro-neurosurgical microscope",
      ],
    },
    {
      title: "24/7 Casualty, Ambulance & Blood Bank",
      icon: Truck,
      desc: "Rapid medical response fleet with mobile ICU ambulances, life-support monitors, emergency resuscitation bays, and full component blood transfusion center.",
      points: [
        "AC ICU Ambulances with Ventilators",
        "Component separation (PRBC, FFP, Platelets)",
        "Direct ER trauma bay access",
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(facilitiesSchema) }}
      />
      {/* Glossy Header Banner */}
      <PageHeaderBanner
        badge="High-Tech Infrastructure"
        badgeBn="অত্যাধুনিক অবকাঠামো ও প্রযুক্তি"
        title="In-Patient Facilities & Critical Care"
        titleBn="ইন-পেশেন্ট সুবিধা ও ক্রিটিক্যাল কেয়ার"
        description="Cutting-edge medical technology, modern life support systems, and patient-centered amenities."
        descriptionBn="৫০ শয্যার আইসিইউ, সিসিইউ, এনআইসিইউ, আধুনিক অপারেশন থিয়েটার ও ডায়ালাইসিস সেবা।"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fac.desc}
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {fac.points.map((p, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center text-xs text-slate-700"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/contact-us"
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center"
                  >
                    <span>Inquire About Facility</span>
                    <span className="ml-1">&rarr;</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
