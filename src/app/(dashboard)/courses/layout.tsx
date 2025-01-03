import { getCurrentSession } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import SessionProvider from "@/providers/SessionProvider";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import Avatar from "@/components/Avatar";
import SearchInput from "@/components/SearchInput";
import FilterCard from "@/components/FilterCard";
import { InfiniteMovingTags } from "./_components/infinite-moving-tags";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session.user) redirect("/sign-in");

  return (
    <SessionProvider value={session}>
      <div className="container flex flex-col gap-5 px-3 sm:px-6 py-3 mx-auto leading-6 h-dvh">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full">
            <Logo />
          </div>
          <div className="flex items-center gap-3 mx-2">
            <ModeToggle />
            <Avatar />
          </div>
        </div>
        <SearchInput />
        <FilterCard />
        <div className="w-full">
          <InfiniteMovingTags direction="right" speed="slow" />
        </div>
        {children}
      </div>
    </SessionProvider>
  );
}
