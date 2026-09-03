/**
 * Lucide functional icon wrapper — 004 locked treatment.
 */

import type { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-hidden'?: boolean;
}

const SIZE_PX = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export function Icon({
  icon: IconComponent,
  size = 'md',
  className = '',
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  return (
    <IconComponent
      className={`icon icon-${size} ${className}`.trim()}
      size={SIZE_PX[size]}
      strokeWidth={1.75}
      aria-hidden={ariaHidden}
    />
  );
}
