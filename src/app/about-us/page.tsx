import Link from "next/link";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import {
  Building2,
  Award,
  Users,
  CheckCircle,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  MapPin,
} from "lucide-react";

export const metadata = {
  title: "About Us | Al Insaf General Hospital Ltd. (AIGH)",
  description:
    "Learn about Al Insaf General Hospital, our mission, vision, management team, and modern healthcare facilities in Dhaka.",
};

const imageUrl = "https://i.ibb.co.com/8nCy2WB3/shamim-updated-image.jpg";

export default function AboutUsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <PageHeaderBanner
        badge="About Al Insaf Hospital"
        badgeBn="আল ইনসাফ হাসপাতাল পরিচিতি"
        title="At a Glance"
        titleBn="এক নজরে হাসপাতাল"
        description="Dedicated workforce with committed adherence to quality and uncompromising perfection."
        descriptionBn="রোগীদের উন্নত ও মানবিক চিকিৎসাসেবা প্রদানে নিবেদিত এবং গুণগত মানে আপসহীন।"
      >
        <div className="flex justify-center items-center space-x-2 text-xs text-slate-300 pt-2">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">About Us</span>
        </div>
      </PageHeaderBanner>

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
              Al Insaf General Hospital is a 500+ beds care hospital and the
              leading contributor of private healthcare services in Bangladesh.
              This has been achieved through consistent commitment to improving
              the lives of people through utmost service excellence since our
              inception in 2009.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Al Insaf General Hospital is one of the premier ventures of Al
              Insaf Group, which is the top medical business conglomerate in
              Bangladesh. Our campus features modern architecture, 24+ clinical
              departments, laminar flow operation theatres, and round-the-clock
              emergency care.
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
              &quot;Al Insaf General Hospital will be the leading healthcare and
              academic institution of the country, providing world-class
              tertiary medical care, compassionate nursing, and high-tech
              affordable healthcare for all.&quot;
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              &quot;To establish a benchmark healthcare ecosystem through
              innovative clinical expertise and state-of-the-art diagnostic
              technology that adds profound value to society and acts as a
              driving force of humanity.&quot;
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Why Us</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              &quot;The flagship medical venture of Al Insaf Group fulfills our
              devoted commitment towards the health sector of Bangladesh,
              providing round-the-clock intensive care, 24+ specialties, and
              affordable diagnostic accuracy under one roof.&quot;
            </p>
          </div>
        </div>

        {/* Leadership Message Section */}
        <div
          id="leadership"
          className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-10"
        >
          <div className="border-b border-slate-100 pb-6">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
              Leadership
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Message from Vice Chairman
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center lg:text-left">
              <div className="w-44 h-44 mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-slate-100 border-4 border-slate-100 shadow-md relative">
                <img
                  src={imageUrl}
                  alt="Vice Chairman Md Shamim Ahammed - Al Insaf General Hospital"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              </div>
              <h4 className="text-lg font-black text-slate-900 mt-4 uppercase">
                Md Shamim Ahammed
              </h4>
              <p className="text-xs text-primary-600 font-bold uppercase">
                Vice Chairman
              </p>
              <p className="text-xs text-slate-500 font-bold uppercase">
                Al Insaf General Hospital
              </p>
            </div>

            <div className="lg:col-span-8 text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                &ldquo;Dear Ladies and Gentlemen, <br></br>On behalf of Al Insaf
                General Hospital , I extend my sincere greetings to you all. Our
                primary commitment is to ensure quality healthcare in order to
                build a healthy and robust society. Our goal is not merely to
                provide medical treatment, but to restore patients to health
                with the utmost care and compassion. By combining modern medical
                technology, skilled physicians, and dedicated nurses and
                healthcare workers, we are working tirelessly to provide
                national-standard care to every patient. We believe that access
                to healthcare is a fundamental right for everyone. Therefore, we
                are committed to bringing accurate diagnostics and reliable
                medical care to everyone's doorstep at an affordable cost. Your
                trust and affection are the primary inspiration behind our
                journey. We wish you all good health and longevity. Sincerely,
                &rdquo;
              </p>
              <p>
                &ldquo;Our dedicated faculty of doctors, consultants, nurses,
                and technicians work tirelessly 24 hours a day to uphold our
                sacred motto: <em>We Care for Life</em>.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Bar */}
        <div className="bg-[#384349] rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between shadow-xl">
          <div className="space-y-2 text-center sm:text-left mb-6 sm:mb-0">
            <h3 className="text-2xl font-black">
              Need Expert Medical Consultation?
            </h3>
            <p className="text-sm text-slate-300">
              Book an appointment with our renowned clinical specialists today.
            </p>
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
