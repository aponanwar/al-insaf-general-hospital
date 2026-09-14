import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  HeartPulse,
  ShieldCheck,
  ChevronRight,
  Lock
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: About & Contacts (2 spans) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight">
                  AL INSAF <span className="text-primary-400">HOSPITAL</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Al Insaf General Hospital Ltd.
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              The premier healthcare institution of Al Insaf Group, delivering tertiary medical care with 500+ beds, 24/7 emergency response, modern ICUs, and 24+ specialized clinical departments in Dhaka, Bangladesh.
            </p>

            <div className="space-y-2.5 pt-2 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                <span>House: 08, Road: 02, Dhanmondi, Dhaka-1205, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:09666787800" className="hover:text-white font-semibold text-emerald-400">
                  09666 787800 (Hotline)
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@alinsafhospital.com" className="hover:text-white">
                  info@alinsafhospital.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Hospital Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <ShieldCheck className="w-4 h-4 text-primary-400 mr-2" />
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/indoor" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Indoor & Cabins
                </Link>
              </li>
              <li>
                <Link href="/services/outdoor" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Outdoor & OPD
                </Link>
              </li>
              <li>
                <Link href="/services/facilities" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  ICU, CCU & NICU
                </Link>
              </li>
              <li>
                <Link href="/patient-guide/rates" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Hospital Tariff Charts
                </Link>
              </li>
              <li>
                <Link href="/patient-guide/vaccination" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Vaccination Center
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Online Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <Clock className="w-4 h-4 text-primary-400 mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about-us" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  About Our Hospital
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link href="/specialities" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  All Specialities
                </Link>
              </li>
              <li>
                <Link href="/patient-guide/admission" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Admission & Payment
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  News & Events
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency & Quick Appointment Card */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              24/7 Emergency Help
            </h4>
            <p className="text-xs text-slate-400">
              Emergency casualty, round-the-clock cardiac care, trauma service, and ICU admission available.
            </p>
            <div className="bg-emerald-950/60 border border-emerald-800/50 p-3 rounded-xl text-center">
              <div className="text-[11px] text-emerald-300 uppercase font-semibold">Ambulance & Hotline</div>
              <div className="text-lg font-black text-emerald-400 tracking-wider">09666 787800</div>
            </div>
            <Link
              href="/appointments"
              className="w-full block text-center py-2.5 px-4 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Book Doctor Now
            </Link>
          </div>
        </div>

        {/* Bottom copyright & admin portal link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-3 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} Al Insaf General Hospital Ltd. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-emerald-400 flex items-center text-slate-400 font-medium">
              <Lock className="w-3 h-3 mr-1 text-slate-500" />
              Staff / Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
