import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, HOW_IT_WORKS_LIFECYCLE, PRELAUNCH_STATUS } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Choose your support, tell us about your household, Parentive reviews your request, we confirm your visit, and your Helper completes the support. Submissions currently collect early-access interest — not confirmed bookings.",
};

export default function HowItWorksPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="section-intro">
          <p className="prelaunch-note">{PRELAUNCH_STATUS}</p>
          <h1>How Parentive works</h1>
          <p className="lead">
            A straightforward path from “this would help” to practical support
            in your home. Because Parentive is pre-launch, submissions currently
            collect early-access and service-interest information. They are not
            confirmed bookings.
          </p>
        </div>

        <ol className="steps cols-5" style={{ listStyle: "none", padding: 0 }}>
          {HOW_IT_WORKS_LIFECYCLE.map((step, index) => (
            <li key={step.title} className="step-block">
              <div className="step-number">{index + 1}</div>
              <h2>{step.title}</h2>
              <p className="card-description">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="card" style={{ marginTop: "var(--space-8)" }}>
          <h2>What a request does today</h2>
          <p>
            Telling Parentive what you’d like off your plate helps us understand
            demand, geography, and the mix of support households actually need.
            When bookings open, Parentive will use that information to follow
            up — not as a promise that a visit is already scheduled.
          </p>
          <div className="cta-row">
            <Link href="/request" className="btn btn-primary">
              {BRAND.customerCta}
            </Link>
            <Link href="/services" className="btn btn-secondary">
              {BRAND.servicesCta}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
