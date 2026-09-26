'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Printer,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  ArrowRight
} from 'lucide-react';
import PageHeaderBanner from '@/components/layout/PageHeaderBanner';
import { INITIAL_DEPARTMENTS, INITIAL_DOCTORS } from '@/lib/seed-data';
import { HOSPITAL_CONFIG } from '@/lib/constants';

function AppointmentContent() {
  const searchParams = useSearchParams();
  const preselectedDoctor = searchParams?.get('doctor') || '';
  const preselectedDept = searchParams?.get('department') || '';

  const [department, setDepartment] = useState(preselectedDept || INITIAL_DEPARTMENTS[0].name);
  const [doctorName, setDoctorName] = useState(preselectedDoctor || '');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Evening (5:00 PM - 8:00 PM)');
  const [symptoms, setSymptoms] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot field

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<any>(null);

  // Available doctors filtered by department
  const availableDoctors = INITIAL_DOCTORS.filter(
    (doc) => doc.department.toLowerCase() === department.toLowerCase() || doc.department.includes(department)
  );

  // Auto-select first doctor when department changes if current doctor isn't in it
  useEffect(() => {
    if (availableDoctors.length > 0 && (!doctorName || !availableDoctors.some((d) => d.name === doctorName))) {
      setDoctorName(availableDoctors[0].name);
    }
  }, [department]);

  // If preselectedDoctor passed, set it
  useEffect(() => {
    if (preselectedDoctor) {
      setDoctorName(preselectedDoctor);
      const match = INITIAL_DOCTORS.find((d) => d.name === preselectedDoctor);
      if (match) {
        setDepartment(match.department);
      }
    }
  }, [preselectedDoctor]);

  const selectedDoctorObj = INITIAL_DOCTORS.find((d) => d.name === doctorName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientPhone,
          patientEmail,
          patientAge: Number(patientAge),
          patientGender,
          department,
          doctorId: selectedDoctorObj?._id || selectedDoctorObj?.slug || 'doc-default',
          doctorName: doctorName || 'Senior Consultant On-Duty',
          appointmentDate,
          preferredTimeSlot,
          symptoms,
          website_url: honeypot, // honeypot
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit appointment request.');
      }

      setConfirmedAppointment(data.appointment);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {confirmedAppointment ? (
        /* Confirmation Receipt Card */
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-primary-500 shadow-2xl space-y-6 animate-fadeIn">
          <div className="text-center space-y-2 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs">
              <CheckCircle className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full">
              Appointment Serial Confirmed
            </span>
            <div className="pt-2">
              <div className="inline-flex flex-col items-center justify-center px-6 py-2.5 bg-gradient-to-r from-primary-900 to-emerald-900 text-white rounded-2xl shadow-md my-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">Your Serial Number</span>
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  #{String(confirmedAppointment.serialNumber || 1).padStart(2, '0')}
                </span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Tracking ID: {confirmedAppointment.trackingId}
            </h2>
            <p className="text-xs text-slate-500">
              An SMS confirmation with Serial #{confirmedAppointment.serialNumber || 1} has been sent to {confirmedAppointment.patientPhone}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-xs">Patient Name:</span>
              <strong className="text-slate-900 text-base">{confirmedAppointment.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Specialist Doctor:</span>
              <strong className="text-primary-700 text-base">{confirmedAppointment.doctorName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Department:</span>
              <strong className="text-slate-900">{confirmedAppointment.department}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Scheduled Date:</span>
              <strong className="text-slate-900">{confirmedAppointment.appointmentDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Preferred Slot:</span>
              <strong className="text-slate-900">{confirmedAppointment.preferredTimeSlot}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Status:</span>
              <span className="inline-block font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                {confirmedAppointment.status}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 space-y-1">
            <strong className="block font-bold">Important Instructions:</strong>
            <p>• Please report to the hospital OPD reception 15 minutes before your scheduled appointment time.</p>
            <p>• Bring previous medical reports, prescriptions, and identity document.</p>
            <p>• For urgent modifications or cancellation, call hotline: <strong>{HOSPITAL_CONFIG.phone}</strong>.</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Confirmation Slip
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmedAppointment(null);
                setPatientName('');
                setPatientPhone('');
                setSymptoms('');
              }}
              className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl shadow"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Booking Form */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-black text-slate-900">
              Patient & Appointment Details
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Fill in the details below. Our OPD desk will reserve your serial with the specialist.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-xs text-rose-700 font-semibold">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden Honeypot Field for Spambots */}
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            {/* Step 1: Department & Doctor Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Speciality / Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {INITIAL_DEPARTMENTS.map((d, i) => (
                    <option key={i} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Specialist Doctor *
                </label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {availableDoctors.length > 0 ? (
                    availableDoctors.map((doc, i) => (
                      <option key={i} value={doc.name}>
                        {doc.name} ({doc.designation})
                      </option>
                    ))
                  ) : (
                    <option value="General Specialist On-Duty">Senior Consultant (On-Duty)</option>
                  )}
                </select>
              </div>
            </div>

            {/* Selected Doctor Summary Card */}
            {selectedDoctorObj && (
              <div className="bg-primary-50/70 border border-primary-100 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedDoctorObj.imageUrl}
                    alt={`${selectedDoctorObj.name} - ${selectedDoctorObj.specialty}`}
                    className="w-12 h-12 rounded-xl object-cover border border-primary-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{selectedDoctorObj.name}</div>
                    <div className="text-[11px] text-slate-600">
                      Chamber: {selectedDoctorObj.roomNumber} • {selectedDoctorObj.visitingHours}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Fee</div>
                  <div className="text-xs font-black text-primary-700">৳{selectedDoctorObj.consultationFee}</div>
                </div>
              </div>
            )}

            {/* Step 2: Date & Slot Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred Time Shift *
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                  <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                  <option value="Evening (05:00 PM - 09:00 PM)">Evening (05:00 PM - 09:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Step 3: Patient Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter patient's name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 01711-XXXXXX"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="patient@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Patient Age (Years) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 35"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Gender *
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Symptoms or Health Concern
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe your symptoms or reason for visit (e.g. chronic cough, back pain, routine follow-up)..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-black text-sm rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <span>Processing Appointment Request...</span>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Confirm Appointment Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AppointmentsClient() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Glossy Header Banner */}
      <PageHeaderBanner
        badge="Online Serial & Consultation"
        badgeBn="অনলাইন সিরিয়াল ও অ্যাপয়েন্টমেন্ট"
        title="Book Doctor Appointment"
        titleBn="ডাক্তারের অ্যাপয়েন্টমেন্ট বুকিং"
        description="Instant booking confirmation with senior consultants and hospital specialists."
        descriptionBn="সহজেই ঘরে বসে অভিজ্ঞ কনসালটেন্ট ও বিশেষজ্ঞ ডাক্তারের সিরিয়াল নিশ্চিত করুন।"
      />

      <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Appointment Booking Form...</div>}>
        <AppointmentContent />
      </Suspense>
    </div>
  );
}
