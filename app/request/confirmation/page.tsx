/**
 * Request Confirmation Page
 * 
 * Confirmation page after successful support request submission.
 * Includes pre-launch messaging as specified in Linear 008.
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Alert } from '@/components/form';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');

  return (
    <main className="page">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div className="logo">🧸</div>
          <h1 style={{ fontSize: '28px', margin: 0, color: '#fff' }}>Parentive</h1>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              filter: 'grayscale(0.3)'
            }}>
              ✓
            </div>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 600, 
              margin: '0 0 12px',
              color: 'var(--text)'
            }}>
              We&apos;ve got it.
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: 'var(--text-muted)', 
              margin: 0,
              lineHeight: '1.5'
            }}>
              You&apos;re one step closer to getting this off your plate.
            </p>
          </div>

          <Alert variant="info">
            <strong>Parentive is currently preparing for launch.</strong>
            <br /><br />
            We&apos;re not yet accepting confirmed bookings, but your request has been saved so we can understand your support needs and identify potential pilot customers.
            <br /><br />
            We&apos;ll use this request to validate demand and will follow up via your preferred contact method as pilot availability becomes available.
          </Alert>

          <div style={{ 
            marginTop: '28px', 
            padding: '20px', 
            background: 'var(--panel-muted)', 
            borderRadius: '12px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
              What happens next?
            </h3>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '20px',
              lineHeight: '1.8',
              color: 'var(--text)'
            }}>
              <li>Your request is being reviewed by the Parentive team</li>
              <li>We&apos;ll assess the services you&apos;ve selected and your household context</li>
              <li>When we&apos;re ready to launch in your area, we&apos;ll reach out to discuss scope and pricing</li>
              <li>There&apos;s nothing you need to do right now</li>
            </ul>
          </div>

          {requestId && (
            <div style={{ 
              marginTop: '20px',
              fontSize: '13px',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              Request ID: {requestId}
            </div>
          )}

          <div style={{ 
            marginTop: '32px', 
            textAlign: 'center',
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <Link 
              href="/"
              style={{
                display: 'inline-block',
                padding: '11px 24px',
                borderRadius: '10px',
                background: 'var(--brand)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'background 0.15s'
              }}
            >
              Return Home
            </Link>
          </div>
        </Card>

        <div style={{ 
          marginTop: '24px', 
          textAlign: 'center',
          fontSize: '14px',
          color: 'rgba(226, 232, 240, 0.8)'
        }}>
          <p>
            Questions? We&apos;d love to hear from you.
            <br />
            You can reach us at{' '}
            <a 
              href="mailto:hello@parentive.ca" 
              style={{ color: 'rgba(226, 232, 240, 0.9)', textDecoration: 'underline' }}
            >
              hello@parentive.ca
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <main className="page">
        <div style={{ textAlign: 'center', color: '#fff' }}>Loading...</div>
      </main>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
