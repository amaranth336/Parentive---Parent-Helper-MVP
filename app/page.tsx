import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-24">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
              Take something off your plate
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-700 text-balance mb-8 max-w-3xl mx-auto">
              Trusted, flexible help for real family life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/book">Book Support</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Overview */}
      <section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Support designed for busy families
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              From laundry resets to dinner prep, playroom tidying to childcare
              support—Parentive helps with the outcomes that matter most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Outcome-Based</h3>
              <p className="text-neutral-600">
                Choose the tasks you need done, not just hours of help
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted & Vetted</h3>
              <p className="text-neutral-600">
                All helpers are screened, trained, and background-checked
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-neutral-600">
                Book when you need help, how you need help
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-50 py-16">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Submit a service request and we&apos;ll work with you to find the
              perfect support for your family.
            </p>
            <Button asChild size="lg">
              <Link href="/book">Request Support</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
