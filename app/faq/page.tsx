import type { Metadata } from "next";
import Link from "next/link";
import { homepage } from "@/lib/homepage/content";

export const metadata: Metadata = {
  title: "FAQ — Parentive",
  description:
    "Answers to common questions about where Parentive is available, Helpers, and what a visit includes.",
};

export default function FaqPage() {
  return (
    <main id="main-content" className="page faq">
      <h1>{homepage.faq.heading}</h1>
      <dl className="faq-list">
        {homepage.faq.items.map((item) => (
          <div className="faq-item" key={item.question}>
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
      <p className="faq-contact">
        {homepage.faq.contactLead}{" "}
        <Link href={homepage.faq.contactHref} className="text-link">
          {homepage.faq.contactLinkLabel}
        </Link>
      </p>
    </main>
  );
}
