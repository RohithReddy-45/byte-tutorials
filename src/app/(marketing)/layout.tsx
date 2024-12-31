export const metadata = {
  title: "DevTube",
  description: "DevTube - Curated Tech Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
