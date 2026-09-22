import { StaffRowSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function StaffLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Banner */}
      <div className="bg-[#384349] py-14 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <Skeleton className="w-36 h-6 rounded-full bg-slate-600/50 mx-auto" />
          <Skeleton className="w-80 sm:w-96 h-10 rounded-xl bg-slate-600/50 mx-auto" />
          <Skeleton className="w-64 sm:w-80 h-4 rounded-lg bg-slate-600/50 mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Role Navigation Skeleton */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <Skeleton className="w-36 h-5" />
              <div className="space-y-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2.5 rounded-2xl">
                    <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="w-40 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Staff Rows Skeleton */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
              <Skeleton className="w-40 h-6" />
              <Skeleton className="w-64 h-9 rounded-xl" />
            </div>
            <StaffRowSkeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
