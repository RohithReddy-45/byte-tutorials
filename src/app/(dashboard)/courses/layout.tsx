import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import { getCurrentSession } from "@/lib/validate-request";
import SessionProvider from "@/providers/SessionProvider";
import { redirect } from "next/navigation";
import DashboardHeader from "./_components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session.user) {
    redirect("/sign-in");
  }

  return (
    <SessionProvider value={session}>
      <div className="container flex flex-col gap-4 px-3 sm:px-6 py-3 mx-auto leading-6 h-dvh">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full">
            <Logo href="/courses" />
          </div>
          <div className="flex items-center gap-3 mx-2">
            <ModeToggle />
            <Avatar />
          </div>
        </div>
        <DashboardHeader />
        {children}
      </div>
    </SessionProvider>
  );
}
