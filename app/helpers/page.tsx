import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Become a Helper',
  description:
    'Join Parentive as a trusted family helper. Learn about the role, expectations, and how to apply.',
};

export default function HelpersPage() {
  return (
    <div className="py-16">
      <Container>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Become a Helper</h1>
          <p className="text-xl text-neutral-600 max-w-3xl">
            Make a meaningful difference in busy families&apos; lives. Join our
            team of trusted, vetted helpers.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            Helper information and application form will be implemented in
            subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
