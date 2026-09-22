'use client';

import { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import PageHeaderBanner from '@/components/layout/PageHeaderBanner';
import { INITIAL_RATES } from '@/lib/seed-data';
import { RateItem } from '@/lib/types';

const CATEGORIES = [
  'All Categories',
  'Cabin & Bed',
  'ICU & Emergency',
  'Diagnostic & Radiology',
  'Pathology & Lab',
  'Surgical & OT',
  'Consultation',
];

export default function RateChartsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [rates, setRates] = useState<RateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/rates')
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates && data.rates.length > 0) {
          setRates(data.rates);
        } else {
          setRates(INITIAL_RATES);
        }
      })
      .catch((err) => {
        console.warn('Could not load live rates from database, falling back to seed data:', err);
        setRates(INITIAL_RATES);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredRates = rates.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Glossy Header Banner */}
      <PageHeaderBanner
        badge="Transparent Healthcare Pricing"
        title="Hospital Rate Charts & Tariffs"
        description="Transparent pricing for hospital accommodations, intensive care units, laboratory investigations, and diagnostic imaging."
      >
        {/* Quick Search */}
        <div className="max-w-xl mx-auto mt-6 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tests, procedures or cabin rates (e.g. MRI, ICU, CBC, Cabin)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xl border border-slate-200"
          />
        </div>
      </PageHeaderBanner>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Category Pills & Print Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 mr-2 text-primary-600" />
            Print Rate Chart
          </button>
        </div>

        {/* Rate Chart Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-800">
              <FileSpreadsheet className="w-4 h-4 text-primary-600" />
              <span>
                Showing {filteredRates.length} Tests / Hospital Services
              </span>
            </div>
            <span className="text-xs text-slate-400">All fees in Bangladeshi Taka (BDT)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-6">Code</th>
                  <th className="py-3.5 px-6">Service / Investigation Name</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Unit</th>
                  <th className="py-3.5 px-6 text-right">Standard Fee (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-52" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-5 w-28 rounded-full" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-16" /></td>
                      <td className="py-4 px-6 text-right"><Skeleton className="h-5 w-20 ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredRates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No rates or test items match your search filter.
                    </td>
                  </tr>
                ) : (
                  filteredRates.map((rate, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-500">
                        {rate.code}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {rate.name}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block text-[11px] font-semibold bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full">
                          {rate.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {rate.unit || 'per test'}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-900 text-base">
                        ৳{rate.fee.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">• Note:</p>
          <p>
            • Rates are subject to periodic hospital management revision and doctor prescription specifications.
          </p>
          <p>
            • For inquiries regarding package deals, major surgical estimates, or corporate corporate discounts, please contact the Billing Desk at <strong>09666 787800</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
