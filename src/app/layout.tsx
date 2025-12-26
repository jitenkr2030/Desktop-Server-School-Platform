import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NewNavigation } from "@/components/new-navigation";
import { auth } from "@/auth";

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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

// CSS loading script to prevent FOUC and ensure proper rendering
const cssLoadScript = `
  (function() {
    function ready(fn) {
      if (document.readyState !== 'loading') {
        fn();
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    }
    ready(function() {
      document.body.classList.add('css-loaded');
    });
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session on server to pass to client-side SessionProvider
  // This eliminates client-side session checking and prevents blinking
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: cssLoadScript,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <Providers session={session}>
          <NewNavigation />
          <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
