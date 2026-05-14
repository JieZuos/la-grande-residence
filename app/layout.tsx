import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TransitionProvider from '@/components/animations/TransitionProvider';
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
  title: "La Grande Residence",
  description: "Great place like home, great family environment, great memories to remember!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}