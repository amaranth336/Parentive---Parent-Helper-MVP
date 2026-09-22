"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { homepageHashId } from "@/components/site-nav";

interface SiteNavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}

export function SiteNavLink({
  href,
  children,
  className,
  onNavigate,
}: SiteNavLinkProps) {
  const pathname = usePathname();
  const hashId = homepageHashId(href);
  const ariaCurrent = !hashId && href === pathname ? "page" : undefined;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (href === "/" && pathname === "/") {
      onNavigate?.();
      return;
    }

    if (pathname !== "/" || !hashId) {
      return;
    }

    const target = document.getElementById(hashId);
    if (!target) {
      return;
    }

    event.preventDefault();
    onNavigate?.();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    window.history.pushState(null, "", href);
  }

  if (hashId) {
    return (
      <a
        href={href}
        className={className}
        aria-current={ariaCurrent}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      aria-current={ariaCurrent}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
