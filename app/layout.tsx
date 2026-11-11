import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Inter } from "next/font/google";
import {
  MeasurementBanner,
  MeasurementRoot,
} from "@/components/measurement-consent";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HARD_NAVIGATION_SCRIPT } from "@/lib/analytics/hard-navigation";
import { LANDING_CAPTURE_SCRIPT } from "@/lib/analytics/utm";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Parentive",
  description: "Trusted, flexible help for real life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <Script id="parentive-landing-utm" strategy="beforeInteractive">
          {LANDING_CAPTURE_SCRIPT}
        </Script>
        <Script id="parentive-measurement-navigation" strategy="beforeInteractive">
          {HARD_NAVIGATION_SCRIPT}
        </Script>
        <MeasurementRoot>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          <MeasurementBanner />
          {children}
          <SiteFooter />
        </MeasurementRoot>
      </body>
    </html>
  );
}
