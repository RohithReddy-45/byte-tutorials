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
    <div className="flex items-center justify-center max-w-[400px] mx-auto h-screen">
      <AdminForm />
    </div>
  );
}
