import type { Metadata } from "next";
import { EarlyAccessForm } from "@/components/early-access-form";
import {
  EARLY_ACCESS_HEADING,
  EARLY_ACCESS_SUPPORTING,
} from "@/lib/early-access/copy";
import {
  formatPilotCommunityList,
  PILOT_COMMUNITIES,
} from "@/lib/service-area/communities";

export const metadata: Metadata = {
  title: "Early access — Parentive",
  description: EARLY_ACCESS_SUPPORTING,
};

export default function EarlyAccessPage() {
  return (
    <main id="main-content" className="page early-access">
      <h1>{EARLY_ACCESS_HEADING}</h1>
      <p>{EARLY_ACCESS_SUPPORTING}</p>
      <p className="early-access-communities">
        We are preparing a pilot in {formatPilotCommunityList(PILOT_COMMUNITIES)}.
      </p>
      <EarlyAccessForm />
    </main>
  );
}
