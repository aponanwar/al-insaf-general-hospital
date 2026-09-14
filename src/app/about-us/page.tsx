import Link from 'next/link';
import { Building2, Award, Users, CheckCircle, ShieldCheck, HeartPulse, Sparkles, MapPin } from 'lucide-react';

export const metadata = {
  title: 'About Us | Al Insaf General Hospital Ltd. (AIGH)',
  description: 'Learn about Al Insaf General Hospital, our mission, vision, management team, and modern healthcare facilities in Dhaka.',
};

export default function AboutUsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#384349] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            About Al Insaf Hospital
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-4">
            At a Glance
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Dedicated workforce with committed adherence to quality and uncompromising perfection.
          </p>
          <div className="flex justify-center items-center space-x-2 text-xs text-slate-400 mt-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-emerald-400">About Us</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Intro Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              We are Al Insaf General Hospital
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Al Insaf General Hospital is a 500+ beds care hospital and the leading contributor of private healthcare services in Bangladesh. This has been achieved through consistent commitment to improving the lives of people through utmost service excellence since our inception in 2009.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Al Insaf General Hospital is one of the premier ventures of Al Insaf Group, which is the top medical business conglomerate in Bangladesh. Our campus features modern architecture, 24+ clinical departments, laminar flow operation theatres, and round-the-clock emergency care.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                <span>500+ Inpatient Beds</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                <span>200+ Specialist Doctors</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                <span>24/7 Casualty & Trauma</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600"
              alt="Hospital Facility 1"
              className="rounded-2xl shadow-md h-56 w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600"
              alt="Hospital Facility 2"
              className="rounded-2xl shadow-md h-56 w-full object-cover mt-6"
            />
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
              alt="Hospital Facility 3"
              className="rounded-2xl shadow-md h-56 w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600"
              alt="Hospital Facility 4"
              className="rounded-2xl shadow-md h-56 w-full object-cover mt-6"
            />
          </div>
        </div>

        {/* Mission, Vision, Why Us (3 Cards) */}
        <div id="mission" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              &quot;Al Insaf General Hospital will be the leading healthcare and academic institution of the country, providing world-class tertiary medical care, compassionate nursing, and high-tech affordable healthcare for all.&quot;
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              &quot;To establish a benchmark healthcare ecosystem through innovative clinical expertise and state-of-the-art diagnostic technology that adds profound value to society and acts as a driving force of humanity.&quot;
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Why Us</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              &quot;The flagship medical venture of Al Insaf Group fulfills our devoted commitment towards the health sector of Bangladesh, providing round-the-clock intensive care, 24+ specialties, and affordable diagnostic accuracy under one roof.&quot;
            </p>
          </div>
        </div>

        {/* Leadership Message Section */}
        <div id="leadership" className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-10">
          <div className="border-b border-slate-100 pb-6">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
              Leadership
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Message from Managing Director & CEO
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center lg:text-left">
              <div className="w-44 h-44 mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-slate-100 border-4 border-slate-100 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400"
                  alt="Managing Director"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-black text-slate-900 mt-4">Dr. Mostafizur Rahman</h4>
              <p className="text-xs text-primary-600 font-bold uppercase">Managing Director & CEO, Al Insaf Group</p>
            </div>

            <div className="lg:col-span-8 text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                &ldquo;At Al Insaf General Hospital, our mission from day one has been to render the best possible standard of healthcare to every citizen at an accessible and affordable cost. We have continuously invested in global-standard operating rooms, intensive care ventilators, and the latest robotic and laser surgical technologies.&rdquo;
              </p>
              <p>
                &ldquo;Our dedicated faculty of doctors, consultants, nurses, and technicians work tirelessly 24 hours a day to uphold our sacred motto: <em>We Care for Life</em>.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Bar */}
        <div className="bg-[#384349] rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between shadow-xl">
          <div className="space-y-2 text-center sm:text-left mb-6 sm:mb-0">
            <h3 className="text-2xl font-black">Need Expert Medical Consultation?</h3>
            <p className="text-sm text-slate-300">Book an appointment with our renowned clinical specialists today.</p>
          </div>
          <Link
            href="/appointments"
            className="px-6 py-3.5 bg-primary-600 hover:bg-primary-500 font-bold text-sm text-white rounded-xl shadow-lg transition-all"
          >
            Book an Appointment Online &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
