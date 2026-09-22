import { Skeleton } from '@/components/ui/Skeleton';

export default function AppointmentsLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="bg-[#384349] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <Skeleton className="w-36 h-6 rounded-full bg-slate-600/50 mx-auto" />
          <Skeleton className="w-80 sm:w-96 h-10 rounded-xl bg-slate-600/50 mx-auto" />
          <Skeleton className="w-72 sm:w-96 h-4 rounded-lg bg-slate-600/50 mx-auto" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center space-x-3 pb-6 border-b border-slate-100">
            <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-72 h-4" />
            </div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-full h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-full h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-full h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-full h-11 rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-full h-24 rounded-xl" />
          </div>

          <Skeleton className="w-full h-14 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
