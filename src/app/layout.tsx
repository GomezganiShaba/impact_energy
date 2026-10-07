import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ies.engineer"
  ),
  title: {
    default: "Impact Energy Solution | Solar & Clean Water, Lilongwe, Malawi",
    template: "%s | Impact Energy Solution",
  },
  description:
    "We design and install solar power, irrigation pumping and clean-cooking systems for homes, farms and institutions across Malawi, from a single rooftop to a full mini-grid.",
  keywords: [
    "solar energy Malawi",
    "solar panels Lilongwe",
    "water pumping Malawi",
    "biogas Malawi",
    "clean cooking Malawi",
    "mini-grid Malawi",
    "renewable energy Lilongwe",
    "MERA licensed",
  ],
  openGraph: {
    type: "website",
    locale: "en_MW",
    url: "/",
    siteName: "Impact Energy Solution",
    title: "Impact Energy Solution | Solar & Clean Water, Lilongwe, Malawi",
    description:
      "We design and install solar power, irrigation pumping and clean-cooking systems for homes, farms and institutions across Malawi.",
    images: [
      {
        url: "/images/hero-rooftop.jpg",
        width: 1200,
        height: 630,
        alt: "Solar panel installation by Impact Energy Solution, Lilongwe, Malawi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Impact Energy Solution | Solar & Clean Water, Lilongwe, Malawi",
    description:
      "Solar, water pumping and clean-cooking systems for homes, farms and institutions across Malawi.",
    images: ["/images/hero-rooftop.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "google6918818cc3644739",
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
        className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

