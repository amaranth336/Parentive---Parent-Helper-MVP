"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  brandAssets,
  type BrandLockupKind,
} from "@/lib/brand-assets";

const MARK_PX: Record<NonNullable<LogoProps["size"]>, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const WORDMARK_HEIGHT_PX: Record<NonNullable<WordmarkProps["size"]>, number> = {
  sm: 20,
  md: 28,
  lg: 36,
};

const LOCKUP_HEIGHT_PX: Record<NonNullable<LogoLockupProps["size"]>, number> = {
  sm: 32,
  md: 40,
  lg: 52,
};

function BrandAssetImage({
  kind,
  height,
  width,
  alt,
  className,
  decorative,
}: {
  kind: BrandLockupKind;
  height: number;
  width?: number | "auto";
  alt: string;
  className?: string;
  decorative?: boolean;
}) {
  const asset = brandAssets[kind];
  const [src, setSrc] = React.useState(asset.svg);
  const [missing, setMissing] = React.useState(false);

  React.useEffect(() => {
    setSrc(asset.svg);
    setMissing(false);
  }, [asset.svg]);

  if (missing) {
    return (
      <span
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : `${alt} artwork missing`}
        className={cn(
          "inline-flex items-center justify-center rounded-subtle border border-dashed border-border-default bg-surface-secondary px-3 text-center text-utility text-text-muted",
          className
        )}
        style={{
          height,
          minWidth: width === "auto" || width === undefined ? height * 2 : width,
        }}
      >
        Missing {asset.kind} file
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- brand SVGs/PNGs need an onError PNG fallback
    <img
      src={src}
      alt={decorative ? "" : alt}
      height={height}
      width={width === "auto" || width === undefined ? undefined : width}
      className={cn("object-contain object-left", className)}
      style={{
        height,
        width: width === "auto" || width === undefined ? "auto" : width,
        maxWidth: "100%",
      }}
      onError={(event) => {
        const current = event.currentTarget.getAttribute("src") ?? "";
        if (current.endsWith(".svg")) {
          setSrc(asset.png);
          return;
        }
        setMissing(true);
      }}
    />
  );
}

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg" | "xl";
  /** When true, the image is hidden from assistive tech (use on a named link). */
  decorative?: boolean;
}

const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  ({ className, size = "md", decorative = false, ...props }, ref) => {
    const px = MARK_PX[size];

    return (
      <span
        ref={ref}
        className={cn("inline-flex shrink-0 items-center justify-center", className)}
        {...props}
      >
        <BrandAssetImage
          kind="mark"
          height={px}
          width={px}
          alt={brandAssets.mark.label}
          decorative={decorative}
        />
      </span>
    );
  }
);
Logo.displayName = "Logo";

export interface WordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  decorative?: boolean;
}

const Wordmark = React.forwardRef<HTMLSpanElement, WordmarkProps>(
  ({ className, size = "md", decorative = false, ...props }, ref) => {
    const height = WORDMARK_HEIGHT_PX[size];

    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center", className)}
        {...props}
      >
        <BrandAssetImage
          kind="wordmark"
          height={height}
          width="auto"
          alt={brandAssets.wordmark.label}
          decorative={decorative}
        />
      </span>
    );
  }
);
Wordmark.displayName = "Wordmark";

export interface LogoLockupProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  tagline?: boolean;
  decorative?: boolean;
}

const LogoLockup = React.forwardRef<HTMLSpanElement, LogoLockupProps>(
  (
    { className, size = "md", tagline = false, decorative = false, ...props },
    ref
  ) => {
    const height = LOCKUP_HEIGHT_PX[size];

    return (
      <span
        ref={ref}
        className={cn("inline-flex flex-col items-start gap-1", className)}
        {...props}
      >
        <BrandAssetImage
          kind="lockup"
          height={height}
          width="auto"
          alt={brandAssets.lockup.label}
          decorative={decorative}
        />
        {tagline && (
          <span className="text-utility text-text-muted">
            Trusted, flexible help for real life
          </span>
        )}
      </span>
    );
  }
);
LogoLockup.displayName = "LogoLockup";

export { Logo, Wordmark, LogoLockup };
