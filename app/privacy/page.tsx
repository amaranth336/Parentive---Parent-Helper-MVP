import type { Metadata } from "next";
import {
  EarlyAccessPrivacyNotice,
  FoundingHelperApplicationsNotice,
  WebsiteMeasurementNotice,
} from "@/components/privacy-notices";
import { HELPERS_PATH } from "@/lib/helpers/copy";

export const metadata: Metadata = {
  title: "Privacy notices — Parentive",
  description:
    "How Parentive handles early-access information, founding helper applications, and optional website measurement.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="page">
      <EarlyAccessPrivacyNotice />
      <FoundingHelperApplicationsNotice />
      <WebsiteMeasurementNotice />
      <p>
        <a className="text-link" href={HELPERS_PATH}>
          Back to Join the team
        </a>
      </p>
    </main>
  );
}
