import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, groupServicesByCategory } from "@/lib/catalogue";
import { BRAND, PRELAUNCH_STATUS } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Choose one Parentive service or combine a few. Practical household and family support across home and laundry, kitchen and food, parent-home child support, and flexible requests.",
};

export default function ServicesPage() {
  const categories = getCategories();
  const servicesByCategory = groupServicesByCategory();

  return (
    <main className="section">
      <div className="container">
        <div className="section-intro">
          <p className="prelaunch-note">{PRELAUNCH_STATUS}</p>
          <h1>What would you like off your plate?</h1>
          <p className="lead">
            Choose one service or combine a few. Parentive is designed around
            practical support that fits the way your household actually works.
          </p>
        </div>

        {categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="form-section"
            style={{ marginBottom: "var(--space-12)" }}
          >
            <h2>{category.name}</h2>
            <p className="lead">{category.description}</p>
            <div className="card-grid cols-2">
              {servicesByCategory[category.id].map((service) => (
                <article key={service.public.slug} className="card">
                  <h3 className="card-title">{service.public.name}</h3>
                  <p className="card-description">
                    {service.public.shortDescription}
                  </p>
                  <div className="cta-row">
                    <Link
                      href={`/services/${service.public.slug}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Learn more
                    </Link>
                    <Link href="/request" className="btn btn-primary btn-sm">
                      {BRAND.customerCta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="card">
          <h2>Ready to tell us what would help?</h2>
          <p>
            Requests currently collect early-access interest. They are not
            confirmed bookings.
          </p>
          <div className="cta-row">
            <Link href="/request" className="btn btn-primary">
              {BRAND.customerCta}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
