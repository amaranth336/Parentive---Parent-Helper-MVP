import { BrandLockup } from "@/components/brand-lockup";
import { SiteNavLink } from "@/components/site-nav-link";
import { getVisibleNavItems } from "@/components/site-nav";
import { LOCKED_DESCRIPTOR, homepage } from "@/lib/homepage/content";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const navItems = getVisibleNavItems();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-identity">
          <BrandLockup href="/" priority={false} />
          <p className="site-footer-tagline">{LOCKED_DESCRIPTOR}</p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer">
          <ul className="site-footer-nav-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <SiteNavLink href={item.href} className="site-nav-link">
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
