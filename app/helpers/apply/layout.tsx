import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply to Join the Hive",
  description:
    "Application for Parentive Helper employment. Share your eligibility, availability, experience and why Parentive.",
};

export default function HelperApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
