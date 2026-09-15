import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "We’ve got it",
  description:
    "Parentive has saved your support request. Parentive is preparing for launch and isn’t accepting confirmed bookings yet.",
};

export default function RequestConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
