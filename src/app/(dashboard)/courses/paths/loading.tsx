function PathCard() {
  return (
    <div className="relative overflow-hidden flex flex-col justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="space-y-2 pt-1">
          <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-8 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-9 w-full rounded-md bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
    </div>
  );
}

export default function PathsLoading() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="relative overflow-hidden space-y-2">
          <div className="h-7 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-72 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
        </div>
        <div className="relative overflow-hidden h-9 w-28 rounded-md bg-slate-200 dark:bg-slate-800">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <PathCard key={i} />
        ))}
      </div>
    </div>
  );
}
