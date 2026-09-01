import Link from "next/link";
import type { Metadata } from "next";
import {
  PRICING_PRINCIPLES,
  FOUNDING_CUSTOMER_MESSAGING,
  MINIMUM_VISIT_MESSAGING,
  RECURRING_SUPPORT_MESSAGING,
  COMMERCIAL_RULES,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing — Parentive",
  description:
    "Clear, predictable, and fair pricing for Parentive household and family support services. Outcome-based and time-based options with introductory Founding Customer rates during our pilot.",
};

export default function PricingPage() {
  const { cancellationPolicy, paymentTiming, taxTreatment } = COMMERCIAL_RULES;

  return (
    <>
      {/* Header/Navigation */}
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-logo">
            <Link href="/">Parentive</Link>
          </div>
          <nav className="site-nav">
            <Link href="/services">Services</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/about">About</Link>
          </nav>
          <div className="site-header-cta">
            <Link href="/request" className="btn btn-primary">
              Request a visit
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Clear, predictable pricing</h1>
            <p className="hero-description">
              Parentive pricing is designed to feel clear, fair, and
              outcome-oriented. You'll know what you're paying for before your
              visit is confirmed — with no surprise charges.
            </p>
          </div>
        </section>

        {/* Pricing Principles */}
        <section className="section">
          <div className="section-inner">
            <h2 className="section-title">How Parentive pricing works</h2>

            <div className="trust-grid">
              {PRICING_PRINCIPLES.map((principle) => (
                <div key={principle.title} className="trust-item">
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Model Explanation */}
        <section className="section section-brand">
          <div className="section-inner-narrow">
            <h2 className="section-title">Outcome-based and time-based</h2>
            <p className="section-lead">
              Defined services like Laundry Reset or Kitchen Reset are priced
              around the outcome. Time-based support like Parent's Helper Visit
              or Uninterrupted Hour is priced around reserved Helper capacity.
            </p>
            <p
              className="section-lead"
              style={{ marginTop: "20px", fontSize: "16px" }}
            >
              Customers are not exposed to Parentive wage or margin
              calculations. Pricing reflects the value of the result and the
              time committed by your Helper.
            </p>
          </div>
        </section>

        {/* Founding Customer Rate */}
        <section className="section">
          <div className="section-inner">
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <div className="notice notice-info">
                <strong>{FOUNDING_CUSTOMER_MESSAGING.heading}</strong>
                <p style={{ marginTop: "12px", marginBottom: "0" }}>
                  {FOUNDING_CUSTOMER_MESSAGING.description}
                </p>
              </div>

              <p
                className="text-muted"
                style={{ textAlign: "center", marginTop: "12px" }}
              >
                {FOUNDING_CUSTOMER_MESSAGING.note}
              </p>
            </div>
          </div>
        </section>

        {/* Minimum Visit Architecture */}
        <section className="section section-recurring">
          <div className="section-inner">
            <h2 className="section-title">
              {MINIMUM_VISIT_MESSAGING.heading}
            </h2>

            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
              <p
                className="section-lead"
                style={{ textAlign: "center", marginBottom: "20px" }}
              >
                {MINIMUM_VISIT_MESSAGING.description}
              </p>

              <div
                className="notice notice-info"
                style={{ textAlign: "left" }}
              >
                <p style={{ margin: "0 0 12px" }}>
                  {MINIMUM_VISIT_MESSAGING.note}
                </p>
                <p style={{ margin: "0", fontSize: "14px" }}>
                  {MINIMUM_VISIT_MESSAGING.clarification}
                </p>
              </div>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "24px",
                  fontSize: "15px",
                  color: "var(--text-muted)",
                }}
              >
                Services like Uninterrupted Hour remain a fixed one-hour
                customer product — pricing accounts for Parentive's underlying
                visit economics while preserving service structure.
              </p>
            </div>
          </div>
        </section>

        {/* Recurring Support */}
        <section className="section">
          <div className="section-inner">
            <h2 className="section-title">
              {RECURRING_SUPPORT_MESSAGING.heading}
            </h2>

            <p
              className="section-lead"
              style={{
                textAlign: "center",
                maxWidth: "700px",
                margin: "0 auto 40px",
              }}
            >
              {RECURRING_SUPPORT_MESSAGING.description}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              {RECURRING_SUPPORT_MESSAGING.frequencies.map((freq) => (
                <div
                  key={freq.name}
                  style={{
                    background: "var(--panel)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      margin: "0 0 8px",
                      fontWeight: 600,
                    }}
                  >
                    {freq.name}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "14px",
                      margin: "0",
                    }}
                  >
                    {freq.description}
                  </p>
                </div>
              ))}
            </div>

            <p
              className="text-muted"
              style={{ textAlign: "center", maxWidth: "700px", margin: "32px auto 0" }}
            >
              {RECURRING_SUPPORT_MESSAGING.note}
            </p>
          </div>
        </section>

        {/* Time-Based Services Overview */}
        <section className="section section-brand">
          <div className="section-inner">
            <h2 className="section-title">Time-based services</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                marginTop: "40px",
              }}
            >
              <div className="service-card">
                <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                  Uninterrupted Hour
                </h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
                  One hour of focused Helper time.
                </p>
                <p style={{ fontSize: "14px", margin: "0" }}>
                  <strong>Duration:</strong> 1 hour (fixed)
                </p>
              </div>

              <div className="service-card">
                <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                  Parent's Helper Visit
                </h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
                  Flexible household and family support.
                </p>
                <p style={{ fontSize: "14px", margin: "0" }}>
                  <strong>Duration:</strong> 2-hour minimum + 30-min increments
                </p>
              </div>

              <div className="service-card">
                <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                  Flexible Support Request
                </h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
                  Custom support subject to review.
                </p>
                <p style={{ fontSize: "14px", margin: "0" }}>
                  <strong>Duration:</strong> 2-hour minimum + 30-min increments
                  (subject to review)
                </p>
              </div>
            </div>

            <p
              className="text-muted"
              style={{ textAlign: "center", marginTop: "32px", maxWidth: "700px", margin: "32px auto 0" }}
            >
              Pricing for time-based services accounts for Parentive's minimum
              visit economics while preserving customer-facing service structure.
            </p>
          </div>
        </section>

        {/* Outcome-Based Services */}
        <section className="section">
          <div className="section-inner-narrow">
            <h2 className="section-title">Outcome-based services</h2>
            <p className="section-lead">
              Defined catalogue services like Laundry Reset, Kitchen Reset,
              Dinner Prep, and Tomorrow's Lunches support outcome-based pricing.
              You pay for the result, not just the time.
            </p>

            <div style={{ marginTop: "32px" }}>
              <Link
                href="/services"
                className="btn btn-large btn-primary"
                style={{ display: "inline-flex" }}
              >
                View all services
              </Link>
            </div>
          </div>
        </section>

        {/* Orientation */}
        <section className="section section-recurring">
          <div className="section-inner-narrow">
            <h2 className="section-title">Household orientation</h2>
            <p className="section-lead">
              Approximately 10–15 minutes of household orientation at the start
              of a visit helps your Helper work independently and efficiently
              for the rest of the visit.
            </p>
            <p
              className="section-lead"
              style={{ marginTop: "20px", fontSize: "16px" }}
            >
              This brief setup covers household preferences, task expectations,
              supply locations, and relevant boundaries. There is no separate
              orientation fee — it's built into service planning.
            </p>
          </div>
        </section>

        {/* Payment & Cancellation */}
        <section className="section">
          <div className="section-inner">
            <h2 className="section-title">Payment & cancellation</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px",
                maxWidth: "900px",
                margin: "40px auto 0",
              }}
            >
              <div>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
                  Payment timing (pilot)
                </h3>
                <p style={{ color: "var(--text-muted)", margin: "0" }}>
                  Payment is due {paymentTiming.pilotDueHours} hours before your
                  scheduled visit. If booking is confirmed within{" "}
                  {paymentTiming.pilotDueHours} hours, payment is due when the
                  visit is confirmed.
                </p>
                <p
                  style={{
                    color: "var(--text-muted)",
                    margin: "12px 0 0",
                    fontSize: "14px",
                  }}
                >
                  Helpers do not accept Parentive service payments. No cash
                  payment for services.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
                  Cancellation policy
                </h3>
                <p style={{ color: "var(--text-muted)", margin: "0 0 12px" }}>
                  <strong>More than {cancellationPolicy.freeRescheduleBefore}{" "}
                  hours:</strong> Free cancellation or rescheduling
                </p>
                <p style={{ color: "var(--text-muted)", margin: "0 0 12px" }}>
                  <strong>Less than {cancellationPolicy.freeRescheduleBefore}{" "}
                  hours:</strong> {cancellationPolicy.lateCancellationFeeNote}
                </p>
                <p style={{ color: "var(--text-muted)", margin: "0" }}>
                  <strong>No-show / no-access:</strong>{" "}
                  {cancellationPolicy.noShowPolicyNote}
                </p>
              </div>
            </div>

            <p
              className="text-muted"
              style={{ textAlign: "center", marginTop: "32px" }}
            >
              {taxTreatment}
            </p>
          </div>
        </section>

        {/* Scope Changes & Overruns */}
        <section className="section section-brand">
          <div className="section-inner-narrow">
            <h2 className="section-title">Scope changes & estimates</h2>
            <p className="section-lead" style={{ marginBottom: "24px" }}>
              If scope differs when your Helper arrives, we pause, validate the
              revised scope and pricing with you, and get your approval before
              proceeding.
            </p>

            <div className="notice notice-info" style={{ textAlign: "left" }}>
              <strong>Parentive pilot commitment</strong>
              <p style={{ marginTop: "12px", marginBottom: "0" }}>
                If you accurately described the scope and it hasn't changed, but
                Parentive underestimated the service duration, Parentive absorbs
                the additional Helper labour cost during the pilot. We do not
                unexpectedly bill customers — instead, we record the variance to
                improve our service-duration model.
              </p>
            </div>
          </div>
        </section>

        {/* Travel & Add-ons */}
        <section className="section">
          <div className="section-inner">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <div>
                <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                  Travel
                </h3>
                <p style={{ color: "var(--text-muted)", margin: "0" }}>
                  {COMMERCIAL_RULES.travelPolicy}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                  Tipping
                </h3>
                <p style={{ color: "var(--text-muted)", margin: "0" }}>
                  {COMMERCIAL_RULES.tippingPolicy}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="section-inner-narrow">
            <h2 className="section-title">Ready to request a visit?</h2>
            <p className="section-lead">
              Explore our services or submit a request. We'll confirm
              availability and pricing before your visit.
            </p>
            <div className="section-cta-group-centered">
              <Link href="/request" className="btn btn-primary btn-large">
                Request a visit
              </Link>
              <Link href="/services" className="btn btn-ghost btn-large">
                View services
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">Parentive</div>
            <p>
              Trusted, flexible help for the everyday things that keep a
              household and family moving.
            </p>
          </div>

          <div className="footer-nav">
            <div className="footer-nav-group">
              <h4>Services</h4>
              <Link href="/services">All Services</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/how-it-works">How It Works</Link>
            </div>

            <div className="footer-nav-group">
              <h4>Company</h4>
              <Link href="/about">About</Link>
              <Link href="/faq">FAQ</Link>
            </div>

            <div className="footer-nav-group">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Parentive. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
