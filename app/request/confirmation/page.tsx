/**
 * Request Confirmation Page
 *
 * Confirmation after a support request. This is not a booking confirmation.
 */

'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/form';
import { BRAND } from '@/lib/content/site';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');

  return (
    <main className="page">
      <div className="narrow" style={{ margin: '0 auto' }}>
        <Card>
          <h1>We’ve got it.</h1>
          <p className="lead">
            You’re one step closer to getting this off your plate.
          </p>
          <div className="alert alert-info">
            Parentive is currently preparing for launch and isn’t accepting
            confirmed bookings yet. We’ve saved your request so we can understand
            what support you’re looking for and follow up as Parentive moves
            toward pilot availability.
          </div>
          {requestId ? (
            <p className="text-sm text-muted" style={{ marginTop: 'var(--space-5)' }}>
              Reference: {requestId}
            </p>
          ) : null}
          <div className="cta-row">
            <Link href="/" className="btn btn-primary">
              Return home
            </Link>
            <Link href="/services" className="btn btn-secondary">
              {BRAND.servicesCta}
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="page">
          <p>Loading...</p>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
