import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parentive — Trusted, flexible help for real life",
  description: "Take something off your plate. Trusted, flexible help with the everyday things that keep a household and family moving — from laundry and meal prep to an extra pair of hands with the kids.",
};

export default function HomePage() {
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
            <h1>Take something off your plate.</h1>
            <p className="hero-description">
              Trusted, flexible help with the everyday things that keep a household and family moving — from laundry and meal prep to an extra pair of hands with the kids.
            </p>
            <div className="hero-cta">
              <Link href="/request" className="btn btn-primary btn-large">
                Request a visit
              </Link>
              <Link href="/services" className="btn btn-ghost btn-large">
                See services
              </Link>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="section section-categories">
          <div className="section-inner">
            <h2 className="section-title">What Parentive can take off your plate</h2>
            <div className="categories-grid">
              <Link href="/services#home-laundry" className="category-card">
                <h3>Home resets</h3>
                <p>Laundry, bedrooms, playrooms, kitchens and everyday household resets.</p>
              </Link>
              <Link href="/services#kitchen-food" className="category-card">
                <h3>Food & prep</h3>
                <p>Meal prep, lunches, produce prep and kitchen support.</p>
              </Link>
              <Link href="/services#family-support" className="category-card">
                <h3>Kids & family</h3>
                <p>An extra pair of hands while you&apos;re home, child engagement and parent-helper support.</p>
              </Link>
              <Link href="/services#flexible-support" className="category-card">
                <h3>Everyday life</h3>
                <p>Flexible practical support that doesn&apos;t fit neatly into one household category.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section section-how">
          <div className="section-inner">
            <h2 className="section-title">How Parentive works</h2>
            <div className="how-steps">
              <div className="how-step">
                <div className="how-step-number">1</div>
                <h3>Choose what you&apos;d like help with</h3>
                <p>Select one or more Parentive services.</p>
              </div>
              <div className="how-step">
                <div className="how-step-number">2</div>
                <h3>Tell us when you need it</h3>
                <p>Share your preferred day, timing and household details.</p>
              </div>
              <div className="how-step">
                <div className="how-step-number">3</div>
                <h3>We&apos;ll confirm your visit</h3>
                <p>Submit a request and we&apos;ll confirm availability.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Flexible Support / Recurring */}
        <section className="section section-recurring">
          <div className="section-inner section-inner-narrow">
            <h2 className="section-title">Support can be part of the routine</h2>
            <p className="section-lead">
              Some families want a one-time kitchen reset. Others choose recurring support every week. Parentive works however often makes sense for your household — once, occasionally, or as part of your normal routine.
            </p>
          </div>
        </section>

        {/* Brand Moment */}
        <section className="section section-brand">
          <div className="section-inner section-inner-narrow">
            <h2 className="section-title-large">Make room for life.</h2>
            <p className="section-lead">
              Sometimes the most useful thing another pair of hands can give you isn&apos;t a finished load of laundry or a prepped dinner. It&apos;s what that time makes room for. Work. Time with your kids. Rest. Dinner together. Or simply choosing not to do that task yourself.
            </p>
          </div>
        </section>

        {/* Trust */}
        <section className="section section-trust">
          <div className="section-inner">
            <h2 className="section-title">What you can expect</h2>
            <div className="trust-grid">
              <div className="trust-item">
                <h3>Carefully selected Helpers</h3>
                <p>Every Parentive Helper is chosen with care and matched to your household needs.</p>
              </div>
              <div className="trust-item">
                <h3>Clear service expectations</h3>
                <p>Know exactly what&apos;s included in each service before you request.</p>
              </div>
              <div className="trust-item">
                <h3>Transparent pricing</h3>
                <p>Straightforward pricing for every service during our pilot phase.</p>
              </div>
              <div className="trust-item">
                <h3>Respectful in-home support</h3>
                <p>Helpers work with your household systems and respect your home.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Helpers / Hive */}
        <section className="section section-helpers">
          <div className="section-inner section-inner-narrow">
            <h2 className="section-title">The right kind of help feels human</h2>
            <p className="section-lead">
              Parentive Helpers are real people who understand that every household is different. They bring practical skills, attention to detail, and respect for the way your home works.
            </p>
            <div className="section-cta-group">
              <Link href="/trust" className="link-with-arrow">
                Learn how we choose Helpers
              </Link>
              <Link href="/join" className="link-with-arrow">
                Join the Hive
              </Link>
            </div>
          </div>
        </section>

        {/* Local Service Area */}
        <section className="section section-local">
          <div className="section-inner section-inner-narrow">
            <h2 className="section-title">Local service, starting here</h2>
            <p className="section-lead">
              Parentive is currently available in select areas. Check if we serve your neighbourhood.
            </p>
            <Link href="/service-area" className="btn btn-ghost">
              Check availability
            </Link>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="section section-faq">
          <div className="section-inner">
            <h2 className="section-title">Common questions</h2>
            <div className="faq-list">
              <details className="faq-item">
                <summary>Do I need to be home?</summary>
                <p>For most services, yes. Parentive Helpers work while you&apos;re home, providing support that creates capacity for you during the visit. Some services like laundry or kitchen resets can happen while you focus on other things in your home.</p>
              </details>
              <details className="faq-item">
                <summary>Can I book more than one service during a visit?</summary>
                <p>Yes. Many families combine services — like a kitchen reset with meal prep, or laundry with a playroom reset. Just let us know what you&apos;d like during your request.</p>
              </details>
              <details className="faq-item">
                <summary>Can I request recurring help?</summary>
                <p>Absolutely. Some households use Parentive once, while others schedule regular visits weekly or biweekly. We&apos;ll work with you to find a rhythm that fits your routine.</p>
              </details>
              <details className="faq-item">
                <summary>Where is Parentive available?</summary>
                <p>Parentive is currently operating in select local areas as we grow. Check our service area page to see if we&apos;re available in your neighbourhood.</p>
              </details>
            </div>
            <Link href="/faq" className="link-with-arrow">
              See all questions
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section section-final-cta">
          <div className="section-inner section-inner-narrow">
            <h2 className="section-title-large">What would you like off your plate?</h2>
            <div className="section-cta-group-centered">
              <Link href="/request" className="btn btn-primary btn-large">
                Request a visit
              </Link>
              <Link href="/services" className="btn btn-ghost btn-large">
                See services
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
            <p>Trusted, flexible help for real life.</p>
          </div>
          <nav className="footer-nav">
            <div className="footer-nav-group">
              <h4>Services</h4>
              <Link href="/services">All services</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/service-area">Service area</Link>
            </div>
            <div className="footer-nav-group">
              <h4>Company</h4>
              <Link href="/about">About</Link>
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/trust">Trust & Safety</Link>
              <Link href="/faq">FAQ</Link>
            </div>
            <div className="footer-nav-group">
              <h4>Join Us</h4>
              <Link href="/join">Join the Hive</Link>
            </div>
            <div className="footer-nav-group">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Parentive. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
