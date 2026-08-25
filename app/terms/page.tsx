import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Parentive terms of service and user agreement.',
};

export default function TermsPage() {
  return (
    <div className="py-16">
      <Container narrow>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-neutral-600">
            Terms and conditions for using Parentive services.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            Terms of service will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
