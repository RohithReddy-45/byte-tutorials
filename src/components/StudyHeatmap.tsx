"use client";

import { useMemo } from "react";
import type { HeatmapDay } from "@/app/(dashboard)/courses/actions/analytics-action";

interface StudyHeatmapProps {
  data: HeatmapDay[];
}

export default function StudyHeatmap({ data }: StudyHeatmapProps) {
  // Map data to quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of data) {
      map.set(d.date, d.count);
    }
    return map;
  }, [data]);

  // Generate grid for past 16 weeks (112 days) ending today
  const grid = useMemo(() => {
    const result: Array<{ dateStr: string; count: number; level: number; dayOfWeek: number }> = [];
    const today = new Date();
    
    // Find the start date: 16 weeks ago, aligned to the start of the week (Sunday = 0)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 16 * 7);
    
    // Align startDate to Sunday of that week
    const currentDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - currentDay);

    // Generate days from startDate to today
    const tempDate = new Date(startDate);
    const endTime = new Date(today).setHours(23, 59, 59, 999);

    while (tempDate.getTime() <= endTime) {
      const year = tempDate.getFullYear();
      const month = String(tempDate.getMonth() + 1).padStart(2, "0");
      const dateVal = String(tempDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${dateVal}`;

      const count = dataMap.get(dateStr) || 0;
      
      // Determine intensity level (0 to 4)
      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 9) level = 3;
      else if (count > 9) level = 4;

      result.push({
        dateStr,
        count,
        level,
        dayOfWeek: tempDate.getDay(),
      });

      tempDate.setDate(tempDate.getDate() + 1);
    }

    // Group into weeks (each week has 7 days)
    const weeks: Array<typeof result> = [];
    let currentWeek: typeof result = [];

    for (const day of result) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [dataMap]);

  // Weekday labels
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Format Date for tooltips
  const formatDateLabel = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  return (
    <div className="p-6 bg-card border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Study Consistency Calendar</h3>
        <span className="text-xs text-muted-foreground">Past 16 weeks</span>
      </div>

      <div className="flex gap-2 items-start overflow-x-auto pt-8 pb-2 px-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {/* Weekday labels column */}
        <div className="grid grid-rows-7 gap-1 pr-2 text-[10px] text-muted-foreground select-none">
          {weekdays.map((day) => (
            <div key={day} className="h-3 flex items-center justify-end leading-none font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1.5">
          {grid.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-rows-7 gap-1">
              {week.map((day) => {
                // Theme-aware dynamic color classes
                const colors = [
                  "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700", // level 0
                  "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/40", // level 1
                  "bg-emerald-300 dark:bg-emerald-800/60 border-emerald-400 dark:border-emerald-700/40 hover:bg-emerald-400 dark:hover:bg-emerald-700/60", // level 2
                  "bg-emerald-500 dark:bg-emerald-600/80 border-emerald-600 dark:border-emerald-500/30 hover:bg-emerald-600 dark:hover:bg-emerald-500/80", // level 3
                  "bg-emerald-700 dark:bg-emerald-400 border-emerald-800 dark:border-emerald-300 hover:bg-emerald-800 dark:hover:bg-emerald-300", // level 4
                ];
                
                return (
                  <div
                    key={day.dateStr}
                    className={`size-3 rounded-sm border transition duration-150 relative group cursor-pointer hover:z-50 ${colors[day.level]}`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                      <div className="bg-popover text-popover-foreground border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-[10px] shadow-xl whitespace-nowrap leading-relaxed">
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {day.count === 0 ? "No study session" : `${day.count} action${day.count > 1 ? "s" : ""}`}
                        </strong>
                        <div className="text-muted-foreground text-[9px] mt-0.5">{formatDateLabel(day.dateStr)}</div>
                      </div>
                      <div className="w-1.5 h-1.5 bg-popover border-r border-b border-slate-200 dark:border-slate-800 absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground pt-2 border-t border-slate-200 dark:border-slate-800">
        <span>Less</span>
        <div className="size-2.5 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50" />
        <div className="size-2.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/30" />
        <div className="size-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-800/60 border border-emerald-400 dark:border-emerald-700/40" />
        <div className="size-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-600/80 border border-emerald-600 dark:border-emerald-500/30" />
        <div className="size-2.5 rounded-sm bg-emerald-700 dark:bg-emerald-400 border border-emerald-800 dark:border-emerald-300" />
        <span>More</span>
      </div>
    </div>
  );
}
