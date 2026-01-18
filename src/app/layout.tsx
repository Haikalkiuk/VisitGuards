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
  title: "VisitGuard - IoT Monitoring System",
  description: "Platform IoT monitoring untuk pemantauan perkembangan daun anggur secara otomatis. Mendukung ketahanan pangan Kota Depok.",
  keywords: ["VisitGuard", "IoT", "monitoring", "pertanian", "anggur", "ketahanan pangan", "Depok", "STT Nurul Fikri"],
  authors: [{ name: "Haikal Kautsar" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "VisitGuard - IoT Monitoring System",
    description: "Platform IoT monitoring untuk pemantauan perkembangan daun anggur secara otomatis",
    url: "https://visitguard.vercel.app",
    siteName: "VisitGuard",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VisitGuard IoT Monitoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisitGuard - IoT Monitoring System",
    description: "Platform IoT monitoring untuk pertanian modern",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <div className="min-h-screen bg-background">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}