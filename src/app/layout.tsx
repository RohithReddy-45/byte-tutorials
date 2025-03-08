import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import ProgressProvider from "@/providers/ProgressProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Byte tutorials",
    default: "Byte tutorials - Curated Tech Learning Platform",
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/icons/favicon-dark.ico",
        href: "/icons/favicon-dark.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/icons/favicon-light.ico",
        href: "/icons/favicon-light.ico",
      },
    ],
  },
  description:
    "Learn tech skills through curated YouTube courses. Find and organize top programming tutorials across web development, mobile apps, data science and more.",
  keywords: [
    "programming tutorials",
    "coding courses",
    "tech learning",
    "developer education",
    "software development",
  ],
  authors: [{ name: "Byte tutorials" }],
  openGraph: {
    title: "Byte tutorials - Curated Tech Learning Platform",
    description:
      "Learn tech skills through curated YouTube courses. Find and organize top programming tutorials across web development, mobile apps, data science and more.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Byte tutorials - Curated Tech Learning Platform",
    description: "Learn tech skills through curated YouTube courses",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />*/}
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="4accbd25-5fed-4cff-bfcf-81ea7df9d3c5"
        />
      </head>
      <body className={cn("antialiased bg-background", inter.className)}>
        <ProgressProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster />
          </ThemeProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
