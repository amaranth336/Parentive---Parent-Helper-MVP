import type { Metadata } from "next";
import { PRIVACY_PAGE, PRIVACY_POLICY_VERSION } from "@/lib/early-access/copy";

export const metadata: Metadata = {
  title: "Privacy notice — Parentive",
  description:
    "How Parentive uses early-access waitlist details, including separate pilot-contact and optional marketing consent.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="page">
      <h1>{PRIVACY_PAGE.heading}</h1>
      <p>{PRIVACY_PAGE.versionLabel}</p>
      {PRIVACY_PAGE.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p>
        Stored consent version: {PRIVACY_POLICY_VERSION}. This page is that
        version, not a certification or a comprehensive legal policy.
      </p>
      <p>
        <a className="text-link" href={PRIVACY_PAGE.backHref}>
          {PRIVACY_PAGE.backLabel}
        </a>
      </p>
    </main>
  );
}
