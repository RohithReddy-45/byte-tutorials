import Header from "./_components/Header";
import Hero from "./_components/Hero";
import FeaturesSection from "./_components/Features";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";
import { getCurrentSession } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (user) redirect("/courses");

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
        {/* Top-left orb */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl bg-primary" />
        {/* Bottom-right orb */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl bg-indigo-500" />
        {/* Center subtle noise texture effect via dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative min-h-screen flex flex-col min-w-[370px]">
        <Header />
        <main className="flex-1">
          <Hero />
          <FeaturesSection />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
