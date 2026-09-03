import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Parentive Support",
  description:
    "Tell us what you'd like help with. Parentive is preparing for launch and will use your request to understand the support you're looking for.",
};

export default function RequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
