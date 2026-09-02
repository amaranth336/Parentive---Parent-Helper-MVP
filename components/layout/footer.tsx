/**
 * Parentive Footer Component
 * 
 * Shared footer using approved brand and semantic tokens.
 */

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`parentive-footer ${className}`.trim()}>
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              {/* TODO: Replace with actual SVG from /public/brand/logo-mark.svg when available */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Parentive"
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
              <p className="footer-wordmark">Parentive</p>
              <p className="footer-tagline">Practical support for modern family life.</p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer-links">
            {/* Services */}
            <div className="footer-column">
              <h3 className="footer-heading">Services</h3>
              <nav className="footer-nav">
                <Link href="/services">All Services</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/how-it-works">How it Works</Link>
              </nav>
            </div>

            {/* Company */}
            <div className="footer-column">
              <h3 className="footer-heading">Company</h3>
              <nav className="footer-nav">
                <Link href="/about">About</Link>
                <Link href="/faq">FAQ</Link>
                <Link href="/trust">Trust & Safety</Link>
              </nav>
            </div>

            {/* Join Us */}
            <div className="footer-column">
              <h3 className="footer-heading">Join Us</h3>
              <nav className="footer-nav">
                <Link href="/helpers">Join the Hive</Link>
                <Link href="/helpers/apply">Apply Now</Link>
              </nav>
            </div>

            {/* Legal */}
            <div className="footer-column">
              <h3 className="footer-heading">Legal</h3>
              <nav className="footer-nav">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Parentive. All rights reserved.
          </p>
          <p className="footer-location">
            Serving select GTA communities
          </p>
        </div>
      </div>

      <style jsx>{`
        .parentive-footer {
          background: var(--background-alt);
          border-top: 1px solid var(--border);
          padding: var(--space-12) 0 var(--space-6);
          margin-top: var(--space-20);
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
          margin-bottom: var(--space-8);
        }

        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: 1.5fr 2fr;
            gap: var(--space-12);
          }
        }

        .footer-brand {
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
        }

        .footer-logo {
          flex-shrink: 0;
        }

        .footer-brand-text {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .footer-wordmark {
          font-family: var(--font-heading);
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--foreground);
          margin: 0;
        }

        .footer-tagline {
          font-size: var(--text-sm);
          color: var(--foreground-secondary);
          margin: 0;
          line-height: var(--leading-relaxed);
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
        }

        @media (min-width: 640px) {
          .footer-links {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .footer-heading {
          font-family: var(--font-heading);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--foreground);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .footer-nav :global(a) {
          font-size: var(--text-sm);
          color: var(--foreground-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
          line-height: var(--leading-normal);
        }

        .footer-nav :global(a:hover) {
          color: var(--foreground);
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding-top: var(--space-6);
          border-top: 1px solid var(--border);
          text-align: center;
        }

        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }
        }

        .footer-copyright,
        .footer-location {
          font-size: var(--text-xs);
          color: var(--muted-foreground);
          margin: 0;
        }
      `}</style>
    </footer>
  );
}
