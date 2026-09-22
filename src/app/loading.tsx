import { Skeleton } from '@/components/ui/Skeleton';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Banner Skeleton */}
      <div className="bg-[#384349] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-block">
            <Skeleton className="w-32 h-6 rounded-full bg-slate-600/50 mx-auto" />
          </div>
          <Skeleton className="w-80 sm:w-96 h-10 rounded-xl bg-slate-600/50 mx-auto" />
          <Skeleton className="w-64 sm:w-80 h-4 rounded-lg bg-slate-600/50 mx-auto" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <Skeleton className="w-48 h-6" />
              <div className="space-y-2">
                <Skeleton className="w-full h-3.5" />
                <Skeleton className="w-5/6 h-3.5" />
                <Skeleton className="w-2/3 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <Skeleton className="w-64 h-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="w-full h-40 rounded-2xl" />
            <Skeleton className="w-full h-40 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
