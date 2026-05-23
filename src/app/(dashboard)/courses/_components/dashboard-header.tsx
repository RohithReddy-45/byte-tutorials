"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchInput from "@/components/SearchInput";
import { TechFilter } from "@/components/ui/select-with-search";
import { InfiniteMovingTags } from "./infinite-moving-tags";
import { Compass, BookOpen, BarChart3, Search } from "lucide-react";

export default function DashboardHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/courses", label: "Browse", icon: Search },
    { href: "/courses/watch-list", label: "Watchlist", icon: BookOpen },
    { href: "/courses/paths", label: "Learning Paths", icon: Compass },
    { href: "/courses/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const showFilters = pathname === "/courses" || pathname === "/courses/watch-list";

  return (
    <div className="w-full space-y-4">
      {/* Navigation tabs */}
      <nav className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto scrollbar-none select-none">
        {navLinks.map((link) => {
          // Check if link is active (exact match, or startsWith for subroutes except root)
          const isActive = link.href === "/courses" 
            ? pathname === "/courses"
            : pathname.startsWith(link.href);
            
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition duration-200 whitespace-nowrap border ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50"
              }`}
            >
              <Icon className="size-3.5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Search and Tag filter panel */}
      {showFilters && (
        <div className="space-y-4 transition duration-300">
          <SearchInput />
          <TechFilter />
          <div className="w-full">
            <InfiniteMovingTags direction="right" speed="slow" />
          </div>
        </div>
      )}
    </div>
  );
}
