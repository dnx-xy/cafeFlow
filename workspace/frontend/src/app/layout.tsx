import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CafeFlow - Customer Growth Platform for Cafes",
  description: "Turn QR scans into customers, reviews, loyalty members, and repeat sales. Digital menu, customer loyalty, review generation, and customer insights in one simple platform.",
  keywords: ["cafe", "restaurant", "digital menu", "QR code", "loyalty program", "customer reviews", "POS"],
  authors: [{ name: "CafeFlow" }],
  openGraph: {
    title: "CafeFlow - Customer Growth Platform for Cafes",
    description: "Turn QR scans into customers, reviews, loyalty members, and repeat sales.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
