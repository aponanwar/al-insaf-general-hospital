import { NewsCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function NewsLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-[#384349] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <Skeleton className="w-36 h-6 rounded-full bg-slate-600/50 mx-auto" />
          <Skeleton className="w-80 sm:w-96 h-10 rounded-xl bg-slate-600/50 mx-auto" />
          <Skeleton className="w-72 sm:w-96 h-4 rounded-lg bg-slate-600/50 mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-32 h-4" />
        </div>
        <NewsCardSkeleton count={6} />
      </div>
    </div>
  );
}
