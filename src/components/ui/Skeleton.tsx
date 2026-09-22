import React from 'react';

/**
 * Base animated skeleton block
 */
export function Skeleton({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
      {...props}
    />
  );
}

/**
 * Doctor Card Skeleton Grid
 */
export function DoctorCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
        >
          <div>
            {/* Top Row: Avatar & Info */}
            <div className="flex items-start space-x-4">
              <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <Skeleton className="w-24 h-4 rounded-full" />
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>

            {/* Qualifications */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <Skeleton className="w-full h-3.5" />
              <Skeleton className="w-2/3 h-3.5" />
            </div>

            {/* Schedule & Chamber */}
            <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="w-48 h-3.5" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="w-36 h-3.5" />
              </div>
            </div>

            {/* Visiting Days */}
            <div className="mt-3 flex gap-1.5">
              <Skeleton className="w-10 h-4 rounded-md" />
              <Skeleton className="w-10 h-4 rounded-md" />
              <Skeleton className="w-10 h-4 rounded-md" />
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="w-14 h-3" />
              <Skeleton className="w-16 h-5" />
            </div>
            <Skeleton className="w-28 h-9 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Staff Row Skeleton List
 */
export function StaffRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-16 h-4 rounded-full" />
              </div>
              <Skeleton className="w-40 h-5" />
              <Skeleton className="w-56 h-3.5" />
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <Skeleton className="w-28 h-8 rounded-xl" />
            <Skeleton className="w-24 h-8 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Table Skeleton (Used for Admin tables, rates, appointments)
 */
export function TableSkeleton({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="w-full space-y-3 p-4">
      {/* Table Header */}
      <div className="flex space-x-4 pb-3 border-b border-slate-200">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-4 flex-1" />
        ))}
      </div>
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center space-x-4 py-3 border-b border-slate-100"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-4 flex-1 ${c === 0 ? 'w-1/4' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Department / Speciality Grid Skeleton
 */
export function DepartmentCardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          <Skeleton className="w-3/4 h-5" />
          <div className="space-y-1.5">
            <Skeleton className="w-full h-3.5" />
            <Skeleton className="w-5/6 h-3.5" />
            <Skeleton className="w-2/3 h-3.5" />
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Admin Dashboard Metrics Skeleton
 */
export function DashboardMetricsSkeleton() {
  return (
    <div className="space-y-6">
      {/* DB Status Banner Skeleton */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="w-44 h-4" />
            <Skeleton className="w-64 h-3" />
          </div>
        </div>
        <Skeleton className="w-28 h-8 rounded-xl" />
      </div>

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <Skeleton className="w-12 h-7" />
            <Skeleton className="w-24 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * News / Notice Card Skeleton
 */
export function NewsCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-5"
        >
          <Skeleton className="w-full h-48 rounded-2xl" />
          <div className="flex items-center space-x-2">
            <Skeleton className="w-16 h-4 rounded-full" />
            <Skeleton className="w-20 h-3" />
          </div>
          <Skeleton className="w-3/4 h-5" />
          <div className="space-y-1.5">
            <Skeleton className="w-full h-3.5" />
            <Skeleton className="w-4/5 h-3.5" />
          </div>
        </div>
      ))}
    </div>
  );
}
