"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import { headerConcealProgress } from "@/components/site-header-scroll";
import { SiteNavLink } from "@/components/site-nav-link";
import { getVisibleNavItems, isHomepageJumpHref } from "@/components/site-nav";

interface SiteHeaderProps {
  label?: string;
}

export function SiteHeader({ label = "Site" }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pressedHref, setPressedHref] = useState<string | null>(null);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const header = headerRef.current;
    const footer = document.querySelector(".site-footer");
    if (!header || !(footer instanceof HTMLElement)) {
      return;
    }

    let frame = 0;

    function update() {
      frame = 0;
      if (!header) {
        return;
      }

      const progress = headerConcealProgress({
        footerTop: footer instanceof HTMLElement ? footer.getBoundingClientRect().top : 0,
        viewportHeight: window.innerHeight,
        headerHeight: header.offsetHeight,
        scrollY: window.scrollY,
      });
      const height = `${header.offsetHeight}px`;
      header.style.setProperty("--header-hide", progress.toFixed(4));
      header.style.setProperty("--site-header-height", height);
      document.documentElement.style.setProperty("--site-header-height", height);
      header.style.visibility = progress >= 1 ? "hidden" : "";
      header.style.pointerEvents = progress >= 1 ? "none" : "";
    }

    function requestUpdate() {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    }

    update();
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(header);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    if (!pressedHref) {
      return;
    }

    const nav = headerRef.current?.querySelector(".site-nav");
    if (!nav) {
      return;
    }

    function onPointerOver(event: Event) {
      if (
        !(event instanceof PointerEvent) ||
        event.pointerType === "touch" ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest(".site-nav-link");
      if (!link || link.classList.contains("is-pressed")) {
        return;
      }

      setPressedHref(null);
    }

    nav.addEventListener("pointerover", onPointerOver);
    return () => nav.removeEventListener("pointerover", onPointerOver);
  }, [pressedHref]);

  return (
    <header
      ref={headerRef}
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
                    pressed={pressedHref === item.href}
                    onNavigate={() => setOpen(false)}
                    onPress={() => {
                      setPressedHref(
                        isHomepageJumpHref(item.href) ? item.href : null,
                      );
                    }}
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
