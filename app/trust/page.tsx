import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "How we build trust",
  description:
    "Parentive is being built around intentional Helper selection, clear service expectations, respectful in-home support and reliable communication.",
};

export default function TrustPage() {
  return (
    <main className="section">
      <div className="container narrow">
        <h1>How we build trust</h1>
        <p className="lead">
          Support in your home should feel considered. Parentive is being built
          around intentional Helper selection, clear service expectations,
          respectful in-home support and reliable communication.
        </p>

        <section className="form-section">
          <h2>What this means in practice</h2>
          <ul>
            <li>
              Helpers are Parentive employees, not a pool of unmatched gig
              workers.
            </li>
            <li>
              Services are defined by Parentive, so households know the intended
              outcome before a visit is confirmed.
            </li>
            <li>
              Communication stays with Parentive. Helpers are not expected to
              negotiate the relationship on their own.
            </li>
            <li>
              For parent-home child support, Helpers will be selected for their
              ability to engage meaningfully with children — not simply provide
              passive supervision.
            </li>
          </ul>
        </section>

        <section className="form-section">
          <h2>What we will not claim yet</h2>
          <p>
            Screening, certification, insurance, and background-check language
            will only appear here once those requirements are actually in place.
            Parentive’s hiring process is being built so that a criminal-record
            check is requested after a conditional offer — not as a marketing
            claim in advance.
          </p>
        </section>

        <div className="cta-row">
          <Link href="/helpers" className="btn btn-secondary">
            {BRAND.recruitmentCta}
          </Link>
          <Link href="/request" className="btn btn-primary">
            {BRAND.customerCta}
          </Link>
        </div>
      </div>
    </main>
  );
}
