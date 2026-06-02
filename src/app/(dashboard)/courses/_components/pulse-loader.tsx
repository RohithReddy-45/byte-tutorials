export function PulseLoader() {
  return (
    <div className="overflow-hidden rounded-lg border-none drop-shadow-md dark:bg-accent/50 bg-white">
      <div className="relative overflow-hidden">
        <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
      </div>

      <div className="relative overflow-hidden px-3 py-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="size-7 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
      </div>

      <div className="relative overflow-hidden px-3 pb-3 pt-0">
        <div className="flex gap-1.5">
          <div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
      </div>
    </div>
  );
}
