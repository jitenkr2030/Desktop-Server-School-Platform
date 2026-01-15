import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { NavigationSimple } from "@/components/navigation-simple";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INR99.Academy - India's Learning Infrastructure",
  description: "A learning utility as reliable and affordable as UPI. Access quality education that works in villages, towns, and cities alike for just ₹99/month.",
  keywords: ["INR99.Academy", "Online Learning", "Education India", "Affordable Learning", "Mobile Learning", "UPI for Education"],
  authors: [{ name: "INR99.Academy Team" }],
  openGraph: {
    title: "INR99.Academy - India's Learning Infrastructure",
    description: "Learn for just ₹99/month. Quality education accessible across India.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "INR99.Academy - India's Learning Infrastructure",
    description: "Learn for just ₹99/month. Quality education accessible across India.",
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
        <AuthProvider>
          <NavigationSimple />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}