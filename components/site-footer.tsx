import { BrandLockup } from "@/components/brand-lockup";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <BrandLockup href="/" priority={false} />
        <p className="site-footer-tagline">
          Trusted, flexible help for real life.
        </p>
        <p className="site-footer-copy">© {year} Parentive</p>
      </div>
    </footer>
  );
}
