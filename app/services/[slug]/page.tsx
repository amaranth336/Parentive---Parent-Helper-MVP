import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATALOGUE,
  PREORDERED_PICKUP_ADDON,
  getServiceBySlug,
} from "@/lib/catalogue";
import { BRAND, PRELAUNCH_STATUS } from "@/lib/content/site";

interface ServicePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return CATALOGUE.map((service) => ({ slug: service.public.slug }));
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return { title: "Service not found" };
  }

  return {
    title: service.public.seo.title,
    description: service.public.seo.description,
    openGraph: {
      title: `${service.public.name} — Parentive`,
      description: service.public.seo.description,
    },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const related = service.public.relatedServices
    .map((slug) => getServiceBySlug(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const includesPickup = service.public.eligibleAddOns.includes(
    PREORDERED_PICKUP_ADDON
  );

  return (
    <main className="section">
      <div className="container narrow">
        <p className="prelaunch-note">{PRELAUNCH_STATUS}</p>
        <p className="text-sm text-muted" style={{ marginBottom: "var(--space-3)" }}>
          <Link href="/services">All services</Link>
        </p>
        <h1>{service.public.name}</h1>
        <p className="lead">{service.public.shortDescription}</p>

        <section className="form-section">
          <h2>Outcome</h2>
          <p>{service.public.detailedDescription}</p>
        </section>

        <section className="form-section">
          <h2>What this can include</h2>
          <ul>
            {service.public.inclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="form-section">
          <h2>What you’ll provide</h2>
          <ul>
            {service.public.customerPrerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="form-section">
          <h2>What to expect</h2>
          <p>{service.public.serviceProcess}</p>
          {service.public.requiresReview ? (
            <p>
              This request is reviewed individually before Parentive can confirm
              fit, timing, or a future visit.
            </p>
          ) : null}
        </section>

        <section className="form-section">
          <h2>Good to know</h2>
          <ul>
            {service.public.importantNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {includesPickup ? (
              <li>
                Pre-ordered Pickup may be added when a household has already
                placed and paid for an order that is ready for collection. The
                Helper does not independently shop or front funds. Pricing for
                this add-on is time plus a kilometre fee, with rates still to be
                finalized.
              </li>
            ) : null}
          </ul>
        </section>

        {related.length > 0 ? (
          <section className="form-section">
            <h2>Combine it with</h2>
            <div className="card-grid">
              {related.map((item) => (
                <Link
                  key={item.public.slug}
                  href={`/services/${item.public.slug}`}
                  className="card"
                >
                  <h3 className="card-title">{item.public.name}</h3>
                  <p className="card-description">
                    {item.public.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="card card-emphasis">
          <h2>{BRAND.customerCta}</h2>
          <p>
            Submitting a request tells Parentive what support you’re looking
            for. It does not confirm a booking.
          </p>
          <div className="cta-row">
            <Link href="/request" className="btn btn-primary">
              {BRAND.customerCta}
            </Link>
            <Link href="/services" className="btn btn-secondary">
              Back to services
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
