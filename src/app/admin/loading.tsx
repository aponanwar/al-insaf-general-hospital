import { DashboardMetricsSkeleton, TableSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-48 h-4" />
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-80 h-4" />
        </div>
        <div className="flex space-x-3">
          <Skeleton className="w-24 h-10 rounded-xl" />
          <Skeleton className="w-32 h-10 rounded-xl" />
        </div>
      </div>

      <DashboardMetricsSkeleton />

      {/* Table Area Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <Skeleton className="w-56 h-6" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <TableSkeleton rows={6} cols={6} />
      </div>
    </div>
  );
}
