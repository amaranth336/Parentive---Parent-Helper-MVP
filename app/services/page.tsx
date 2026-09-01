import Link from "next/link";
import { getCategories, groupServicesByCategory } from "@/lib/catalogue";
import { CategorySection } from "@/components/CategorySection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Parentive",
  description: "Explore Parentive pilot catalogue of household and family support services. From laundry resets to meal prep, we take useful tasks off your plate.",
};

export default function ServicesPage() {
  const categories = getCategories();
  const servicesByCategory = groupServicesByCategory();

  return (
    <main className="services-page">
      <div className="services-hero">
        <h1>Services</h1>
        <p className="lead">
          Parentive helps with the household and family tasks that pile up.
          Browse our pilot catalogue and request early access to the services that would help most.
        </p>
        <div className="cta-group">
          <Link href="#early-access" className="btn btn-primary btn-large">
            Request early access
          </Link>
          <Link href="#how-it-works" className="btn btn-ghost btn-large">
            How it works
          </Link>
        </div>
      </div>

      {categories.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          services={servicesByCategory[category.id] || []}
        />
      ))}

      <section className="card" style={{ marginTop: 60 }}>
        <h2 id="how-it-works">How it works</h2>
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>1. Request early access</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Browse the catalogue and request the services that would help your household most.
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>2. We&apos;ll confirm availability</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Parentive reviews your request and confirms availability, timing, and any service-specific details.
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>3. Schedule your visit</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              We&apos;ll schedule your Helper visit at a time that works for your household.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>4. Take it off your plate</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Your Helper arrives, completes the service, and you return to a ready household.
            </p>
          </div>
        </div>
      </section>

      <section id="early-access" className="card" style={{ marginTop: 24, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 16 }}>Ready to get started?</h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24 }}>
          Request early access to Parentive&apos;s pilot services and we&apos;ll be in touch.
        </p>
        <button className="btn btn-primary btn-large">
          Request early access
        </button>
      </section>
    </main>
  );
}
