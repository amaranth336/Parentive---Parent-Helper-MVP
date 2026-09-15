import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application received",
  description:
    "We’ve received your Parentive Helper application and will review it as we assemble our Founding Helper team.",
};

export default function HelperConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
