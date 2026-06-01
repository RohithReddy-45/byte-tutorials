export default function PathsLoading() {
  return (
    <div className="space-y-6 pb-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>

      {/* Path cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card space-y-4"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-9 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
