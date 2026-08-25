import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parentive — Parent Helper",
  description:
    "A lightweight parent helper for tracking your children's daily routines.",
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
