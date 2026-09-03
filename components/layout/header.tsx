/**
 * Parentive Header
 *
 * Shared navigation using the approved lockup and 004 layout tokens.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { LogoLockup } from '@/components/brand/logo';
import { Icon } from '@/components/brand/icon';
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
          <Link href="/" className="header-brand" onClick={() => setOpen(false)}>
            <LogoLockup className="header-lockup" priority />
            <span className="visually-hidden">{BRAND.name}</span>
          </Link>

          <nav className="header-nav" aria-label="Main navigation">
            {PRIMARY_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link href="/request" className="btn btn-primary header-cta">
              {BRAND.customerCta}
            </Link>
            <button
              type="button"
              className="header-menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              onClick={() => setOpen((value) => !value)}
            >
              <Icon icon={open ? X : Menu} size="lg" />
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
