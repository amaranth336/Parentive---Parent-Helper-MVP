/**
 * Parentive Header Component
 * 
 * Shared navigation header using approved brand assets and semantic tokens.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../form';

interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`parentive-header ${className}`.trim()}>
      <div className="container">
        <div className="header-content">
          {/* Logo / Brand */}
          <Link href="/" className="header-brand">
            <div className="header-logo">
              {/* TODO: Replace with actual SVG from /public/brand/logo-mark.svg when available */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Parentive"
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
            <span className="header-wordmark">Parentive</span>
          </Link>

          {/* Navigation */}
          <nav className="header-nav" aria-label="Main navigation">
            <Link href="/services" className="nav-link">
              Services
            </Link>
            <Link href="/pricing" className="nav-link">
              Pricing
            </Link>
            <Link href="/how-it-works" className="nav-link">
              How it works
            </Link>
            <Link href="/helpers" className="nav-link">
              Join the Hive
            </Link>
          </nav>

          {/* Primary CTA */}
          <div className="header-actions">
            <Button
              onClick={() => (window.location.href = '/request')}
              className="btn-primary"
            >
              Take it off my plate
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .parentive-header {
          background: var(--background);
          border-bottom: 1px solid var(--border);
          padding: var(--space-4) 0;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
          background: rgba(245, 242, 234, 0.95);
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
        }

        @media (min-width: 768px) {
          .header-actions {
            margin-left: 0;
          }
        }

        .header-actions :global(.btn) {
          font-size: var(--text-sm);
          padding: var(--space-2) var(--space-4);
          white-space: nowrap;
        }
      `}</style>
    </header>
  );
}
