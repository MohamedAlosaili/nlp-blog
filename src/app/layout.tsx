import type { Metadata, Viewport } from "next";
import { mada } from "@/lib/fonts";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { generalMetadata } from "@/constants/server";

export const metadata: Metadata = generalMetadata;

export const viewport: Viewport = {
  width: "device-width",
  viewportFit: "cover",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${mada.className} bg-main text-main`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
