import { Navbar } from "@/components/navbar";
import ApplicationClientWrapper from "@/provider/application.wrapper";
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
        <ApplicationClientWrapper>
          <Navbar />
          {children}
          <Toaster />
        </ApplicationClientWrapper>
      </body>
    </html>
  );
}
