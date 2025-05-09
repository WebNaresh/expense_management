import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendIt - Financial Tracking App",
  description: "Track your expenses, subscriptions, and loans with ease",
  keywords: [
    "finance",
    "expense tracker",
    "budget",
    "money management",
    "personal finance",
  ],
  authors: [
    {
      name: "SpendIt Team",
    },
  ],
  creator: "SpendIt",
  publisher: "SpendIt",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "SpendIt - Financial Tracking App",
    description: "Track your expenses, subscriptions, and loans with ease",
    siteName: "SpendIt",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 650,
        alt: "SpendIt - Track your finances with ease",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendIt - Financial Tracking App",
    description: "Track your expenses, subscriptions, and loans with ease",
    creator: "@spendit",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 650,
        alt: "SpendIt - Track your finances with ease",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
