import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Parentive",
  description:
    "Learn how Parentive works — from choosing your support to welcoming your Helper. A simple, transparent process designed for busy families.",
};

export default function HowItWorksPage() {
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
            <h1>How Parentive works</h1>
            <p className="hero-description">
              A simple, transparent process to get the household and family
              support you need — when you need it.
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="section">
          <div className="section-inner">
            <div className="how-steps">
              <div className="how-step">
                <div className="how-step-number">1</div>
                <h3>Choose your support</h3>
                <p>
                  Browse our service catalogue and select one or more services
                  that fit your needs — from laundry and meal prep to flexible
                  household support or an extra pair of hands with the kids.
                </p>
              </div>

              <div className="how-step">
                <div className="how-step-number">2</div>
                <h3>Tell us about your household</h3>
                <p>
                  Share your preferred day, timing, and household details.
                  Let us know what matters to you — allergies, preferences,
                  where things belong, and any important context for your Helper.
                </p>
              </div>

              <div className="how-step">
                <div className="how-step-number">3</div>
                <h3>Parentive reviews your request</h3>
                <p>
                  We review every request to ensure appropriate Helper matching,
                  scheduling feasibility, and clear service expectations. If we
                  need clarification, we'll reach out.
                </p>
              </div>

              <div className="how-step">
                <div className="how-step-number">4</div>
                <h3>We confirm your visit</h3>
                <p>
                  Once reviewed and matched, we confirm your visit details and
                  pricing. You'll know exactly what to expect before your
                  Helper arrives.
                </p>
              </div>

              <div className="how-step">
                <div className="how-step-number">5</div>
                <h3>Your Helper completes the support</h3>
                <p>
                  Your Parentive Helper arrives on time, ready to provide the
                  support you requested. A brief household orientation at the
                  start ensures they can work independently and efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Early Access Note */}
        <section className="section section-brand">
          <div className="section-inner-narrow">
            <div className="notice notice-info">
              <strong>Parentive is currently in early access</strong>
              <p style={{ marginTop: "12px", marginBottom: "0" }}>
                We're carefully validating service delivery, operational
                economics, and customer experience during our 90-day pilot.
                Founding Customer rates are available during this period, and
                we'll use real-world data to finalize standard pricing before
                broader launch.
              </p>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="section">
          <div className="section-inner">
            <h2 className="section-title">What to expect from your visit</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "32px",
                marginTop: "40px",
              }}
            >
              <div className="trust-item">
                <h3>You stay home</h3>
                <p>
                  All Parentive services are designed to take place while you're
                  home. Our parent-helper model means we provide support
                  alongside you, not instead of you.
                </p>
              </div>

              <div className="trust-item">
                <h3>Brief orientation</h3>
                <p>
                  A few minutes at the start to cover household preferences,
                  where things are, and where they should go helps your Helper
                  work confidently and efficiently.
                </p>
              </div>

              <div className="trust-item">
                <h3>Independent execution</h3>
                <p>
                  Once oriented, your Helper works independently on the
                  tasks you've requested — freeing you to focus on work, time
                  with your kids, rest, or whatever else you need.
                </p>
              </div>

              <div className="trust-item">
                <h3>Clear communication</h3>
                <p>
                  If something differs from what was expected, your Helper
                  pauses and checks with you. No surprise decisions or charges.
                </p>
              </div>

              <div className="trust-item">
                <h3>Outcome delivered</h3>
                <p>
                  For defined services, you get the result you requested — a
                  reset laundry basket, prepped meals, a tidied playroom, or
                  whichever outcome you chose.
                </p>
              </div>

              <div className="trust-item">
                <h3>Respectful presence</h3>
                <p>
                  Parentive Helpers are selected for warmth, reliability, and
                  respectful in-home presence. They're here to help, not to
                  judge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recurring vs. One-Time */}
        <section className="section section-recurring">
          <div className="section-inner-narrow">
            <h2 className="section-title">Once, occasionally, or regularly</h2>
            <p className="section-lead">
              Use Parentive once for a one-time reset, occasionally when life
              gets busy, or regularly as part of your household routine.
            </p>
            <p
              className="section-lead"
              style={{ marginTop: "20px", fontSize: "16px" }}
            >
              Some families want a single kitchen reset before hosting guests.
              Others choose recurring weekly support. It's entirely up to you —
              and you can adjust as your needs change.
            </p>

            <div style={{ marginTop: "32px" }}>
              <Link
                href="/pricing"
                className="link-with-arrow"
                style={{ fontSize: "16px" }}
              >
                Learn about recurring support pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="section">
          <div className="section-inner-narrow">
            <h2 className="section-title">Where Parentive is available</h2>
            <p className="section-lead">
              Parentive is currently serving select local neighborhoods during
              our pilot validation period. Check your postal code to see if
              we're available in your area, or join our waitlist for future
              expansion.
            </p>

            <div
              className="section-cta-group-centered"
              style={{ marginTop: "32px" }}
            >
              <Link href="/availability" className="btn btn-primary btn-large">
                Check availability
              </Link>
            </div>
          </div>
        </section>

        {/* Helper Selection */}
        <section className="section section-trust">
          <div className="section-inner">
            <h2 className="section-title">How we choose Helpers</h2>

            <p
              className="section-lead"
              style={{
                textAlign: "center",
                maxWidth: "700px",
                margin: "0 auto 40px",
              }}
            >
              Every Parentive Helper is carefully selected for respectful,
              reliable in-home support. We look for people who bring warmth,
              practical capability, and genuine care to household and family
              work.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "24px",
              }}
            >
              <div className="trust-item">
                <h3>Experience matters</h3>
                <p>
                  We prioritize candidates with real household, childcare, or
                  family-support experience — not just theoretical knowledge.
                </p>
              </div>

              <div className="trust-item">
                <h3>Interpersonal skills</h3>
                <p>
                  Helpers must be respectful, warm, and capable of working
                  collaboratively in someone else's home.
                </p>
              </div>

              <div className="trust-item">
                <h3>Reliable & trustworthy</h3>
                <p>
                  Reliability and integrity are non-negotiable. Helpers are
                  screened and reference-checked accordingly.
                </p>
              </div>

              <div className="trust-item">
                <h3>Practical capability</h3>
                <p>
                  Helpers must be able to independently execute household tasks
                  once oriented — efficiently and with care.
                </p>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "15px",
                  maxWidth: "600px",
                  margin: "0 auto 24px",
                }}
              >
                Interested in joining the Parentive Helper community?
              </p>
              <Link href="/join" className="btn btn-ghost btn-large">
                Join the Hive
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="section section-recurring">
          <div className="section-inner">
            <h2 className="section-title">Common questions</h2>

            <div className="faq-list">
              <details className="faq-item">
                <summary>Do I need to be home during the visit?</summary>
                <p>
                  Yes. All Parentive services are designed to take place while
                  you're home. Our parent-helper model means we provide support
                  alongside you, not instead of you. This ensures safety,
                  clarity, and alignment with your household expectations.
                </p>
              </details>

              <details className="faq-item">
                <summary>
                  Can I book more than one service during a visit?
                </summary>
                <p>
                  Absolutely. Many families combine services — for example, a
                  Laundry Reset with Dinner Prep, or a Kitchen Reset with
                  Playroom Reset. Let us know what you'd like help with, and
                  we'll confirm feasibility and timing.
                </p>
              </details>

              <details className="faq-item">
                <summary>Can I request recurring help?</summary>
                <p>
                  Yes. Parentive is designed to support families on a one-time,
                  occasional, or recurring basis. Recurring visits (weekly,
                  biweekly, or monthly) may qualify for modest incremental
                  savings. Let us know your preferences when you submit your
                  request.
                </p>
              </details>

              <details className="faq-item">
                <summary>What if the scope changes when the Helper arrives?</summary>
                <p>
                  If scope differs from what was described, your Helper will
                  pause and check with you before proceeding. Parentive will
                  review the revised scope, communicate updated pricing if
                  needed, and get your approval before continuing. We don't
                  surprise you with unexpected charges.
                </p>
              </details>

              <details className="faq-item">
                <summary>How far in advance do I need to book?</summary>
                <p>
                  During the pilot, we recommend requesting visits with as much
                  advance notice as possible to ensure Helper availability and
                  scheduling. We'll confirm feasibility when we review your
                  request. Future booking windows may be more flexible as we
                  scale.
                </p>
              </details>

              <details className="faq-item">
                <summary>What payment methods do you accept?</summary>
                <p>
                  Payment details and methods will be confirmed when your visit
                  is approved. Helpers do not accept Parentive service payments
                  directly — all payments are processed through Parentive.
                </p>
              </details>
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/faq" className="link-with-arrow">
                View all frequently asked questions
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="section-inner-narrow">
            <h2 className="section-title">Ready to get started?</h2>
            <p className="section-lead">
              Submit a request and we'll confirm availability and pricing. Or
              explore our full service catalogue first.
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
