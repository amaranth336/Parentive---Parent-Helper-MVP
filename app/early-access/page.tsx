import type { Metadata } from "next";
import { EarlyAccessPageContent } from "@/components/early-access-page-content";
import { EARLY_ACCESS_SUPPORTING } from "@/lib/early-access/copy";

export const metadata: Metadata = {
  title: "Early access — Parentive",
  description: EARLY_ACCESS_SUPPORTING,
};

export default function EarlyAccessPage() {
  return <EarlyAccessPageContent />;
}
