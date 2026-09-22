import { Skeleton } from '@/components/ui/Skeleton';

export default function AboutUsLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-[#384349] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <Skeleton className="w-36 h-6 rounded-full bg-slate-600/50 mx-auto" />
          <Skeleton className="w-80 sm:w-96 h-10 rounded-xl bg-slate-600/50 mx-auto" />
          <Skeleton className="w-72 sm:w-96 h-4 rounded-lg bg-slate-600/50 mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Leadership Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6"
            >
              <Skeleton className="w-32 h-32 rounded-2xl shrink-0" />
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <Skeleton className="w-24 h-4 rounded-full mx-auto sm:mx-0" />
                <Skeleton className="w-48 h-6 mx-auto sm:mx-0" />
                <Skeleton className="w-36 h-4 mx-auto sm:mx-0" />
                <div className="space-y-1.5 pt-2">
                  <Skeleton className="w-full h-3" />
                  <Skeleton className="w-5/6 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vision & Mission Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
            >
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <Skeleton className="w-36 h-5" />
              <div className="space-y-2">
                <Skeleton className="w-full h-3.5" />
                <Skeleton className="w-4/5 h-3.5" />
                <Skeleton className="w-2/3 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
