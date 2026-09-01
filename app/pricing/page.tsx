import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
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

export default function PricingPage() {
  const { cancellationPolicy, paymentTiming, taxTreatment } = COMMERCIAL_RULES;

  return (
    <>
      <Header links={navigationLinks} ctaLabel="Request a visit" ctaHref="/request" />
      
      <main className="bg-surface-default">
        {/* Hero Section */}
        <Section className="text-center bg-surface-default">
          <div className="mx-auto max-w-4xl px-4">
            <Heading as="display" className="mb-6 text-text-brand">
              Clear, predictable pricing
            </Heading>
            <Text size="lg" className="text-text-primary max-w-3xl mx-auto">
              Parentive pricing is designed to feel clear, fair, and outcome-oriented. 
              You'll know what you're paying for before your visit is confirmed — with no surprise charges.
            </Text>
          </div>
        </Section>

        {/* Pricing Principles */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-6xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              How Parentive pricing works
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PRICING_PRINCIPLES.map((principle) => (
                <Card key={principle.title} variant="elevated" className="bg-surface-emphasis">
                  <Heading as="h3" className="mb-3 text-text-brand">
                    {principle.title}
                  </Heading>
                  <Text size="sm" color="muted">
                    {principle.description}
                  </Text>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* Pricing Model Explanation */}
        <Section className="bg-surface-default">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Heading as="h2" className="mb-6 text-text-brand">
              Outcome-based and time-based
            </Heading>
            <Text size="lg" className="mb-6 text-text-primary">
              Defined services like Laundry Reset or Kitchen Reset are priced around the outcome. 
              Time-based support like Parent's Helper Visit or Uninterrupted Hour is priced around 
              reserved Helper capacity.
            </Text>
            <Text className="text-text-muted">
              Customers are not exposed to Parentive wage or margin calculations. Pricing reflects 
              the value of the result and the time committed by your Helper.
            </Text>
          </div>
        </Section>

        {/* Founding Customer Rate */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-4xl px-4">
            <Alert variant="success" className="mb-4">
              <Heading as="h3" className="mb-3 text-text-brand">
                {FOUNDING_CUSTOMER_MESSAGING.heading}
              </Heading>
              <Text>{FOUNDING_CUSTOMER_MESSAGING.description}</Text>
            </Alert>
            <Text size="sm" color="muted" className="text-center">
              {FOUNDING_CUSTOMER_MESSAGING.note}
            </Text>
          </div>
        </Section>

        {/* Minimum Visit Architecture */}
        <Section className="bg-surface-default">
          <div className="mx-auto max-w-4xl px-4">
            <Heading as="h2" className="text-center mb-6 text-text-brand">
              {MINIMUM_VISIT_MESSAGING.heading}
            </Heading>
            <Text size="lg" className="text-center mb-8 text-text-primary">
              {MINIMUM_VISIT_MESSAGING.description}
            </Text>
            <Alert variant="info" className="mb-6">
              <Text className="mb-3">{MINIMUM_VISIT_MESSAGING.note}</Text>
              <Text size="sm" color="muted">{MINIMUM_VISIT_MESSAGING.clarification}</Text>
            </Alert>
            <Text size="sm" color="muted" className="text-center">
              Services like Uninterrupted Hour remain a fixed one-hour customer product — pricing 
              accounts for Parentive's underlying visit economics while preserving service structure.
            </Text>
          </div>
        </Section>

        {/* Recurring Support */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-6xl px-4">
            <Heading as="h2" className="text-center mb-6 text-text-brand">
              {RECURRING_SUPPORT_MESSAGING.heading}
            </Heading>
            <Text size="lg" className="text-center mb-12 text-text-primary max-w-3xl mx-auto">
              {RECURRING_SUPPORT_MESSAGING.description}
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {RECURRING_SUPPORT_MESSAGING.frequencies.map((freq) => (
                <Card key={freq.name} variant="elevated" className="text-center bg-surface-emphasis">
                  <Heading as="h3" className="mb-2 text-text-brand">
                    {freq.name}
                  </Heading>
                  <Text size="sm" color="muted">
                    {freq.description}
                  </Text>
                </Card>
              ))}
            </div>
            <Text size="sm" color="muted" className="text-center max-w-3xl mx-auto">
              {RECURRING_SUPPORT_MESSAGING.note}
            </Text>
          </div>
        </Section>

        {/* Time-Based Services Overview */}
        <Section className="bg-surface-default">
          <div className="mx-auto max-w-6xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              Time-based services
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Card variant="elevated" className="bg-surface-emphasis">
                <Heading as="h3" className="mb-3 text-text-brand">
                  Uninterrupted Hour
                </Heading>
                <Text size="sm" color="muted" className="mb-4">
                  One hour of focused Helper time.
                </Text>
                <Text size="sm">
                  <strong>Duration:</strong> 1 hour (fixed)
                </Text>
              </Card>

              <Card variant="elevated" className="bg-surface-emphasis">
                <Heading as="h3" className="mb-3 text-text-brand">
                  Parent's Helper Visit
                </Heading>
                <Text size="sm" color="muted" className="mb-4">
                  Flexible household and family support.
                </Text>
                <Text size="sm">
                  <strong>Duration:</strong> 2-hour minimum + 30-min increments
                </Text>
              </Card>

              <Card variant="elevated" className="bg-surface-emphasis">
                <Heading as="h3" className="mb-3 text-text-brand">
                  Flexible Support Request
                </Heading>
                <Text size="sm" color="muted" className="mb-4">
                  Custom support subject to review.
                </Text>
                <Text size="sm">
                  <strong>Duration:</strong> 2-hour minimum + 30-min increments (subject to review)
                </Text>
              </Card>
            </div>
            <Text size="sm" color="muted" className="text-center max-w-3xl mx-auto">
              Pricing for time-based services accounts for Parentive's minimum visit economics while 
              preserving customer-facing service structure.
            </Text>
          </div>
        </Section>

        {/* Outcome-Based Services */}
        <Section className="bg-surface-secondary text-center">
          <div className="mx-auto max-w-3xl px-4">
            <Heading as="h2" className="mb-6 text-text-brand">
              Outcome-based services
            </Heading>
            <Text size="lg" className="mb-8 text-text-primary">
              Defined catalogue services like Laundry Reset, Kitchen Reset, Dinner Prep, and 
              Tomorrow's Lunches support outcome-based pricing. You pay for the result, not just the time.
            </Text>
            <Button asChild variant="primary" size="lg">
              <Link href="/services">View all services</Link>
            </Button>
          </div>
        </Section>

        {/* Orientation */}
        <Section className="bg-surface-default text-center">
          <div className="mx-auto max-w-3xl px-4">
            <Heading as="h2" className="mb-6 text-text-brand">
              Household orientation
            </Heading>
            <Text size="lg" className="mb-6 text-text-primary">
              Approximately 10–15 minutes of household orientation at the start of a visit helps your 
              Helper work independently and efficiently for the rest of the visit.
            </Text>
            <Text className="text-text-muted">
              This brief setup covers household preferences, task expectations, supply locations, and 
              relevant boundaries. There is no separate orientation fee — it's built into service planning.
            </Text>
          </div>
        </Section>

        {/* Payment & Cancellation */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-6xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              Payment & cancellation
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card variant="elevated" className="bg-surface-emphasis">
                <Heading as="h3" className="mb-4 text-text-brand">
                  Payment timing (pilot)
                </Heading>
                <Text size="sm" color="muted" className="mb-4">
                  Payment is due {paymentTiming.pilotDueHours} hours before your scheduled visit. 
                  If booking is confirmed within {paymentTiming.pilotDueHours} hours, payment is due 
                  when the visit is confirmed.
                </Text>
                <Text size="sm" color="muted">
                  Helpers do not accept Parentive service payments. No cash payment for services.
                </Text>
              </Card>

              <Card variant="elevated" className="bg-surface-emphasis">
                <Heading as="h3" className="mb-4 text-text-brand">
                  Cancellation policy
                </Heading>
                <div className="space-y-3">
                  <Text size="sm" color="muted">
                    <strong>More than {cancellationPolicy.freeRescheduleBefore} hours:</strong> Free 
                    cancellation or rescheduling
                  </Text>
                  <Text size="sm" color="muted">
                    <strong>Less than {cancellationPolicy.freeRescheduleBefore} hours:</strong>{" "}
                    {cancellationPolicy.lateCancellationFeeNote}
                  </Text>
                  <Text size="sm" color="muted">
                    <strong>No-show / no-access:</strong> {cancellationPolicy.noShowPolicyNote}
                  </Text>
                </div>
              </Card>
            </div>
            <Text size="sm" color="muted" className="text-center">
              {taxTreatment}
            </Text>
          </div>
        </Section>

        {/* Scope Changes & Overruns */}
        <Section className="bg-surface-default text-center">
          <div className="mx-auto max-w-3xl px-4">
            <Heading as="h2" className="mb-6 text-text-brand">
              Scope changes & estimates
            </Heading>
            <Text size="lg" className="mb-8 text-text-primary">
              If scope differs when your Helper arrives, we pause, validate the revised scope and pricing 
              with you, and get your approval before proceeding.
            </Text>
            <Alert variant="success">
              <Heading as="h3" className="mb-3 text-text-brand">
                Parentive pilot commitment
              </Heading>
              <Text>
                If you accurately described the scope and it hasn't changed, but Parentive underestimated 
                the service duration, Parentive absorbs the additional Helper labour cost during the pilot. 
                We do not unexpectedly bill customers — instead, we record the variance to improve our 
                service-duration model.
              </Text>
            </Alert>
          </div>
        </Section>

        {/* Travel & Tipping */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card variant="elevated" className="bg-surface-emphasis">
                <Heading as="h3" className="mb-4 text-text-brand">
                  Travel
                </Heading>
                <Text size="sm" color="muted">
                  {COMMERCIAL_RULES.travelPolicy}
                </Text>
              </Card>

              <Card variant="elevated" className="bg-surface-emphasis">
                <Heading as="h3" className="mb-4 text-text-brand">
                  Tipping
                </Heading>
                <Text size="sm" color="muted">
                  {COMMERCIAL_RULES.tippingPolicy}
                </Text>
              </Card>
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section className="bg-surface-default text-center">
          <div className="mx-auto max-w-3xl px-4">
            <Heading as="h2" className="mb-6 text-text-brand">
              Ready to request a visit?
            </Heading>
            <Text size="lg" className="mb-8 text-text-primary">
              Explore our services or submit a request. We'll confirm availability and pricing before your visit.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="primary" size="lg">
                <Link href="/request">Request a visit</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/services">View services</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer links={footerLinks} />
    </>
  );
}
