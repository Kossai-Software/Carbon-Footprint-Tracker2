import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carbon Footprint Tracker - For University Students",
  description: "Track and reduce your weekly carbon footprint based on Prof. Mike Berners-Lee's methodology. Help students reduce their footprint by 15% through actionable insights.",
  keywords: ["carbon footprint", "sustainability", "climate change", "environment", "students", "university", "green campus"],
  authors: [{ name: "Green Campus Initiative" }],
  openGraph: {
    title: "Carbon Footprint Tracker",
    description: "Track and reduce your weekly carbon emissions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carbon Footprint Tracker",
    description: "Track and reduce your weekly carbon emissions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}