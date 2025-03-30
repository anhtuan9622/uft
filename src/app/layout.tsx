import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Universal FT - Premarket news analysis for the modern investor.",
  description: "Premarket news analysis for the modern investor.",
  icons: {
    icon: "/favicon.svg",
  },
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal FT",
    description: "Premarket news analysis for the modern investor.",
    images: ["/og-image.png"],
  },
  openGraph: {
    title: "Universal FT",
    description: "Premarket news analysis for the modern investor.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="mx-auto min-h-screen max-w-screen-xl p-4">
        {children}
      </body>
    </html>
  );
}
