import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://metalministry.in'),
  title: {
    default: "Metal Ministry Inc. | Certified Manufacturer & Exporter",
    template: "%s | Metal Ministry Inc."
  },
  description: "ISO 9001:2015 Certified Manufacturer & Exporter of Stainless Steel Pipes, Fittings, Flanges, and High Nickel Alloys. Global Shipping Available.",
  keywords: ["Stainless Steel Pipes", "Pipe Fittings", "Flanges", "Nickel Alloys", "Metal Manufacturer India", "Metal Exporter", "stainless steel pipe 316 electropolished", "5mm aluminum sheets", "gasless flux core wire in bahrain supplier", "4d elbow dimensions", "cupro nickel pipe nipples",
    "flanges", "flanges types", "pipe flange types", "304 stainless steel round bar", "ss 316 pipe", "stainless steel round bar manufacturer in india", "flanged", "pipe flanges", "conflat flanges", "flange"
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://metalministry.in',
    title: "Metal Ministry Inc.",
    description: "Your trusted partner for premium metal products. Certified Manufacturer & Exporter.",
    siteName: "Metal Ministry Inc.",
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/images/logo1.png',
    shortcut: '/images/logo1.png',
    apple: '/images/logo1.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-white text-gray-900`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
