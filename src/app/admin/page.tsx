import { getCurrentSession } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import AdminForm from "./AdminForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: "noindex, nofollow",
};
export default async function AdminPage() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/sign-in");
  }

  if (user.role !== "admin") {
    redirect("/courses");
  }

  return (
    <div className="flex items-start justify-center max-w-3xl mx-auto py-12 min-h-screen">
      <div className="w-full bg-card border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <AdminForm />
      </div>
    </div>
  );
}
