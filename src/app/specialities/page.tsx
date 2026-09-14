'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Activity,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Brain,
  Bone,
  Eye,
  Scissors,
  Baby,
  Wind
} from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '@/lib/seed-data';

export default function SpecialitiesPage() {
  const [query, setQuery] = useState('');
  const departments = INITIAL_DEPARTMENTS;

  const filteredDepts = departments.filter((dept) =>
    dept.name.toLowerCase().includes(query.toLowerCase()) ||
    dept.shortDescription.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Banner */}
      <div className="bg-[#384349] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Center of Clinical Excellence
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-3">
            Our Specialities & Departments
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
            Providing comprehensive super-specialized diagnostic and surgical care across 24+ medical wings.
          </p>

          {/* Real-time Search Box */}
          <div className="max-w-xl mx-auto mt-8 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by department name (e.g. Cardiology, Orthopaedics, Oncology)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Showing {filteredDepts.length} Specialized Departments
            </h2>
            <p className="text-xs text-slate-500">
              Click any department to explore detailed facilities, treatments, and consulting specialists.
            </p>
          </div>
        </div>

        {filteredDepts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No departments match your query</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for keywords like &quot;Medicine&quot;, &quot;Surgery&quot;, or &quot;ICU&quot;</p>
            <button
              onClick={() => setQuery('')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepts.map((dept) => (
              <div
                key={dept.slug}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Active Wing
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {dept.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                    {dept.shortDescription}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Key Facilities:
                    </div>
                    <div className="space-y-1">
                      {dept.facilities.slice(0, 2).map((fac, i) => (
                        <div key={i} className="flex items-center text-xs text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2" />
                          <span className="truncate">{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/specialities/${dept.slug}`}
                    className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Department</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>

                  <Link
                    href={`/doctors?department=${encodeURIComponent(dept.name)}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors"
                  >
                    View Doctors
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
