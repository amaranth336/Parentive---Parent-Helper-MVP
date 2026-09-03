/**
 * Approved 004 organic shapes only: Open, Drift, Lean, Pebble, Room, Sidecar, Quiet Edge.
 * Shapes come from the locked 003/004 implementation — not generated blobs.
 */

import type { ReactNode } from 'react';

export type OrganicShapeName =
  | 'open'
  | 'drift'
  | 'lean'
  | 'pebble'
  | 'room'
  | 'sidecar'
  | 'quiet-edge';

interface OrganicShapeProps {
  shape: OrganicShapeName;
  color?: 'oat' | 'sand' | 'sage' | 'moss';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function OrganicShape({
  shape,
  color = 'oat',
  size = 'md',
  className = '',
}: OrganicShapeProps) {
  return (
    <div
      className={`organic-shape organic-shape-${shape} organic-shape-${color} organic-shape-${size} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

interface OrganicBrandSurfaceProps {
  shape?: OrganicShapeName;
  color?: 'oat' | 'sand' | 'sage' | 'moss';
  className?: string;
  children: ReactNode;
}

export function OrganicBrandSurface({
  shape = 'pebble',
  color = 'sand',
  className = '',
  children,
}: OrganicBrandSurfaceProps) {
  return (
    <div className={`organic-brand-surface ${className}`.trim()}>
      <OrganicShape shape={shape} color={color} size="xl" className="organic-brand-surface-shape" />
      <div className="organic-brand-surface-content">{children}</div>
    </div>
  );
}
