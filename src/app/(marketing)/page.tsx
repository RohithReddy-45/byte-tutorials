import Explore from "./_components/Explore";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";
import { getCurrentSession } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (user) redirect("/courses");
  return (
    <>
      <div className="fixed left-0 top-0 h-full w-full backdrop-blur-3xl bg-white dark:bg-gray-900">
        <div className="absolute inset-0 -z-10 h-full w-full dark:bg-[radial-gradient(#646d82_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] rounded-full opacity-20 blur-3xl bg-gradient-to-r from-blue-400 via-slate-100 to-gray-900 shadow-2xl" />
      </div>
      <div className="relative h-screen py-5 px-5 min-w-[370px]">
        <Header />
        <Hero />
        <Explore />
        {/* <FeaturedCourses /> */}
        <CTA />
        <Footer />
      </div>
    </>
  );
}
