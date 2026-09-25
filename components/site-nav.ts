import { EARLY_ACCESS_PATH } from "@/lib/early-access/copy";
import { HELPERS_PATH } from "@/lib/helpers/copy";
import { homepage } from "@/lib/homepage/content";

export type SiteNavItem = {
  label: string;
  href: string;
};

export function homepageSectionHref(sectionId: string): string {
  return `/#${sectionId}`;
}

export const siteNav: SiteNavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Our Support",
    href: homepageSectionHref(homepage.support.id),
  },
  {
    label: "How It Works",
    href: homepageSectionHref(homepage.howItWorks.id),
  },
  {
    label: "Early Access",
    href: EARLY_ACCESS_PATH,
  },
  {
    label: "Join the team",
    href: HELPERS_PATH,
  },
];

export function getVisibleNavItems(): SiteNavItem[] {
  return siteNav;
}

export function isHomepageHashHref(href: string): boolean {
  return href.startsWith("/#") && href.length > 2;
}

export function homepageHashId(href: string): string | null {
  if (!isHomepageHashHref(href)) {
    return null;
  }

  return href.slice(2);
}
