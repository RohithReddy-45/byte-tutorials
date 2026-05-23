import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/validate-request";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FaGithub } from "react-icons/fa6";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Byte tutorials to access curated programming courses and manage your learning journey",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AuthPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error as string;

  const { user } = await getCurrentSession();
  if (user) redirect("/courses");

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl bg-primary pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl bg-indigo-500 pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Auth card */}
        <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-black/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Continue your learning journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3">
            <a href="/sign-in/google" className="outline-none">
              <Button className="w-full h-11 bg-[#4285F4] hover:bg-[#3574e2] text-white shadow-sm shadow-[#4285F4]/20 transition-all duration-200">
                <svg className="mr-2 size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </a>

            <a href="/sign-in/github">
              <Button
                variant="outline"
                className="w-full h-11 bg-[#24292e] dark:bg-[#24292e] border-[#24292e] text-white hover:bg-[#1a1e22] hover:border-[#1a1e22] hover:text-white dark:text-white dark:hover:bg-[#1a1e22] transition-all duration-200 shadow-sm"
              >
                <FaGithub className="mr-2 h-4 w-4 shrink-0" />
                Continue with GitHub
              </Button>
            </a>
          </div>

          {/* Divider */}
          <p className="mt-6 text-center text-xs text-muted-foreground/60 leading-relaxed">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
