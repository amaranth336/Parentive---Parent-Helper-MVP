/**
 * Helper Application Confirmation Page
 */

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/form';
import { BRAND } from '@/lib/content/site';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id');

  return (
    <main className="page">
      <div className="narrow" style={{ margin: '0 auto' }}>
        <Card>
          <h1>Thanks for putting your hand up.</h1>
          <p className="lead">Application received.</p>
          <div className="alert alert-info">
            We’re building Parentive’s first Hive for pilot launch. We’ve
            received your application and will review it as we begin assembling
            our Founding Helper team.
          </div>
          {applicationId ? (
            <p className="text-sm text-muted" style={{ marginTop: 'var(--space-5)' }}>
              Reference: {applicationId}
            </p>
          ) : null}
          <div className="cta-row">
            <Link href="/helpers" className="btn btn-primary">
              Back to {BRAND.recruitmentCta}
            </Link>
            <Link href="/" className="btn btn-secondary">
              Return home
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default function HelperApplicationConfirmationPage() {
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
