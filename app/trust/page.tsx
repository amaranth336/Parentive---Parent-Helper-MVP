import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Trust & Safety',
  description:
    "Learn about Parentive's screening, verification, and safety measures for all helpers.",
};

export default function TrustPage() {
  return (
    <div className="py-16">
      <Container>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Trust & Safety</h1>
          <p className="text-xl text-neutral-600 max-w-3xl">
            Your family&apos;s safety is our top priority. Here&apos;s how we
            ensure every helper meets our high standards.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            Trust and safety content will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
