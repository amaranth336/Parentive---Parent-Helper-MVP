import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/typography";
import { OrganicBrandSurface } from "@/components/brand/organic-shape";
import {
  BRAND,
  DIFFERENTIATION,
  FAQS,
  HOMEPAGE_FAMILIES,
  HOW_IT_WORKS_PREVIEW,
  RECURRING_RHYTHMS,
  SERVICE_AREA_LINE,
} from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Take something off your plate",
  description:
    "Parentive gives families flexible, practical help with the everyday work that keeps home life moving — from laundry and meal prep to parent-home child support.",
  openGraph: {
    title: "Parentive — Take something off your plate",
    description:
      "Trusted, flexible help for real life. Practical household and family support for modern family life.",
  },
};

export default function HomePage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <OrganicBrandSurface
            shape="open"
            color="sand"
            className="hero-surface"
          >
            <div className="section-intro">
              <Eyebrow>Practical support for modern family life</Eyebrow>
              <h1>{BRAND.proposition}</h1>
              <p className="lead">
                Parentive gives families flexible, practical help with the
                everyday work that keeps home life moving — from laundry and meal
                prep to parent-home child support and everything in between.
              </p>
              <div className="cta-row">
                <Link href="/request" className="btn btn-primary btn-lg">
                  {BRAND.customerCta}
                </Link>
                <Link href="/services" className="btn btn-secondary btn-lg">
                  {BRAND.servicesCta}
                </Link>
              </div>
              <p className="text-sm text-muted" style={{ marginTop: "var(--space-6)" }}>
                {SERVICE_AREA_LINE}
              </p>
            </div>
          </OrganicBrandSurface>
        </div>
      </section>

      <section className="section section-alt" id="services">
        <div className="container">
          <div className="section-intro">
            <h2>What would you like off your plate?</h2>
            <p className="lead">
              Choose one thing or combine a few. Parentive is designed around
              the way household life actually works.
            </p>
          </div>
          <div className="card-grid cols-4">
            {HOMEPAGE_FAMILIES.map((family) => (
              <Link key={family.id} href={family.href} className="card">
                <h3 className="card-title">{family.name}</h3>
                <p className="card-description">{family.description}</p>
              </Link>
            ))}
          </div>
          <div className="cta-row">
            <Link href="/services" className="btn btn-primary">
              Explore all services
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-intro">
            <h2>A simpler way to ask for help</h2>
          </div>
          <div className="steps cols-4">
            {HOW_IT_WORKS_PREVIEW.map((step, index) => (
              <div key={step.title} className="step-block">
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p className="text-muted">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="cta-row">
            <Link href="/how-it-works" className="btn btn-secondary">
              How Parentive works
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-intro">
            <h2>Help doesn’t have to be a one-off.</h2>
            <p className="lead">
              Some households need an extra pair of hands every week. Others
              want a reset every couple of weeks, once a month, or only when
              life calls for it. Parentive is being built to support all of
              those rhythms.
            </p>
          </div>
          <div className="stack-grid cols-4">
            {RECURRING_RHYTHMS.map((rhythm) => (
              <div key={rhythm.name} className="stack-item">
                <h3>{rhythm.name}</h3>
                <p>{rhythm.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-intro">
            <h2>A different kind of household support</h2>
            <p className="lead">
              Somewhere between cleaning, childcare and the everyday tasks that
              keep a household running, there’s a lot of life that still needs
              doing. Parentive is built for that space.
            </p>
          </div>
          <div className="stack-grid cols-2">
            {DIFFERENTIATION.map((item) => (
              <div key={item.name} className="stack-item">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-intro">
            <h2>Support in your home should feel considered.</h2>
            <p className="lead">
              Parentive is being built around intentional Helper selection,
              clear service expectations, respectful in-home support and
              reliable communication.
            </p>
            <p>
              For parent-home child support, Helpers will be selected for their
              ability to engage meaningfully with children — not simply provide
              passive supervision.
            </p>
            <div className="cta-row">
              <Link href="/trust" className="btn btn-secondary">
                How we build trust
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-intro">
            <h2>Clear pricing. No guesswork.</h2>
            <p className="lead">
              Parentive is being designed around straightforward pricing that
              matches the kind of support you choose. Defined services are
              priced around the outcome, while flexible support is based on
              reserved Helper time.
            </p>
            <p>Pilot pricing is being finalized before bookings open.</p>
            <div className="cta-row">
              <Link href="/pricing" className="btn btn-secondary">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-intro">
            <h2>Why Parentive</h2>
            <hr className="honey-rule" />
            <p className="lead">
              Modern households carry a lot, and the help available to them
              often comes in narrow categories. You can hire someone to clean.
              You can find childcare. You can outsource a particular task. But
              everyday family life rarely fits neatly into one of those boxes.
            </p>
            <p>
              Parentive was built around a simpler idea: practical support
              should be easier to access, more flexible in what it can cover,
              and a normal part of how families create capacity for the things
              that matter to them.
            </p>
            <p>Built by parents, for modern family life.</p>
          </div>
        </div>
      </section>

      <section className="section-emphasis brand-moment">
        <OrganicBrandSurface shape="quiet-edge" color="sage">
          <div className="container">
            <h2>{BRAND.payoff}</h2>
            <p>{BRAND.belief}</p>
          </div>
        </OrganicBrandSurface>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="section-intro">
            <h2>Questions, answered simply</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="cta-row">
            <Link href="/faq" className="btn btn-secondary">
              See all FAQs
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-emphasis">
        <div className="container">
          <div className="section-intro">
            <h2>What could you take off your plate?</h2>
            <p className="lead">
              Parentive is preparing for pilot launch. Tell us what kind of
              support would make more room in your household.
            </p>
            <div className="cta-row">
              <Link href="/request" className="btn btn-primary btn-lg">
                {BRAND.customerCta}
              </Link>
              <Link href="/services" className="btn btn-secondary btn-lg">
                {BRAND.servicesCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
