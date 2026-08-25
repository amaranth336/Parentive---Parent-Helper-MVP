import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how Parentive works: from browsing services to booking support for your family.',
};

export default function HowItWorksPage() {
  return (
    <div className="py-16">
      <Container>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
          <p className="text-xl text-neutral-600 max-w-3xl">
            Getting help from Parentive is simple. Here&apos;s what to expect.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            How it works content will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
