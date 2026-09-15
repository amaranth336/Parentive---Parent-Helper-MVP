import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, FAQS } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Parentive household and family support, parent-home child support, recurring help, and where Parentive is preparing to launch.",
};

const ADDITIONAL = [
  {
    question: "Can I combine services?",
    answer:
      "Yes. You can choose one service or combine several into the same visit. Parentive reviews the combination so the timing makes sense.",
  },
  {
    question: "Is this a booking?",
    answer:
      "Not yet. Parentive is preparing for pilot launch and isn’t accepting confirmed bookings. A request helps us understand the support you’re looking for.",
  },
  {
    question: "How are Helpers chosen for child support?",
    answer:
      "For parent-home child support, Helpers will be selected for their ability to engage meaningfully with children — not simply provide passive supervision. Screening and certification claims will only be stated once those processes are in place.",
  },
];

export default function FaqPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="section-intro">
          <h1>Frequently asked questions</h1>
          <p className="lead">
            Practical answers about what Parentive is, what it can help with,
            and how to ask for support while the pilot is being prepared.
          </p>
        </div>
        <div className="faq-list">
          {[...FAQS, ...ADDITIONAL].map((item) => (
            <details key={item.question} className="faq-item" open>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <div className="cta-row">
          <Link href="/request" className="btn btn-primary">
            {BRAND.customerCta}
          </Link>
          <Link href="/services" className="btn btn-secondary">
            {BRAND.servicesCta}
          </Link>
        </div>
      </div>
    </main>
  );
}
