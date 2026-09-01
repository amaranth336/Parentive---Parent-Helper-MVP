import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parentive — Trusted, flexible help for real life",
  description:
    "Take something off your plate. Parentive provides trusted, flexible help with everyday household tasks and family support — from laundry and meal prep to parent-home childcare.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
