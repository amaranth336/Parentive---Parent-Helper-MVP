/**
 * Parentive Header Component
 *
 * Shared navigation header using approved brand assets and semantic tokens.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRIMARY_NAV, BRAND } from '@/lib/content/site';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`parentive-header ${className}`.trim()}>
      <div className="container">
        <div className="header-content">
          <Link href="/" className="header-brand">
            <div className="header-logo">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="40" height="40" rx="8" fill="var(--moss)" />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="var(--oat)"
                  fontSize="20"
                  fontWeight="600"
                  fontFamily="var(--font-heading)"
                >
                  P
                </text>
              </svg>
            </div>
            <span className="header-wordmark">{BRAND.name}</span>
          </Link>

          <nav className="header-nav" aria-label="Main navigation">
            {PRIMARY_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link href="/request" className="btn btn-primary">
              {BRAND.customerCta}
            </Link>
            <button
              type="button"
              className="header-menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {open ? (
          <nav id="mobile-nav" className="header-mobile-nav" aria-label="Mobile navigation">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/request"
              className="btn btn-primary"
              onClick={() => setOpen(false)}
            >
              {BRAND.customerCta}
            </Link>
          </nav>
        ) : null}
      </div>

      <style jsx>{`
        .parentive-header {
          background: rgba(245, 242, 234, 0.95);
          border-bottom: 1px solid var(--border);
          padding: var(--space-4) 0;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          transition: opacity var(--transition-fast);
        }

        .header-brand:hover {
          opacity: 0.9;
        }

        .header-logo {
          flex-shrink: 0;
        }

        .header-wordmark {
          font-family: var(--font-heading);
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          color: var(--foreground);
          letter-spacing: -0.01em;
        }

        .header-nav {
          display: none;
          align-items: center;
          gap: var(--space-5);
          margin-left: auto;
        }

        @media (min-width: 768px) {
          .header-nav {
            display: flex;
          }
        }

        .nav-link {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--foreground-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
          white-space: nowrap;
        }

        .nav-link:hover {
          color: var(--foreground);
        }

        .header-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .header-actions :global(.btn) {
          font-size: var(--text-sm);
          padding: var(--space-2) var(--space-4);
          white-space: nowrap;
        }

        .header-actions :global(.btn-primary) {
          display: none;
        }

        @media (min-width: 768px) {
          .header-actions {
            margin-left: 0;
          }

          .header-actions :global(.btn-primary) {
            display: inline-flex;
          }
        }

        .header-menu-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface-raised);
          color: var(--foreground);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .header-menu-toggle {
            display: none;
          }
        }

        .header-mobile-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          padding: var(--space-4) 0 var(--space-2);
        }

        @media (min-width: 768px) {
          .header-mobile-nav {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
