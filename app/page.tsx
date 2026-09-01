import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Parentive — Trusted, flexible help for real life",
  description: "Take something off your plate. Trusted, flexible help with the everyday things that keep a household and family moving — from laundry and meal prep to an extra pair of hands with the kids.",
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

export default function HomePage() {
  return (
    <>
      <Header 
        links={navigationLinks}
        ctaLabel="Request a visit"
        ctaHref="/request"
      />

      <main className="bg-surface-default">
        {/* Hero Section */}
        <Section className="bg-surface-default text-center py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4">
            <Heading as="display" className="mb-6 text-text-brand">
              Take something off your plate.
            </Heading>
            <Text size="lg" className="mb-8 text-text-primary max-w-3xl mx-auto">
              Trusted, flexible help with the everyday things that keep a household and family moving — from laundry and meal prep to an extra pair of hands with the kids.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="primary" size="lg">
                <Link href="/request">Request a visit</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/services">See services</Link>
              </Button>
            </div>
          </div>
        </Section>

        {/* Service Categories */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-6xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              What Parentive can take off your plate
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="elevated" hover asChild>
                <Link href="/services#home-laundry" className="block">
                  <Heading as="h3" className="mb-3 text-text-brand">Home resets</Heading>
                  <Text size="sm" color="muted">
                    Laundry, bedrooms, playrooms, kitchens and everyday household resets.
                  </Text>
                </Link>
              </Card>
              <Card variant="elevated" hover asChild>
                <Link href="/services#kitchen-food" className="block">
                  <Heading as="h3" className="mb-3 text-text-brand">Food & prep</Heading>
                  <Text size="sm" color="muted">
                    Meal prep, lunches, produce prep and kitchen support.
                  </Text>
                </Link>
              </Card>
              <Card variant="elevated" hover asChild>
                <Link href="/services#family-support" className="block">
                  <Heading as="h3" className="mb-3 text-text-brand">Kids & family</Heading>
                  <Text size="sm" color="muted">
                    An extra pair of hands while you're home, child engagement and parent-helper support.
                  </Text>
                </Link>
              </Card>
              <Card variant="elevated" hover asChild>
                <Link href="/services#flexible-support" className="block">
                  <Heading as="h3" className="mb-3 text-text-brand">Everyday life</Heading>
                  <Text size="sm" color="muted">
                    Flexible practical support that doesn't fit neatly into one household category.
                  </Text>
                </Link>
              </Card>
            </div>
          </div>
        </Section>

        {/* How It Works */}
        <Section className="bg-surface-default">
          <div className="mx-auto max-w-6xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              How Parentive works
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center text-h3 font-bold mx-auto mb-4">
                  1
                </div>
                <Heading as="h3" className="mb-2 text-text-brand">Choose what you'd like help with</Heading>
                <Text size="sm" color="muted">
                  Select one or more Parentive services.
                </Text>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center text-h3 font-bold mx-auto mb-4">
                  2
                </div>
                <Heading as="h3" className="mb-2 text-text-brand">Tell us when you need it</Heading>
                <Text size="sm" color="muted">
                  Share your preferred day, timing and household details.
                </Text>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-primary text-text-inverse flex items-center justify-center text-h3 font-bold mx-auto mb-4">
                  3
                </div>
                <Heading as="h3" className="mb-2 text-text-brand">We'll confirm your visit</Heading>
                <Text size="sm" color="muted">
                  Submit a request and we'll confirm availability.
                </Text>
              </div>
            </div>
          </div>
        </Section>

        {/* Flexible Support / Recurring */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Heading as="h2" className="mb-6 text-text-brand">
              Support can be part of the routine
            </Heading>
            <Text size="lg" className="text-text-primary">
              Some families want a one-time kitchen reset. Others choose recurring support every week. Parentive works however often makes sense for your household — once, occasionally, or as part of your normal routine.
            </Text>
          </div>
        </Section>

        {/* Brand Moment */}
        <Section className="bg-surface-default">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Heading as="display" className="mb-6 text-text-brand text-display-md">
              Make room for life.
            </Heading>
            <Text size="lg" className="text-text-primary">
              Sometimes the most useful thing another pair of hands can give you isn't a finished load of laundry or a prepped dinner. It's what that time makes room for. Work. Time with your kids. Rest. Dinner together. Or simply choosing not to do that task yourself.
            </Text>
          </div>
        </Section>

        {/* Trust */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-6xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              What you can expect
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <Heading as="h3" className="mb-2 text-text-brand">Carefully selected Helpers</Heading>
                <Text size="sm" color="muted">
                  Every Parentive Helper is chosen with care and matched to your household needs.
                </Text>
              </div>
              <div className="text-center">
                <Heading as="h3" className="mb-2 text-text-brand">Clear service expectations</Heading>
                <Text size="sm" color="muted">
                  Know exactly what's included in each service before you request.
                </Text>
              </div>
              <div className="text-center">
                <Heading as="h3" className="mb-2 text-text-brand">Transparent pricing</Heading>
                <Text size="sm" color="muted">
                  Straightforward pricing for every service during our pilot phase.
                </Text>
              </div>
              <div className="text-center">
                <Heading as="h3" className="mb-2 text-text-brand">Respectful in-home support</Heading>
                <Text size="sm" color="muted">
                  Helpers work with your household systems and respect your home.
                </Text>
              </div>
            </div>
          </div>
        </Section>

        {/* Helpers / Hive */}
        <Section className="bg-surface-default">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Heading as="h2" className="mb-6 text-text-brand">
              The right kind of help feels human
            </Heading>
            <Text size="lg" className="mb-8 text-text-primary">
              Parentive Helpers are real people who understand that every household is different. They bring practical skills, attention to detail, and respect for the way your home works.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary">
                <Link href="/trust">Learn how we choose Helpers</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/join">Join the Hive</Link>
              </Button>
            </div>
          </div>
        </Section>

        {/* Local Service Area */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Heading as="h2" className="mb-6 text-text-brand">
              Local service, starting here
            </Heading>
            <Text size="lg" className="mb-8 text-text-primary">
              Parentive is currently available in select areas. Check if we serve your neighbourhood.
            </Text>
            <Button asChild variant="secondary">
              <Link href="/service-area">Check availability</Link>
            </Button>
          </div>
        </Section>

        {/* FAQ Preview */}
        <Section className="bg-surface-default">
          <div className="mx-auto max-w-4xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              Common questions
            </Heading>
            <div className="space-y-4 mb-8">
              <details className="bg-surface-emphasis border border-border-subtle rounded-card p-6">
                <summary className="cursor-pointer font-semibold text-text-brand">
                  Do I need to be home?
                </summary>
                <Text size="sm" color="muted" className="mt-4">
                  For most services, yes. Parentive Helpers work while you're home, providing support that creates capacity for you during the visit. Some services like laundry or kitchen resets can happen while you focus on other things in your home.
                </Text>
              </details>
              <details className="bg-surface-emphasis border border-border-subtle rounded-card p-6">
                <summary className="cursor-pointer font-semibold text-text-brand">
                  Can I book more than one service during a visit?
                </summary>
                <Text size="sm" color="muted" className="mt-4">
                  Yes. Many families combine services — like a kitchen reset with meal prep, or laundry with a playroom reset. Just let us know what you'd like during your request.
                </Text>
              </details>
              <details className="bg-surface-emphasis border border-border-subtle rounded-card p-6">
                <summary className="cursor-pointer font-semibold text-text-brand">
                  Can I request recurring help?
                </summary>
                <Text size="sm" color="muted" className="mt-4">
                  Absolutely. Some households use Parentive once, while others schedule regular visits weekly or biweekly. We'll work with you to find a rhythm that fits your routine.
                </Text>
              </details>
              <details className="bg-surface-emphasis border border-border-subtle rounded-card p-6">
                <summary className="cursor-pointer font-semibold text-text-brand">
                  Where is Parentive available?
                </summary>
                <Text size="sm" color="muted" className="mt-4">
                  Parentive is currently operating in select local areas as we grow. Check our service area page to see if we're available in your neighbourhood.
                </Text>
              </details>
            </div>
            <div className="text-center">
              <Button asChild variant="secondary">
                <Link href="/faq">See all questions</Link>
              </Button>
            </div>
          </div>
        </Section>

        {/* Final CTA */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Heading as="display" className="mb-6 text-text-brand text-display-md">
              What would you like off your plate?
            </Heading>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild variant="primary" size="lg">
                <Link href="/request">Request a visit</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/services">See services</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer links={footerLinks} />
    </>
  );
}
