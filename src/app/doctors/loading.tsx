import { DoctorCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function DoctorsLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Banner Skeleton */}
      <div className="bg-[#384349] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Skeleton className="w-36 h-6 rounded-full bg-slate-600/50 mx-auto" />
          <Skeleton className="w-80 sm:w-96 h-10 rounded-xl bg-slate-600/50 mx-auto" />
          <Skeleton className="w-64 sm:w-80 h-4 rounded-lg bg-slate-600/50 mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filter Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <Skeleton className="w-32 h-6" />
              <div className="space-y-2">
                <Skeleton className="w-24 h-3" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-20 h-3" />
                <div className="space-y-1.5">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-8 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid Skeleton */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <Skeleton className="w-36 h-5" />
              <Skeleton className="w-64 h-10 rounded-xl" />
            </div>
            <DoctorCardSkeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
