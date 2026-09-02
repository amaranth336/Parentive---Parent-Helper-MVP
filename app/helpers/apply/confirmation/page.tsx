/**
 * Helper Application Confirmation Page
 * 
 * Shown after successful helper application submission.
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/form';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    setApplicationId(id);
  }, [searchParams]);

  return (
    <main className="page">
      <div className="card" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        {/* Success icon */}
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, var(--brand), #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ✓
        </div>

        {/* Confirmation message */}
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>
          Application Received!
        </h1>
        
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--text)', marginBottom: '24px' }}>
          Thank you for your interest in becoming a Founding Helper with Parentive.
        </p>

        {applicationId && (
          <div style={{ 
            padding: '16px', 
            background: 'var(--panel-muted)', 
            borderRadius: '12px', 
            marginBottom: '32px',
            fontSize: '14px',
            color: 'var(--text-muted)'
          }}>
            <div style={{ marginBottom: '4px', fontWeight: 600 }}>Application ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>{applicationId}</div>
          </div>
        )}

        {/* What happens next */}
        <div style={{ textAlign: 'left', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
            What Happens Next
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'rgba(99, 102, 241, 0.15)', 
                display: 'grid', 
                placeItems: 'center',
                flexShrink: 0,
                color: 'var(--brand)',
                fontWeight: 600,
                fontSize: '14px'
              }}>
                1
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text)' }}>
                  Application Review
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Our team will review your application. This typically takes 5-7 business days.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'rgba(99, 102, 241, 0.15)', 
                display: 'grid', 
                placeItems: 'center',
                flexShrink: 0,
                color: 'var(--brand)',
                fontWeight: 600,
                fontSize: '14px'
              }}>
                2
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text)' }}>
                  Interview Process
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  If we move forward, we&apos;ll reach out to schedule an interview using your preferred contact method.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'rgba(99, 102, 241, 0.15)', 
                display: 'grid', 
                placeItems: 'center',
                flexShrink: 0,
                color: 'var(--brand)',
                fontWeight: 600,
                fontSize: '14px'
              }}>
                3
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text)' }}>
                  Practical Assessment
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  We&apos;ll invite you to complete a job-related practical assessment to demonstrate your capabilities.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'rgba(99, 102, 241, 0.15)', 
                display: 'grid', 
                placeItems: 'center',
                flexShrink: 0,
                color: 'var(--brand)',
                fontWeight: 600,
                fontSize: '14px'
              }}>
                4
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text)' }}>
                  Final Steps
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Reference checks, background verification, and onboarding for successful candidates.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: '24px' }}>
          <strong>Keep an eye on your inbox!</strong> We&apos;ll contact you via {' '}
          email about your application status. Make sure to check your spam folder just in case.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/helpers'}
          >
            Back to Join the Hive
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function HelperApplicationConfirmationPage() {
  return (
    <Suspense fallback={
      <main className="page">
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </main>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
