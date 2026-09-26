import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INITIAL_DEPARTMENTS, INITIAL_DOCTORS } from '@/lib/seed-data';
import {
  HeartPulse,
  CheckCircle,
  Calendar,
  Phone,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

import type { Metadata } from 'next';
import { HOSPITAL_CONFIG } from '@/lib/constants';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return INITIAL_DEPARTMENTS.map((dept) => ({
    slug: dept.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const department = INITIAL_DEPARTMENTS.find((d) => d.slug === params.slug);
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://alinsafhospital.com').replace(/\/$/, '');

  if (!department) {
    return {
      title: 'Department Not Found | Al Insaf General Hospital',
    };
  }

  return {
    title: `${department.name} | Al Insaf General Hospital Dewanganj`,
    description: department.shortDescription || `${department.name} department at Al Insaf General Hospital, Dewanganj, Jamalpur. Expert doctors, modern clinical facilities, and treatments.`,
    keywords: [
      department.name,
      `${department.name} Dewanganj`,
      `${department.name} Doctor Jamalpur`,
      'Al Insaf Hospital Speciality',
      'Dewanganj Hospital Clinical Wings',
    ],
    alternates: {
      canonical: `/specialities/${department.slug}`,
    },
    openGraph: {
      title: `${department.name} | Al Insaf General Hospital`,
      description: department.shortDescription,
      url: `${baseUrl}/specialities/${department.slug}`,
      images: [
        {
          url: department.imageUrl || `${baseUrl}/images/logo.png`,
          width: 800,
          height: 600,
          alt: department.name,
        },
      ],
    },
  };
}

export default function DepartmentDetailPage({ params }: Props) {
  const department = INITIAL_DEPARTMENTS.find((d) => d.slug === params.slug);
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://alinsafhospital.com').replace(/\/$/, '');

  if (!department) {
    notFound();
  }

  // Find doctors belonging to this department
  const relatedDoctors = INITIAL_DOCTORS.filter(
    (doc) => doc.departmentSlug === department.slug || doc.department.includes(department.name)
  );

  const deptSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalSpecialty',
        name: department.name,
        description: department.fullDescription || department.shortDescription,
        url: `${baseUrl}/specialities/${department.slug}`,
        provider: {
          '@type': 'Hospital',
          name: HOSPITAL_CONFIG.nameEn,
          address: {
            '@type': 'PostalAddress',
            streetAddress: HOSPITAL_CONFIG.addressEn,
            addressLocality: 'Dewanganj',
            addressRegion: 'Jamalpur',
            addressCountry: 'BD',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Specialities',
            item: `${baseUrl}/specialities`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: department.name,
            item: `${baseUrl}/specialities/${department.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deptSchema) }}
      />
      {/* Glossy Header Banner */}
      <div className="relative bg-gradient-to-b from-[#2a3338] via-[#384349] to-[#232a2e] text-white py-14 sm:py-16 overflow-hidden border-b border-slate-700/60 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[650px] h-48 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/specialities" className="hover:text-white transition-colors">Specialities</Link>
                <span>/</span>
                <span className="text-emerald-400 font-semibold">{department.name}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow-sm">
                {department.name}
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {department.shortDescription}
              </p>
            </div>

            <Link
              href={`/appointments?department=${encodeURIComponent(department.name)}`}
              className="inline-flex items-center justify-center px-6 py-3.5 bg-primary-600 hover:bg-primary-500 font-bold text-sm text-white rounded-xl shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Department Specialist
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Overview & Facilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Clinical Overview & Services</h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {department.fullDescription}
            </p>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 text-primary-600 mr-2" />
                Specialized Diagnostic & Treatment Facilities:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {department.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Contact & Head Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Department Leadership
              </h3>
              {department.headOfDepartment && (
                <div className="flex items-center space-x-3 bg-primary-50 p-4 rounded-2xl border border-primary-100">
                  <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                    Dr
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary-900">{department.headOfDepartment}</div>
                    <div className="text-[11px] text-primary-700">Head of Department</div>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-primary-600" />
                  <span>OPD Desk: 01303-359905</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>Consultation: Saturday - Thursday</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>Al Insaf General Hospital, Dewanganj, Jamalpur</span>
                </div>
              </div>
            </div>

            <div className="bg-[#384349] p-6 rounded-3xl text-white space-y-3">
              <h4 className="text-base font-bold">Need Emergency Inpatient Admission?</h4>
              <p className="text-xs text-slate-300">
                Direct ICU/Ward admission desk is available 24 hours round the clock.
              </p>
              <a
                href="tel:01303359905"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl transition-all"
              >
                Call Hospital Hotline: 01303-359905
              </a>

            </div>
          </div>
        </div>

        {/* Specialists in this department */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Consulting Specialists in {department.name}
              </h2>
              <p className="text-xs text-slate-500">
                Senior professors, consultants, and surgeons available for appointments.
              </p>
            </div>
          </div>

          {relatedDoctors.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">
                Consultants for this department are available daily at OPD.
              </p>
              <Link
                href="/doctors"
                className="mt-3 inline-flex items-center text-xs font-bold text-primary-600 hover:underline"
              >
                <span>Browse All Hospital Doctors</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDoctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-primary-500 flex-shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                      <p className="text-xs text-primary-600 font-medium">{doc.designation}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{doc.qualifications}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 text-slate-400 mr-2" />
                      <span>{doc.visitingHours}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mr-2" />
                      <span>{doc.roomNumber}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Fee: ৳{doc.consultationFee}
                    </span>
                    <Link
                      href={`/appointments?doctor=${encodeURIComponent(doc.name)}&department=${encodeURIComponent(department.name)}`}
                      className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg shadow transition-all"
                    >
                      Book Doctor
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
