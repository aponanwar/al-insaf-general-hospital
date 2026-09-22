import { TableSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function PatientRatesLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-[#384349] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <Skeleton className="w-36 h-6 rounded-full bg-slate-600/50 mx-auto" />
          <Skeleton className="w-80 sm:w-96 h-10 rounded-xl bg-slate-600/50 mx-auto" />
          <Skeleton className="w-72 sm:w-96 h-4 rounded-lg bg-slate-600/50 mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Skeleton className="w-full md:w-96 h-11 rounded-xl" />
            <Skeleton className="w-full md:w-64 h-11 rounded-xl" />
          </div>
          <TableSkeleton rows={8} cols={5} />
        </div>
      </div>
    </div>
  );
}
