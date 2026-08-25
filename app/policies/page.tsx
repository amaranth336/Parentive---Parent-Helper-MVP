import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Policies',
  description:
    'Parentive service policies including cancellations, refunds, and service standards.',
};

export default function PoliciesPage() {
  return (
    <div className="py-16">
      <Container narrow>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Policies</h1>
          <p className="text-xl text-neutral-600">
            Our service policies, cancellation terms, and standards.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            Policy content will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
