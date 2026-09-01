import Link from "next/link";
import { getCategories, groupServicesByCategory } from "@/lib/catalogue";
import { CategorySection } from "@/components/CategorySection";
import type { Metadata } from "next";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Services | Parentive",
  description: "Explore Parentive pilot catalogue of household and family support services. From laundry resets to meal prep, we take useful tasks off your plate.",
};

const navigationLinks = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

const footerLinks = [
  {
    title: "Services",
    items: [
      { href: "/services", label: "All services" },
      { href: "/pricing", label: "Pricing" },
      { href: "/service-area", label: "Service area" },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/trust", label: "Trust & Safety" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Join Us",
    items: [{ href: "/join", label: "Join the Hive" }],
  },
  {
    title: "Legal",
    items: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function ServicesPage() {
  const categories = getCategories();
  const servicesByCategory = groupServicesByCategory();

  return (
    <>
      <Header 
        links={navigationLinks}
        ctaLabel="Request a visit"
        ctaHref="/request"
      />

      <main className="bg-surface-default">
        {/* Hero Section */}
        <Section className="bg-surface-default text-center py-16">
          <div className="mx-auto max-w-3xl px-4">
            <Heading as="h1" className="mb-4 text-text-brand">
              Services
            </Heading>
            <Text size="lg" className="text-text-primary max-w-2xl mx-auto mb-8">
              Parentive helps with the household and family tasks that pile up.
              Browse our pilot catalogue and request early access to the services that would help most.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="primary" size="lg">
                <Link href="#early-access">Request early access</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>
          </div>
        </Section>

        {/* Service Categories */}
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            services={servicesByCategory[category.id] || []}
          />
        ))}

        {/* How it works */}
        <Section id="how-it-works" className="bg-surface-secondary">
          <div className="mx-auto max-w-4xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              How it works
            </Heading>
            <div className="space-y-6">
              <div>
                <Heading as="h3" className="mb-2 text-text-brand">
                  1. Request early access
                </Heading>
                <Text size="sm" color="muted">
                  Browse the catalogue and request the services that would help your household most.
                </Text>
              </div>
              <div>
                <Heading as="h3" className="mb-2 text-text-brand">
                  2. We'll confirm availability
                </Heading>
                <Text size="sm" color="muted">
                  Parentive reviews your request and confirms availability, timing, and any service-specific details.
                </Text>
              </div>
              <div>
                <Heading as="h3" className="mb-2 text-text-brand">
                  3. Schedule your visit
                </Heading>
                <Text size="sm" color="muted">
                  We'll schedule your Helper visit at a time that works for your household.
                </Text>
              </div>
              <div>
                <Heading as="h3" className="mb-2 text-text-brand">
                  4. Take it off your plate
                </Heading>
                <Text size="sm" color="muted">
                  Your Helper arrives, completes the service, and you return to a ready household.
                </Text>
              </div>
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section id="early-access" className="bg-surface-default">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Heading as="h2" className="mb-4 text-text-brand">
              Ready to get started?
            </Heading>
            <Text className="mb-8 text-text-muted max-w-2xl mx-auto">
              Request early access to Parentive's pilot services and we'll be in touch.
            </Text>
            <Button variant="primary" size="lg">
              Request early access
            </Button>
          </div>
        </Section>
      </main>

      <Footer links={footerLinks} />
    </>
  );
}
