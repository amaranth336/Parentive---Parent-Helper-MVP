"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import { SiteNavLink } from "@/components/site-nav-link";
import { getVisibleNavItems } from "@/components/site-nav";

interface SiteHeaderProps {
  label?: string;
}

export function SiteHeader({ label = "Site" }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navItems = getVisibleNavItems();
  const showMenuButton = navItems.length > 0;
  const lockupPriority = pathname === "/" || pathname === "/design-system";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
      className={`site-header${open ? " is-nav-open" : ""}`}
      aria-label={label}
    >
      <div className="site-header-inner">
        <div className="site-header-bar">
          <BrandLockup href="/" priority={lockupPriority} />
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
              <span className="visually-hidden">
                {open ? "Close menu" : "Menu"}
              </span>
            </button>
          ) : null}
        </div>
        {navItems.length > 0 ? (
          <nav className="site-nav" aria-label="Primary">
            <ul
              id={menuId}
              className={`site-nav-list${open ? " is-open" : ""}`}
            >
              {navItems.map((item) => (
                <li key={item.href}>
                  <SiteNavLink
                    href={item.href}
                    className="site-nav-link"
                    onNavigate={() => setOpen(false)}
                  >
                    {item.label}
                  </SiteNavLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
