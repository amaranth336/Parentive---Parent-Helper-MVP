/**
 * Typography Primitives
 * 
 * Semantic typography components using Parentive design system.
 */

import React from 'react';

/* ============================================ */
/* HEADING */
/* ============================================ */

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  level?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level = 'h2', children, className = '' }: HeadingProps) {
  const Tag = level;
  return <Tag className={className}>{children}</Tag>;
}

/* ============================================ */
/* TEXT */
/* ============================================ */

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'secondary';
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export function Text({
  children,
  size = 'base',
  variant = 'default',
  className = '',
  as: Tag = 'p',
}: TextProps) {
  const sizeClass = size !== 'base' ? `text-${size}` : '';
  const variantClass = variant === 'muted' ? 'text-muted' : '';
  const classes = [sizeClass, variantClass, className].filter(Boolean).join(' ');

  return <Tag className={classes}>{children}</Tag>;
}

/* ============================================ */
/* LABEL */
/* ============================================ */

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function Label({ htmlFor, children, className = '', required }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
      {required && <span style={{ color: 'var(--error)', marginLeft: '0.25rem' }}>*</span>}
    </label>
  );
}

/* ============================================ */
/* EYEBROW */
/* ============================================ */

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p
      className={`eyebrow ${className}`.trim()}
      style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--muted-foreground)',
        marginBottom: 'var(--space-2)',
      }}
    >
      {children}
    </p>
  );
}
