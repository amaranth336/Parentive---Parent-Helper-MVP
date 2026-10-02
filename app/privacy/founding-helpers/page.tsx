import type { Metadata } from "next";
import { FoundingHelperApplicationsNotice } from "@/components/privacy-notices";
import { HELPERS_PATH } from "@/lib/helpers/copy";

export const metadata: Metadata = {
  title: "Founding helper applicant privacy notice — Parentive",
  description:
    "How Parentive handles personal information submitted with a founding helper application.",
};

export default function FoundingHelperNoticePage() {
  return (
    <main id="main-content" className="page">
      <FoundingHelperApplicationsNotice headingLevel="h1" />
      <p>
        <a className="text-link" href={HELPERS_PATH}>
          Back to Join the team
        </a>
      </p>
    </main>
  );
}
