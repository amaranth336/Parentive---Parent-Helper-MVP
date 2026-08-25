import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Browse our complete catalogue of family support services, from laundry and kitchen resets to childcare and household help.',
};

export default function ServicesPage() {
  return (
    <div className="py-16">
      <Container>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-neutral-600 max-w-3xl">
            Browse our complete catalogue of family support services. Choose the
            outcomes you need—we&apos;ll handle the rest.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            Service catalogue content will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
