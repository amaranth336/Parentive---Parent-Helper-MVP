'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="py-16">
      <Container narrow>
        <div className="text-center">
          <p className="text-base font-semibold text-error-DEFAULT">Error</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Something went wrong
          </h1>
          <p className="mt-6 text-base leading-7 text-neutral-600">
            We apologize for the inconvenience. Please try again.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={reset}
              className="rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="text-sm font-semibold text-neutral-900 hover:text-primary-600 transition-colors"
            >
              Go back home <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
