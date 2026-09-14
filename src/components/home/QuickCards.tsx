import Link from 'next/link';
import { UserCheck, ShieldPlus, CalendarCheck, ArrowRight } from 'lucide-react';

export default function QuickCards() {
  const cards = [
    {
      title: 'Our Doctors',
      description: 'Best team of 200+ specialized professors & surgeons for outpatient and inpatient care.',
      buttonText: 'Find our Doctors',
      link: '/doctors',
      icon: UserCheck,
      bgColor: 'bg-[#384349]', // Signature dark slate
    },
    {
      title: 'Hospital Services',
      description: 'Check out our 24/7 emergency, ICU/CCU, diagnostic laboratory, and surgical facilities.',
      buttonText: 'Check Services',
      link: '/services/facilities',
      icon: ShieldPlus,
      bgColor: 'bg-primary-700', // Signature medical green
    },
    {
      title: 'Appointments',
      description: 'Book your preferred specialist doctor online with instant SMS & tracking confirmation.',
      buttonText: 'Get Appointment',
      link: '/appointments',
      icon: CalendarCheck,
      bgColor: 'bg-[#2b353a]',
    },
  ];

  return (
    <section className="relative -mt-10 lg:-mt-16 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`${card.bgColor} text-white rounded-2xl p-7 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between border border-white/10`}
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center mb-5 backdrop-blur-sm">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <Link
                href={card.link}
                className="w-full inline-flex items-center justify-center py-3 px-5 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow transition-colors group"
              >
                <span>{card.buttonText}</span>
                <ArrowRight className="w-4 h-4 ml-2 text-primary-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
