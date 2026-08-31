"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  links?: Array<{ href: string; label: string }>;
  ctaLabel?: string;
  ctaHref?: string;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      className,
      links = [],
      ctaLabel = "Get Started",
      ctaHref = "#",
      ...props
    },
    ref
  ) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-40 w-full border-b border-border-subtle bg-surface-emphasis/95 backdrop-blur supports-[backdrop-filter]:bg-surface-emphasis/80",
          className
        )}
        {...props}
      >
        <div className="container mx-auto max-w-container-xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <LogoLockup size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body text-text-primary hover:text-text-brand transition-colors duration-fast font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Button asChild variant="primary">
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-text-primary hover:text-text-brand transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border-subtle">
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-body text-text-primary hover:text-text-brand transition-colors duration-fast font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild variant="primary" className="mt-2">
                  <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>
    );
  }
);
Header.displayName = "Header";

export { Header };
