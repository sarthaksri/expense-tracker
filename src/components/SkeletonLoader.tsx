import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Base shimmer block
// ---------------------------------------------------------------------------
interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      'rounded-lg bg-muted/60 relative overflow-hidden',
      'before:absolute before:inset-0 before:bg-gradient-to-r',
      'before:from-transparent before:via-white/10 before:to-transparent',
      'before:animate-[shimmer_1.5s_infinite]',
      'before:bg-[length:200%_100%]',
      className
    )}
  />
);

// ---------------------------------------------------------------------------
// Stat card skeleton  (4-grid)
// ---------------------------------------------------------------------------
const StatCardSkeleton = () => (
  <div className="rounded-xl bg-card border border-border p-4 sm:p-5 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-7 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
);

// ---------------------------------------------------------------------------
// Income / Rent editor skeleton
// ---------------------------------------------------------------------------
const IncomeRentSkeleton = () => (
  <div className="rounded-xl bg-card border border-border p-4 sm:p-6 space-y-3">
    <Skeleton className="h-5 w-40" />
    <div className="grid sm:grid-cols-2 gap-4">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Chart card skeleton
// ---------------------------------------------------------------------------
const ChartSkeleton = ({ title }: { title?: string }) => (
  <div className="rounded-xl bg-card border border-border p-4 sm:p-6 space-y-4">
    {title ? (
      <Skeleton className="h-5 w-36" />
    ) : (
      <Skeleton className="h-5 w-44" />
    )}
    <Skeleton className="h-[200px] w-full rounded-lg" />
  </div>
);

// ---------------------------------------------------------------------------
// Month selector skeleton
// ---------------------------------------------------------------------------
const MonthSelectorSkeleton = () => (
  <div className="flex items-center gap-3">
    <Skeleton className="h-9 w-9 rounded-lg" />
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-9 w-9 rounded-lg" />
  </div>
);

// ---------------------------------------------------------------------------
// Dashboard skeleton
// ---------------------------------------------------------------------------
export const DashboardSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    {/* Month Selector */}
    <MonthSelectorSkeleton />

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Income & Rent Editor */}
    <IncomeRentSkeleton />

    {/* Charts */}
    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
      <ChartSkeleton title="Spending by Category" />
      <ChartSkeleton title="Monthly Trend" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Calendar skeleton
// ---------------------------------------------------------------------------
export const CalendarSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-6">
    {/* Calendar grid */}
    <div className="rounded-xl bg-card border border-border p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-6 rounded" />
        ))}
      </div>
      {/* Date cells */}
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, col) => (
            <Skeleton key={col} className="h-10 rounded-lg" />
          ))}
        </div>
      ))}
    </div>

    {/* Daily expense list */}
    <div className="rounded-xl bg-card border border-border p-4 sm:p-6 space-y-4">
      <Skeleton className="h-5 w-36" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Savings skeleton
// ---------------------------------------------------------------------------
const SavingsGoalSkeleton = () => (
  <div className="rounded-xl bg-card border border-border p-4 sm:p-5 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-1">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-8 flex-1 rounded-lg" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  </div>
);

export const SavingsSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex items-center justify-between gap-2">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-9 w-28 rounded-lg" />
    </div>

    {/* Monthly savings section */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SavingsGoalSkeleton key={i} />
        ))}
      </div>
    </div>

    {/* Overall goals section */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <SavingsGoalSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Analytics skeleton
// ---------------------------------------------------------------------------
export const AnalyticsSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <Skeleton className="h-8 w-32" />
      {/* Period selector pills */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
      <ChartSkeleton title="Category Breakdown" />
      <ChartSkeleton title="Trend" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Full-page (initial load) skeleton — replaces the old spinner
// ---------------------------------------------------------------------------
export const PageSkeleton = () => (
  <div className="dark min-h-screen bg-background text-foreground pb-20 md:pb-0">
    {/* Header skeleton */}
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block space-y-1 text-right">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-9 w-9 sm:h-10 sm:w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </header>

    {/* Navigation skeleton */}
    <div className="flex gap-1 px-4 py-2 border-b border-border bg-card/80 backdrop-blur-xl sticky top-[57px] z-30">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-9 flex-1 rounded-lg" />
      ))}
    </div>

    {/* Content skeleton */}
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <DashboardSkeleton />
    </main>
  </div>
);
