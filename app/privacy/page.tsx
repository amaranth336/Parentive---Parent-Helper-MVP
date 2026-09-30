import type { Metadata } from "next";
import { PRIVACY_PAGE, PRIVACY_POLICY_VERSION } from "@/lib/early-access/copy";
import {
  HELPERS_PATH,
  HELPERS_PRIVACY_POLICY_VERSION,
} from "@/lib/helpers/copy";

export const metadata: Metadata = {
  title: "Privacy notice — Parentive",
  description:
    "How Parentive uses early-access waitlist and Founding Helper application details.",
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
        Stored waitlist consent version: {PRIVACY_POLICY_VERSION}. This page
        describes that version for early-access sign-up. It is not a
        certification or a comprehensive legal policy for every Parentive
        activity.
      </p>

      <section
        id="founding-helper-applications"
        aria-labelledby="founding-helper-applications-heading"
      >
        <h2 id="founding-helper-applications-heading">
          Founding Helper applications
        </h2>
        <p>
          Draft applicant notice — pending owner and legal review. Stored
          application consent version: {HELPERS_PRIVACY_POLICY_VERSION}.
        </p>
        <p>
          Parentive uses your application details and uploaded experience
          document to assess your qualifications, manage hiring and contact you
          about your application. If you separately agree, we may retain your
          application for future opportunities. Only authorized Parentive hiring
          personnel and necessary service providers should access your
          information. To request access, correction, withdrawal or deletion
          where applicable, contact admin@parentive.ca. See our Privacy Policy
          for details on retention and safeguards.
        </p>
        <p>
          Owner-approved intended retention (not legal minimums, and not a
          final published policy):
        </p>
        <ul>
          <li>
            Unsuccessful applicants without future-opportunity opt-in: 12 months
            after the hiring decision, subject to statutory considerations.
          </li>
          <li>
            Applicants who opt into future opportunities: 24 months after the
            latest application or permission confirmation.
          </li>
        </ul>
        <p>
          This section is not a final comprehensive legal policy. Parentive does
          not collect SIN, banking, immigration status documents, criminal-record
          documents, or health information with the initial application.
          References and criminal-record checks, when required, are arranged
          later in screening — ordinarily after a conditional offer — and are
          not uploaded at this stage.
        </p>
      </section>

      <p>
        <a className="text-link" href={PRIVACY_PAGE.backHref}>
          {PRIVACY_PAGE.backLabel}
        </a>
        {" · "}
        <a className="text-link" href={HELPERS_PATH}>
          Back to Join the team
        </a>
      </p>
    </main>
  );
}
