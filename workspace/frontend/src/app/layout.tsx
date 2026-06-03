import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/i18n/context";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
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
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <I18nProvider>
          {children}
          <Toaster position="top-right" richColors />
        </I18nProvider>
      </body>
    </html>
  );
}
