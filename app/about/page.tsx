import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'About Parentive',
  description:
    "Learn about Parentive's mission to provide trusted, flexible family support.",
};

export default function AboutPage() {
  return (
    <div className="py-16">
      <Container narrow>
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">About Parentive</h1>
          <p className="text-xl text-neutral-600">
            Our mission is to help busy families take something off their plate
            with trusted, flexible support.
          </p>
        </header>

        <div className="prose max-w-none">
          <p className="text-neutral-600">
            About content will be implemented in subsequent issues.
          </p>
        </div>
      </Container>
    </div>
  );
}
