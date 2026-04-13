import type { Metadata } from "next";
import "./globals.css";
import { ChartProvider } from "@/components/ChartContext";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Whole-Star",
  description: "What is already stirring inside you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ChartProvider>
          <Navigation />
          {children}
        </ChartProvider>
      </body>
    </html>
  );
}
