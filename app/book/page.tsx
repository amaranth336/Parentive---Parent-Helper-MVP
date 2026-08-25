import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Book Support',
  description:
    "Submit a service request and we'll work with you to schedule the family support you need.",
};

export default function BookPage() {
  return (
    <div className="py-16">
      <Container narrow>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Book Support</h1>
          <p className="text-xl text-neutral-600">
            Tell us what you need help with and we&apos;ll work with you to
            schedule the right support for your family.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            Booking form will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
