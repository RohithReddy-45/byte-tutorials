import { PulseLoader } from "../_components/pulse-loader";

export default function WatchlistLoading() {
  return (
    <>
      <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      <div className="flex flex-col flex-1 gap-5 lg:flex-row">
        <div className="w-full overflow-auto pb-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <PulseLoader key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
