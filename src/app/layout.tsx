import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import {
  defaultDescription,
  defaultTitle,
  siteName,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute URLs for Open Graph, canonicals and the sitemap are resolved
  // against this base.
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "AKD Hospitality",
    "AKD Hospitality Limited",
    "AKDHL",
    "AKD Group",
    "Pakistan Stock Exchange",
    "PSX listed company",
    "tourism Pakistan",
    "hospitality Pakistan",
    "destination management",
    "motels Pakistan",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  publisher: siteName,
  category: "Travel and Tourism",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_PK",
    url: "/",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

/**
 * Document shell only. The public site's header, ticker and footer live in
 * (site)/layout.tsx so that /admin can render without them.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-PK" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full bg-background">{children}</body>
    </html>
  );
}
