import Image from "next/image";
import Link from "next/link";
import { SiteNavLink } from "@/components/site-nav-link";
import { getFooterNavItems } from "@/components/site-nav";
import { LOCKED_DESCRIPTOR, homepage } from "@/lib/homepage/content";

const LOGO_SIZE = 441;
const WORDMARK_WIDTH = 826;
const WORDMARK_HEIGHT = 187;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const navItems = getFooterNavItems();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-identity">
          <div className="site-footer-brand-row">
            <Link href="/" className="site-footer-brand-link" aria-label="Parentive">
              <Image
                src="/brand/parentive-logo.svg"
                alt=""
                width={LOGO_SIZE}
                height={LOGO_SIZE}
                unoptimized
                className="site-footer-mark"
                sizes="48px"
              />
            </Link>
            <Link href="/" className="site-footer-wordmark-link">
              <Image
                src="/brand/parentive-wordmark.svg"
                alt="Parentive"
                width={WORDMARK_WIDTH}
                height={WORDMARK_HEIGHT}
                unoptimized
                className="site-footer-wordmark"
                sizes="140px"
              />
            </Link>
          </div>
          <p className="site-footer-tagline">{LOCKED_DESCRIPTOR}</p>
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
