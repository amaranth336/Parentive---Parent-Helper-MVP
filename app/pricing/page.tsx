import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Transparent, outcome-based pricing for Parentive family support services.',
};

export default function PricingPage() {
  return (
    <div className="py-16">
      <Container>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-xl text-neutral-600 max-w-3xl">
            Clear, outcome-based pricing. Know what you&apos;re paying for
            before you book.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            Pricing details will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
