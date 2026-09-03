/**
 * Parentive Footer Component
 *
 * Shared footer using approved brand and semantic tokens.
 */

import React from 'react';
import Link from 'next/link';
import { BRAND, SERVICE_AREA_LINE } from '@/lib/content/site';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`parentive-footer ${className}`.trim()}>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="32" height="32" rx="6" fill="var(--moss)" />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="var(--oat)"
                  fontSize="16"
                  fontWeight="600"
                  fontFamily="var(--font-heading)"
                >
                  P
                </text>
              </svg>
            </div>
            <div className="footer-brand-text">
              <p className="footer-wordmark">{BRAND.name}</p>
              <p className="footer-tagline">{BRAND.descriptor}</p>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-heading">Explore</h3>
              <nav className="footer-nav">
                <Link href="/services">Services</Link>
                <Link href="/how-it-works">How it works</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/request">{BRAND.customerCta}</Link>
              </nav>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Learn</h3>
              <nav className="footer-nav">
                <Link href="/faq">FAQ</Link>
                <Link href="/trust">How we build trust</Link>
              </nav>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Join us</h3>
              <nav className="footer-nav">
                <Link href="/helpers">{BRAND.recruitmentCta}</Link>
                <Link href="/helpers/apply">Apply to be a Helper</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="footer-location">{SERVICE_AREA_LINE}</p>
        </div>
      </div>
    </footer>
  );
}
