import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Parentive privacy policy and data handling practices.',
};

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <Container narrow>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-neutral-600">
            How we collect, use, and protect your personal information.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            Privacy policy will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
