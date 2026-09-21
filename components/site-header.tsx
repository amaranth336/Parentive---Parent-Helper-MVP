"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import { getVisibleNavItems } from "@/components/site-nav";

interface SiteHeaderProps {
  previewUnavailable?: boolean;
}

export function SiteHeader({ previewUnavailable = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navItems = getVisibleNavItems(previewUnavailable);
  const showMenuButton = navItems.length > 0;
  const lockupPriority =
    !previewUnavailable &&
    (pathname === "/" || pathname === "/design-system");

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className="site-header"
      aria-label={
        previewUnavailable ? "Header preview, unavailable destinations" : "Site"
      }
    >
      <div className="site-header-inner">
        <BrandLockup href="/" priority={lockupPriority} />
        <nav className="site-nav" aria-label="Primary">
          {showMenuButton ? (
            <button
              ref={buttonRef}
              type="button"
              className="site-nav-toggle"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((current) => !current)}
            >
              <span className="site-nav-toggle-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="visually-hidden">Menu</span>
            </button>
          ) : null}
          {navItems.length > 0 ? (
            <ul
              id={menuId}
              className={`site-nav-list${open ? " is-open" : ""}`}
            >
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.available ? (
                    <Link
                      href={item.href}
                      className="site-nav-link"
                      aria-current={pathname === item.href ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="site-nav-unavailable" aria-disabled="true">
                      {item.label}
                      <span className="visually-hidden">
                        , not yet available
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
