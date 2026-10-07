"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { homepageHashId } from "@/components/site-nav";

interface SiteNavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  pressed?: boolean;
  onNavigate?: () => void;
  onPress?: () => void;
}

export function SiteNavLink({
  href,
  children,
  className,
  pressed = false,
  onNavigate,
  onPress,
}: SiteNavLinkProps) {
  const pathname = usePathname();
  const hashId = homepageHashId(href);
  const ariaCurrent = !hashId && href === pathname ? "page" : undefined;
  const linkClassName = [className, pressed ? "is-pressed" : ""]
    .filter(Boolean)
    .join(" ");

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onPress?.();

    if (href === "/" && pathname === "/") {
      event.preventDefault();
      onNavigate?.();
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      window.history.pushState(null, "", "/");
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
        className={linkClassName}
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
      className={linkClassName}
      aria-current={ariaCurrent}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
