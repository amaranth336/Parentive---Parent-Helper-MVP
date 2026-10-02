import type { Metadata } from "next";
import { EarlyAccessPrivacyNotice } from "@/components/privacy-notices";
import { CONTACT_PATH } from "@/lib/contact/copy";
import { PRIVACY_PAGE } from "@/lib/early-access/copy";

export const metadata: Metadata = {
  title: "Early-access privacy notice — Parentive",
  description:
    "How Parentive handles personal information when you join the early-access list.",
};

export default function PrivacyNoticePage() {
  return (
    <main id="main-content" className="page">
      <EarlyAccessPrivacyNotice />
      <p>
        <a className="text-link" href={PRIVACY_PAGE.backHref}>
          {PRIVACY_PAGE.backLabel}
        </a>
        {" · "}
        <a className="text-link" href={CONTACT_PATH}>
          Back to contact
        </a>
      </p>
    </main>
  );
}
