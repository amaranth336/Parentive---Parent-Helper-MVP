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

export const metadata: Metadata = {
  title: "How It Works — Parentive",
  description:
    "Learn how Parentive works — from choosing your support to welcoming your Helper. A simple, transparent process designed for busy families.",
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

const processSteps = [
  {
    number: 1,
    title: "Choose your support",
    description: "Browse our service catalogue and select one or more services that fit your needs — from laundry and meal prep to flexible household support or an extra pair of hands with the kids."
  },
  {
    number: 2,
    title: "Tell us about your household",
    description: "Share your preferred day, timing, and household details. Let us know what matters to you — allergies, preferences, where things belong, and any important context for your Helper."
  },
  {
    number: 3,
    title: "Parentive reviews your request",
    description: "We review every request to ensure appropriate Helper matching, scheduling feasibility, and clear service expectations. If we need clarification, we'll reach out."
  },
  {
    number: 4,
    title: "We confirm your visit",
    description: "Once reviewed and matched, we confirm your visit details and pricing. You'll know exactly what to expect before your Helper arrives."
  },
  {
    number: 5,
    title: "Your Helper completes the support",
    description: "Your Parentive Helper arrives on time, ready to provide the support you requested. A brief household orientation at the start ensures they can work independently and efficiently."
  },
];

const whatToExpect = [
  {
    title: "You stay home",
    description: "All Parentive services are designed to take place while you're home. Our parent-helper model means we provide support alongside you, not instead of you."
  },
  {
    title: "Brief orientation",
    description: "A few minutes at the start to cover household preferences, where things are, and where they should go helps your Helper work confidently and efficiently."
  },
  {
    title: "Independent execution",
    description: "Once oriented, your Helper works independently on the tasks you've requested — freeing you to focus on work, time with your kids, rest, or whatever else you need."
  },
  {
    title: "Clear communication",
    description: "If something differs from what was expected, your Helper pauses and checks with you. No surprise decisions or charges."
  },
  {
    title: "Outcome delivered",
    description: "For defined services, you get the result you requested — a reset laundry basket, prepped meals, a tidied playroom, or whichever outcome you chose."
  },
  {
    title: "Respectful presence",
    description: "Parentive Helpers are selected for warmth, reliability, and respectful in-home presence. They're here to help, not to judge."
  },
];

const helperSelection = [
  {
    title: "Experience matters",
    description: "We prioritize candidates with real household, childcare, or family-support experience — not just theoretical knowledge."
  },
  {
    title: "Interpersonal skills",
    description: "Helpers must be respectful, warm, and capable of working collaboratively in someone else's home."
  },
  {
    title: "Reliable & trustworthy",
    description: "Reliability and integrity are non-negotiable. Helpers are screened and reference-checked accordingly."
  },
  {
    title: "Practical capability",
    description: "Helpers must be able to independently execute household tasks once oriented — efficiently and with care."
  },
];

const faqs = [
  {
    question: "Do I need to be home during the visit?",
    answer: "Yes. All Parentive services are designed to take place while you're home. Our parent-helper model means we provide support alongside you, not instead of you. This ensures safety, clarity, and alignment with your household expectations."
  },
  {
    question: "Can I book more than one service during a visit?",
    answer: "Absolutely. Many families combine services — for example, a Laundry Reset with Dinner Prep, or a Kitchen Reset with Playroom Reset. Let us know what you'd like help with, and we'll confirm feasibility and timing."
  },
  {
    question: "Can I request recurring help?",
    answer: "Yes. Parentive is designed to support families on a one-time, occasional, or recurring basis. Recurring visits (weekly, biweekly, or monthly) may qualify for modest incremental savings. Let us know your preferences when you submit your request."
  },
  {
    question: "What if the scope changes when the Helper arrives?",
    answer: "If scope differs from what was described, your Helper will pause and check with you before proceeding. Parentive will review the revised scope, communicate updated pricing if needed, and get your approval before continuing. We don't surprise you with unexpected charges."
  },
  {
    question: "How far in advance do I need to book?",
    answer: "During the pilot, we recommend requesting visits with as much advance notice as possible to ensure Helper availability and scheduling. We'll confirm feasibility when we review your request. Future booking windows may be more flexible as we scale."
  },
  {
    question: "What payment methods do you accept?",
    answer: "Payment details and methods will be confirmed when your visit is approved. Helpers do not accept Parentive service payments directly — all payments are processed through Parentive."
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header links={navigationLinks} ctaLabel="Request a visit" ctaHref="/request" />
      
      <main className="bg-surface-default">
        {/* Hero Section */}
        <Section className="text-center bg-surface-default">
          <div className="mx-auto max-w-4xl px-4">
            <Heading as="display" className="mb-6 text-text-brand">
              How Parentive works
            </Heading>
            <Text size="lg" className="text-text-primary max-w-3xl mx-auto">
              A simple, transparent process to get the household and family support you need — when you need it.
            </Text>
          </div>
        </Section>

        {/* Process Steps */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-6xl px-4">
            <div className="space-y-12">
              {processSteps.map((step) => (
                <div key={step.number} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center">
                    <Text className="text-surface-default font-bold">{step.number}</Text>
                  </div>
                  <div className="flex-1">
                    <Heading as="h3" className="mb-3 text-text-brand">
                      {step.title}
                    </Heading>
                    <Text color="muted">{step.description}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Early Access Note */}
        <Section className="bg-surface-default text-center">
          <div className="mx-auto max-w-3xl px-4">
            <Alert variant="info">
              <Heading as="h3" className="mb-3 text-text-brand">
                Parentive is currently in early access
              </Heading>
              <Text>
                We're carefully validating service delivery, operational economics, and customer experience 
                during our 90-day pilot. Founding Customer rates are available during this period, and we'll 
                use real-world data to finalize standard pricing before broader launch.
              </Text>
            </Alert>
          </div>
        </Section>

        {/* What to Expect */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-6xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              What to expect from your visit
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whatToExpect.map((item) => (
                <Card key={item.title} variant="elevated" className="bg-surface-emphasis">
                  <Heading as="h3" className="mb-3 text-text-brand">
                    {item.title}
                  </Heading>
                  <Text size="sm" color="muted">
                    {item.description}
                  </Text>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* Recurring vs. One-Time */}
        <Section className="bg-surface-default text-center">
          <div className="mx-auto max-w-3xl px-4">
            <Heading as="h2" className="mb-6 text-text-brand">
              Once, occasionally, or regularly
            </Heading>
            <Text size="lg" className="mb-6 text-text-primary">
              Use Parentive once for a one-time reset, occasionally when life gets busy, or regularly as 
              part of your household routine.
            </Text>
            <Text className="mb-8 text-text-muted">
              Some families want a single kitchen reset before hosting guests. Others choose recurring 
              weekly support. It's entirely up to you — and you can adjust as your needs change.
            </Text>
            <Link href="/pricing" className="text-brand-primary hover:underline font-semibold">
              Learn about recurring support pricing →
            </Link>
          </div>
        </Section>

        {/* Service Area */}
        <Section className="bg-surface-secondary text-center">
          <div className="mx-auto max-w-3xl px-4">
            <Heading as="h2" className="mb-6 text-text-brand">
              Where Parentive is available
            </Heading>
            <Text size="lg" className="mb-8 text-text-primary">
              Parentive is currently serving select local neighborhoods during our pilot validation period. 
              Check your postal code to see if we're available in your area, or join our waitlist for future expansion.
            </Text>
            <Button asChild variant="primary" size="lg">
              <Link href="/availability">Check availability</Link>
            </Button>
          </div>
        </Section>

        {/* Helper Selection */}
        <Section className="bg-surface-default">
          <div className="mx-auto max-w-6xl px-4">
            <Heading as="h2" className="text-center mb-6 text-text-brand">
              How we choose Helpers
            </Heading>
            <Text size="lg" className="text-center mb-12 text-text-primary max-w-3xl mx-auto">
              Every Parentive Helper is carefully selected for respectful, reliable in-home support. We look 
              for people who bring warmth, practical capability, and genuine care to household and family work.
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {helperSelection.map((item) => (
                <Card key={item.title} variant="elevated" className="bg-surface-emphasis">
                  <Heading as="h3" className="mb-3 text-text-brand">
                    {item.title}
                  </Heading>
                  <Text size="sm" color="muted">
                    {item.description}
                  </Text>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Text size="sm" color="muted" className="mb-6 max-w-2xl mx-auto">
                Interested in joining the Parentive Helper community?
              </Text>
              <Button asChild variant="secondary" size="lg">
                <Link href="/join">Join the Hive</Link>
              </Button>
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <Section className="bg-surface-secondary">
          <div className="mx-auto max-w-4xl px-4">
            <Heading as="h2" className="text-center mb-12 text-text-brand">
              Common questions
            </Heading>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <Card key={faq.question} variant="elevated" className="bg-surface-emphasis">
                  <details className="group">
                    <summary className="cursor-pointer list-none">
                      <div className="flex justify-between items-center">
                        <Heading as="h3" className="text-text-brand">
                          {faq.question}
                        </Heading>
                        <span className="text-brand-primary text-xl">+</span>
                      </div>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-border-subtle">
                      <Text color="muted">{faq.answer}</Text>
                    </div>
                  </details>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/faq" className="text-brand-primary hover:underline font-semibold">
                View all frequently asked questions →
              </Link>
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section className="bg-surface-default text-center">
          <div className="mx-auto max-w-3xl px-4">
            <Heading as="h2" className="mb-6 text-text-brand">
              Ready to get started?
            </Heading>
            <Text size="lg" className="mb-8 text-text-primary">
              Submit a request and we'll confirm availability and pricing. Or explore our full service catalogue first.
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
