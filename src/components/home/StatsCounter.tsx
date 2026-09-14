import { Users, Award, UserCheck, Hospital } from 'lucide-react';

export default function StatsCounter() {
  const stats = [
    {
      icon: Users,
      value: '30,000+',
      label: 'Happy Patients Treated',
      desc: 'Recovered & well-cared across all wings',
    },
    {
      icon: Award,
      value: '15+',
      label: 'Years of Excellence',
      desc: 'Pioneering modern medical care since 2010',
    },
    {
      icon: UserCheck,
      value: '200+',
      label: 'Renowned Doctors',
      desc: 'Professors, specialists & surgical consultants',
    },
    {
      icon: Hospital,
      value: '400+',
      label: 'Dedicated Staff & Nurses',
      desc: '24/7 patient support and emergency assistance',
    },
  ];

  return (
    <section className="bg-gradient-to-r from-primary-800 via-primary-700 to-emerald-900 text-white py-14 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center space-y-2 group">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 group-hover:scale-110 group-hover:bg-white group-hover:text-primary-700 transition-all shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-emerald-100">
                  {stat.label}
                </div>
                <p className="text-xs text-emerald-200/80 max-w-[200px] mx-auto hidden sm:block">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
