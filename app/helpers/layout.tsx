import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Hive",
  description:
    "Apply to become a Parentive Helper. Founding Helpers help shape Parentive from the beginning.",
};

export default function HelpersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
