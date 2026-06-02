import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu - CafeFlow",
  description: "Order from our delicious menu",
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
