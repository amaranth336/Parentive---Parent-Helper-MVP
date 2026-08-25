import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Service Packages',
  description:
    'Pre-designed service packages that bundle the support busy families need most.',
};

export default function PackagesPage() {
  return (
    <div className="py-16">
      <Container>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Service Packages</h1>
          <p className="text-xl text-neutral-600 max-w-3xl">
            Pre-designed bundles that combine the services busy families need
            most. Get more done, save time.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            Service packages content will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
