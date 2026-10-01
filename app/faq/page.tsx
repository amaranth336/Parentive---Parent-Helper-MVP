import type { Metadata } from "next";
import { homepage } from "@/lib/homepage/content";

export const metadata: Metadata = {
  title: "FAQ — Parentive",
  description:
    "Answers to common questions about Parentive availability, recurring support, and parent-present help.",
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
    </main>
  );
}
