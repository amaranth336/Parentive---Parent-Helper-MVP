import Image from "next/image";
import Link from "next/link";
import { SiteNavLink } from "@/components/site-nav-link";
import { getVisibleNavItems } from "@/components/site-nav";
import { LOCKED_DESCRIPTOR, homepage } from "@/lib/homepage/content";

const MARK_SIZE = 1200;
const WORDMARK_WIDTH = 1181;
const WORDMARK_HEIGHT = 268;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const navItems = getVisibleNavItems();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-identity">
          <Link href="/" className="site-footer-brand-link" aria-label="Parentive">
            <Image
              src="/brand/parentive-mark.png"
              alt=""
              width={MARK_SIZE}
              height={MARK_SIZE}
              className="site-footer-mark"
              sizes="48px"
            />
          </Link>
          <div className="site-footer-brand-text">
            <Link href="/" className="site-footer-wordmark-link">
              <Image
                src="/brand/parentive-wordmark.png"
                alt="Parentive"
                width={WORDMARK_WIDTH}
                height={WORDMARK_HEIGHT}
                className="site-footer-wordmark"
                sizes="140px"
              />
            </Link>
            <p className="site-footer-tagline">{LOCKED_DESCRIPTOR}</p>
          </div>
        </div>
        <nav className="site-footer-nav" aria-label="Footer">
          <h2 className="site-footer-nav-heading">Explore</h2>
          <ul className="site-footer-nav-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <SiteNavLink href={item.href} className="site-footer-nav-link">
                  {item.label}
                </SiteNavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-footer-area">
          <h2 className="site-footer-area-heading">{homepage.area.heading}</h2>
          <p>{homepage.area.body}</p>
        </div>
        <p className="site-footer-copy">© {year} Parentive</p>
      </div>
    </footer>
  );
}
