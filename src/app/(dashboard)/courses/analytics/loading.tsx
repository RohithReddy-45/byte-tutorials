export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 pb-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-card space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-2.5 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap skeleton */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-card space-y-4">
        <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}
