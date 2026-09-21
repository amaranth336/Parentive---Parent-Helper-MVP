export type SiteNavItem = {
  label: string;
  href: string;
  available: boolean;
};

export const siteNav: SiteNavItem[] = [
  { label: "Home", href: "/", available: true },
  { label: "Services", href: "/services", available: false },
  { label: "Early Access", href: "/early-access", available: false },
];

export function getVisibleNavItems(
  previewUnavailable = false,
): SiteNavItem[] {
  return siteNav.filter((item) => {
    if (item.href === "/") {
      return false;
    }

    return previewUnavailable || item.available;
  });
}
