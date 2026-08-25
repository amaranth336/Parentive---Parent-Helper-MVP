import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Parentive family support services.',
};

export default function FAQPage() {
  return (
    <div className="py-16">
      <Container narrow>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-neutral-600">
            Common questions about how Parentive works, pricing, scheduling, and
            more.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            FAQ content will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
