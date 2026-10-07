import { PRIVACY_PAGE } from "@/lib/early-access/copy";

const EFFECTIVE_DATE = "Effective date: October 2, 2026";

function NoticeSections({
  sections,
  headingLevel,
}: {
  sections: ReadonlyArray<{ heading: string; paragraphs: readonly string[] }>;
  headingLevel: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <>
      {sections.map((section) => (
        <section key={section.heading}>
          <Heading>{section.heading}</Heading>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </>
  );
}

const EARLY_ACCESS_SECTIONS = [
  {
    heading: "Information we collect and why",
    paragraphs: [
      "When you join early access, we collect your first name, email address and postal code. You can also choose to share service interests, how often you may need services, and a short note if you select “Other.” These additional details are optional.",
      "We use this information to manage the early-access list, contact you about Parentive pilot opportunities and service availability in your area, and understand demand by region and service type. Your postal code helps us plan service coverage. You can join the list even if you live outside our initial pilot communities. Joining does not guarantee service availability or a place in the pilot.",
      "Please do not include children's names, health information or other sensitive personal information in the optional note.",
      "We also keep a record of your consent choices, when they were given, and the wording or version presented to you, to manage your preferences and document permission to contact you.",
    ],
  },
  {
    heading: "Your communication choices",
    paragraphs: [
      "Joining early access includes permission to email you about pilot invitations and Parentive service availability in your area. This permission is separate from our optional subscription for general Parentive news, updates and offers.",
      "You do not need to subscribe to general marketing to join early access. If you choose that optional subscription, we will use your name and email address to send occasional Parentive news, updates and offers.",
      "You can withdraw either permission at any time using the unsubscribe option in our emails or by contacting admin@parentive.ca. If you withdraw permission for early-access emails, we will stop sending pilot invitations and availability updates. We will honour unsubscribe requests without delay and within 10 business days.",
    ],
  },
  {
    heading: "Access, sharing and protection",
    paragraphs: [
      "Access to early-access information is limited to authorized Parentive personnel and service providers who need it to operate our website, store submissions or send communications on our behalf. We may also disclose information where required or permitted by applicable law. We do not sell your personal information.",
      "We use reasonable administrative and technical safeguards appropriate to the information we hold. No online system can guarantee complete security.",
    ],
  },
  {
    heading: "How long we keep information",
    paragraphs: [
      "We retain early-access information while it is needed to manage the list and the communications you have requested. When it is no longer needed, we delete it or anonymize it, unless continued retention is required or permitted by law. We may retain limited consent and unsubscribe records to document your choices and prevent unwanted communications.",
    ],
  },
  {
    heading: "Questions and requests",
    paragraphs: [
      "To ask about our privacy practices, request access to or correction of your information, withdraw consent, request deletion, or raise a privacy concern, contact Parentive's privacy contact at admin@parentive.ca.",
      "We may need to verify your identity before acting on a request. Access and deletion may be subject to legal exceptions or necessary record retention; we will explain any applicable limitation.",
    ],
  },
  {
    heading: "Updates",
    paragraphs: [
      "We may update this notice as Parentive develops. The effective date above identifies the current notice. We will provide notice of material changes and obtain additional consent where required before using your information for a new purpose.",
    ],
  },
] as const;

const FOUNDING_HELPER_SECTIONS = [
  {
    heading: "Information we collect and why",
    paragraphs: [
      "We collect the information you provide in the application form and any experience document you upload, such as a résumé. We use it to assess your qualifications and suitability for the role, manage the application process and contact you about your application.",
      "Please provide only information relevant to your application. Do not upload your Social Insurance Number, banking details, immigration documents, criminal-record documents or health information. Please do not include confidential information about former clients or children, or references' personal contact details at this stage.",
      "Where references or a criminal-record check are required for a role, we will explain the requirements and arrange these separately later in screening, ordinarily after a conditional offer. We will obtain any required consent before conducting checks.",
    ],
  },
  {
    heading: "Future opportunities are optional",
    paragraphs: [
      "You can separately choose to let Parentive retain your application and contact you about future opportunities. This choice is optional and does not affect consideration of your current application. Applying does not subscribe you to Parentive marketing.",
      "You can withdraw permission for future opportunities at any time by emailing admin@parentive.ca. Withdrawal will stop future-opportunity contact, but does not necessarily require immediate deletion of records we need to retain for the original application or legal purposes.",
    ],
  },
  {
    heading: "Who can access your information",
    paragraphs: [
      "Access is limited to authorized Parentive personnel involved in recruitment and service providers who need the information to support the application process, such as providers of website hosting, secure document storage and email services. We may also disclose information where required or permitted by applicable law. We do not sell applicant information.",
      "We use reasonable administrative and technical safeguards appropriate to the sensitivity of application information, including restricting access to submitted documents. No online system can guarantee complete security.",
    ],
  },
  {
    heading: "Retention",
    paragraphs: [
      "For unsuccessful applicants who have not opted into future opportunities, we ordinarily retain application information for 12 months after the hiring decision.",
      "If you opt into future opportunities, we ordinarily retain your application for up to 24 months after your latest application or your most recent affirmative confirmation of that permission. Internal review of your application does not restart this period.",
      "We may retain relevant records longer where required by law or reasonably necessary for an actual or anticipated complaint, dispute or legal proceeding. When records are no longer needed, we delete them securely or anonymize them.",
      "If you are hired or engaged, relevant information may become part of your employment or engagement records. We will provide further information about those records as part of onboarding.",
    ],
  },
  {
    heading: "Questions and requests",
    paragraphs: [
      "To request access, correction, withdrawal of your application, withdrawal of future-opportunity permission or deletion, or to raise a privacy concern, contact Parentive's privacy contact at admin@parentive.ca.",
      "We may need to verify your identity before acting on a request. Requests are subject to applicable legal requirements and necessary record retention. If we cannot fulfil a request in full, we will explain the reason.",
      "We may update this notice and will provide notice of material changes and obtain additional consent where required before using your information for a new purpose.",
    ],
  },
] as const;

export function EarlyAccessPrivacyNotice() {
  return (
    <>
      <h1>{PRIVACY_PAGE.heading}</h1>
      <p>{EFFECTIVE_DATE}</p>
      <p>
        Your privacy matters to us. Here&apos;s a plain-language look at how we
        handle your information when you join our early-access list.
      </p>
      <p>
        This notice explains how Parentive handles personal information when
        you join our early-access list. It covers early-access registration and
        related communications. It does not cover future service bookings,
        payments or service delivery; we will provide relevant privacy
        information before collecting information for those activities.
      </p>
      <NoticeSections sections={EARLY_ACCESS_SECTIONS} headingLevel="h2" />
    </>
  );
}

export function FoundingHelperApplicationsNotice({
  headingLevel = "h2",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;

  return (
    <section
      id="founding-helper-applications"
      aria-labelledby="founding-helper-applications-heading"
    >
      <Heading
        id="founding-helper-applications-heading"
        className="privacy-notice-title"
      >
        Founding helper applicant privacy notice
      </Heading>
      <p>{EFFECTIVE_DATE}</p>
      <p>
        This notice explains how Parentive handles personal information
        submitted with an initial founding helper application.
      </p>
      <NoticeSections
        sections={FOUNDING_HELPER_SECTIONS}
        headingLevel={headingLevel === "h1" ? "h2" : "h3"}
      />
    </section>
  );
}
