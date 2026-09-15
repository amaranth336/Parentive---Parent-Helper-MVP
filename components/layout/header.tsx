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
    </header>
  );
}
