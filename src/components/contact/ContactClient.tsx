'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Building,
  HeartPulse,
  Truck
} from 'lucide-react';
import PageHeaderBanner from '@/components/layout/PageHeaderBanner';
import { INITIAL_DEPARTMENTS } from '@/lib/seed-data';
import { HOSPITAL_CONFIG } from '@/lib/constants';

export default function ContactClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('General Hospital Inquiry');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          department,
          message,
          website_url: honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Glossy Header Banner */}
      <PageHeaderBanner
        badge="24/7 Helpline & Location"
        badgeBn="২৪/৭ হেল্পলাইন ও লোকেশন"
        title="Contact & Location Map"
        titleBn="যোগাযোগ ও হাসপাতালের অবস্থান"
        description="Reach out to our patient care desk or visit our hospital complex at Dewanganj Bazar, Jamalpur."
        descriptionBn="রোগী সহায়তা ডেস্কে যোগাযোগ করুন অথবা দেওয়ানগঞ্জ বাজার, জামালপুরে আমাদের হাসপাতালে আসুন।"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* 3 Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Hospital Hotlines</h3>
            <p className="text-xs text-slate-500">24/7 Emergency & OPD Serial Desk</p>
            <div className="pt-2 space-y-1 text-sm font-semibold text-slate-800">
              <div>Hotline: <a href={`tel:${HOSPITAL_CONFIG.phoneRaw}`} className="text-emerald-700 font-bold">{HOSPITAL_CONFIG.phone}</a></div>
              <div>Serial / Info: <a href={`tel:${HOSPITAL_CONFIG.phoneAltRaw}`} className="text-emerald-700 font-bold">{HOSPITAL_CONFIG.phoneAlt}</a></div>
              <div>Emergency: <a href={`tel:${HOSPITAL_CONFIG.emergencyPhoneRaw}`} className="text-emerald-700 font-bold">{HOSPITAL_CONFIG.emergencyPhone}</a></div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Email & Inquiries</h3>
            <p className="text-xs text-slate-500">Official hospital communications</p>
            <div className="pt-2 space-y-1 text-sm font-semibold text-slate-800">
              <div>Email: <a href={`mailto:${HOSPITAL_CONFIG.email}`} className="text-blue-700">{HOSPITAL_CONFIG.email}</a></div>
              <div>Appointments: <a href={`mailto:${HOSPITAL_CONFIG.email}`} className="text-blue-700">{HOSPITAL_CONFIG.email}</a></div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Hospital Address</h3>
            <p className="text-xs text-slate-500">Beside Govt. High School Gate</p>
            <p className="pt-2 text-sm text-slate-700 leading-relaxed font-medium">
              {HOSPITAL_CONFIG.addressEn}
            </p>
          </div>
        </div>

        {/* Contact Form & Google Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div id="inquiry" className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Send an Online Inquiry</h2>
              <p className="text-xs text-slate-500 mt-1">
                Have questions about treatments, tests, or admission? Fill out the form below.
              </p>
            </div>

            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800 font-semibold">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <span>Thank you! Your inquiry has been received. Our team will contact you shortly.</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-xs text-rose-800 font-semibold">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-bot Honeypot field */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Relevant Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="General Hospital Inquiry">General Hospital Inquiry</option>
                    <option value="ICU / Emergency Admission">ICU / Emergency Admission</option>
                    <option value="Diagnostics & Lab Tests">Diagnostics & Lab Tests</option>
                    <option value="Doctor Serial Desk">Doctor Serial Desk</option>
                    <option value="Billing & Rates">Billing & Rates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Subject of your message"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Message / Query *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Query...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Map & Direction Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Hospital Location Map</h3>
                <a
                  href={HOSPITAL_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <span className="ml-1">↗</span>
                </a>
              </div>
              <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <iframe
                  title="Al Insaf General Hospital Location"
                  src={HOSPITAL_CONFIG.mapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Landmark:</strong> {HOSPITAL_CONFIG.addressEn}</p>
                <p><strong>Parking:</strong> Patient vehicle & ambulance parking available 24/7.</p>
              </div>
            </div>

            <div className="bg-[#384349] p-6 rounded-3xl text-white space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase">
                <Truck className="w-4 h-4" />
                <span>24/7 Mobile ICU Ambulance</span>
              </div>
              <h4 className="text-lg font-black">Need Urgent Patient Transport?</h4>
              <p className="text-xs text-slate-300">
                Our emergency ambulance and medical team can be dispatched across Dewanganj, Jamalpur, and surrounding areas promptly.
              </p>
              <a
                href={`tel:${HOSPITAL_CONFIG.emergencyPhoneRaw}`}
                className="inline-block w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl transition-all shadow-md"
              >
                Call Ambulance: {HOSPITAL_CONFIG.emergencyPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
