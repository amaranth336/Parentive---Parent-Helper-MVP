/**
 * Approved Parentive logo assets from public/brand/.
 * Renders the supplied production files — does not reconstruct the mark.
 */

import Image from 'next/image';

export const BRAND_MARK_SRC = '/brand/parentive_logo_mark_final.png';
export const BRAND_LOCKUP_SRC = '/brand/parentive_logo_lockup_final.png';
export const BRAND_WORDMARK_SRC = '/brand/parentive_wordmark_final.png';

interface BrandImageProps {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
}

export function LogoLockup({
  className = '',
  decorative = true,
  priority = false,
}: BrandImageProps) {
  return (
    <Image
      src={BRAND_LOCKUP_SRC}
      alt={decorative ? '' : 'Parentive'}
      width={2500}
      height={850}
      className={`brand-lockup ${className}`.trim()}
      priority={priority}
    />
  );
}

export function LogoMark({ className = '', decorative = true }: BrandImageProps) {
  return (
    <Image
      src={BRAND_MARK_SRC}
      alt={decorative ? '' : 'Parentive'}
      width={1200}
      height={1200}
      className={`brand-mark ${className}`.trim()}
    />
  );
}

export function Wordmark({ className = '', decorative = true }: BrandImageProps) {
  return (
    <Image
      src={BRAND_WORDMARK_SRC}
      alt={decorative ? '' : 'Parentive'}
      width={1181}
      height={268}
      className={`brand-wordmark ${className}`.trim()}
    />
  );
}
