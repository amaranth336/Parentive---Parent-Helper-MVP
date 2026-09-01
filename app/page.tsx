import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <h1>Take something off your plate.</h1>
          <p className="hero-subtitle">
            Trusted, flexible help with the everyday things that keep a
            household and family moving — from laundry and meal prep to an extra
            pair of hands with the kids.
          </p>
          <div className="hero-cta">
            <Link href="#request" className="btn btn-primary">
              Take it off my plate
            </Link>
            <Link href="#services" className="btn btn-secondary">
              See services
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section">
          <div className="section-centered">
            <h2 className="section-title">
              What Parentive can take off your plate
            </h2>
            <p className="section-subtitle">
              Choose from a range of practical household and family support designed for real life.
            </p>
          </div>

          <div className="services-grid">
            <Link href="#home-resets" className="service-card">
              <span className="service-card-icon">🏠</span>
              <h3>Home resets</h3>
              <p>
                Laundry, bedrooms, playrooms, kitchens and everyday household
                resets.
              </p>
            </Link>

            <Link href="#food-prep" className="service-card">
              <span className="service-card-icon">🥗</span>
              <h3>Food & prep</h3>
              <p>
                Meal prep, lunches, produce prep and kitchen support.
              </p>
            </Link>

            <Link href="#kids-family" className="service-card">
              <span className="service-card-icon">👨‍👩‍👧‍👦</span>
              <h3>Kids & family</h3>
              <p>
                An extra pair of hands while you&apos;re home, child engagement and
                parent-helper support.
              </p>
            </Link>

            <Link href="#everyday-life" className="service-card">
              <span className="service-card-icon">✨</span>
              <h3>Everyday life</h3>
              <p>
                Flexible practical support that doesn&apos;t fit neatly into one
                household category.
              </p>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section" style={{ background: 'var(--bg-soft)' }}>
          <div className="section-centered">
            <h2 className="section-title">How Parentive works</h2>
            <p className="section-subtitle">
              A simple process to get the support you need, when you need it.
            </p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Choose what you&apos;d like help with</h3>
              <p>Select one or more Parentive services that fit your needs.</p>
            </div>

            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Tell us when you need it</h3>
              <p>
                Share your preferred day, timing and household details.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">3</div>
              <h3>We&apos;ll confirm your visit</h3>
              <p>
                Parentive reviews the request and matches the appropriate
                support.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              Submit a request and we&apos;ll confirm availability.
            </p>
          </div>
        </section>

        {/* Flexible Support Section */}
        <section className="section">
          <div className="section-centered">
            <h2 className="section-title">Support can be part of the routine</h2>
            <p className="section-subtitle">
              Use Parentive once, occasionally, regularly, or as part of your
              normal household routine. Some families want a one-time kitchen
              reset. Others choose recurring support every week. It&apos;s entirely
              up to you.
            </p>
          </div>
        </section>

        {/* Brand Moment Section */}
        <section className="brand-moment">
          <h2>Make room for life.</h2>
          <p>
            Sometimes the most useful thing another pair of hands can give you
            isn&apos;t a finished load of laundry or a prepped dinner. It&apos;s what that
            time makes room for — work, time with your children, rest, hobbies,
            or simply choosing not to do that task yourself.
          </p>
        </section>

        {/* Trust Section */}
        <section className="section">
          <div className="section-centered">
            <h2 className="section-title">What you can expect</h2>
            <p className="section-subtitle">
              Parentive Helpers are carefully selected for respectful, reliable
              in-home support. Clear service expectations, transparent pricing,
              and reliable communication are part of every visit.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-item">
              <h3>Carefully selected</h3>
              <p>Every Parentive Helper is chosen with care and attention.</p>
            </div>

            <div className="feature-item">
              <h3>Clear expectations</h3>
              <p>You&apos;ll know exactly what to expect from each service.</p>
            </div>

            <div className="feature-item">
              <h3>Transparent pricing</h3>
              <p>No surprise fees. Straightforward pricing for every service.</p>
            </div>

            <div className="feature-item">
              <h3>Reliable communication</h3>
              <p>Stay informed throughout the entire process.</p>
            </div>
          </div>
        </section>

        {/* Helpers Section */}
        <section className="section" style={{ background: 'var(--bg-soft)' }}>
          <div className="section-centered">
            <h2 className="section-title">The right kind of help feels human</h2>
            <p className="section-subtitle">
              Parentive Helpers bring warmth, care, and practical skills to
              every visit. Learn more about how we choose the people behind
              the service.
            </p>
            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="#trust" className="btn btn-secondary">
                How we choose Helpers
              </Link>
              <Link href="#join" className="btn btn-secondary">
                Join the Hive
              </Link>
            </div>
          </div>
        </section>

        {/* Local Service Area */}
        <section className="section">
          <div className="section-centered">
            <h2 className="section-title">Supporting families locally</h2>
            <p className="section-subtitle">
              Parentive is currently serving select neighborhoods. Enter your
              postal code to check if we&apos;re available in your area, or join our
              waitlist for future expansion.
            </p>
            <div style={{ marginTop: '32px' }}>
              <Link href="#availability" className="btn btn-primary">
                Check availability
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="section-narrow" style={{ background: 'var(--bg-soft)' }}>
          <div className="section-centered">
            <h2 className="section-title">Frequently asked questions</h2>
          </div>

          <div className="faq-list">
            <div className="faq-item">
              <h3 className="faq-question">Do I need to be home?</h3>
              <p className="faq-answer">
                Yes. All Parentive services are designed to take place while
                you&apos;re home. Our parent-helper model means we provide support
                alongside you, not instead of you.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">
                Can I book more than one service during a visit?
              </h3>
              <p className="faq-answer">
                Absolutely. Many families combine services — for example, a
                kitchen reset with meal prep, or laundry with playroom tidying.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Can I request recurring help?</h3>
              <p className="faq-answer">
                Yes. Parentive is designed to support families on a one-time,
                occasional, or recurring basis. Let us know your preferences
                when you submit your request.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">How does Parentive choose Helpers?</h3>
              <p className="faq-answer">
                Every Parentive Helper is selected with care based on
                experience, reliability, and interpersonal skills. We look for
                people who bring warmth and practical capability to household
                and family support.
              </p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Where is Parentive available?</h3>
              <p className="faq-answer">
                Parentive is currently serving select local neighborhoods.
                Check your postal code to see if we&apos;re available in your area.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="#faq-full" className="btn btn-secondary">
              View all questions
            </Link>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="request" className="section section-centered">
          <h2 className="section-title">What would you like off your plate?</h2>
          <p className="section-subtitle">
            Start by exploring our services or submit a request for your first
            visit.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
            <Link href="#request-form" className="btn btn-primary">
              Take it off my plate
            </Link>
            <Link href="#services" className="btn btn-secondary">
              See services
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
