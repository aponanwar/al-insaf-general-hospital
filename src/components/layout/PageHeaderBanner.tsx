import React from 'react';

interface PageHeaderBannerProps {
  badge?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeaderBanner({
  badge,
  title,
  description,
  children,
}: PageHeaderBannerProps) {
  return (
    <div className="relative bg-gradient-to-b from-[#2a3338] via-[#384349] to-[#232a2e] text-white py-14 sm:py-16 overflow-hidden border-b border-slate-700/60 shadow-lg">
      {/* Glossy ambient light reflection, top hairline & radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-white/5 to-transparent pointer-events-none" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[650px] h-48 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      {/* Decorative glossy orbs */}
      <div className="absolute -top-10 -right-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 z-10">
        {badge && (
          <div className="inline-block">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-inner inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {badge}
            </span>
          </div>
        )}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
          {title}
        </h1>
        {description && (
          <p className="text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm md:text-base font-normal leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}


