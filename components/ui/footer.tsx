import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoLockup } from "@/components/brand/logo";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  links?: Array<{
    title: string;
    items: Array<{ href: string; label: string }>;
  }>;
  socialLinks?: Array<{ href: string; label: string; icon?: React.ReactNode }>;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, links = [], socialLinks = [], ...props }, ref) => {
    const currentYear = new Date().getFullYear();

    return (
      <footer
        ref={ref}
        className={cn("bg-surface-secondary border-t border-border-subtle", className)}
        {...props}
      >
        <div className="container mx-auto max-w-container-xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <LogoLockup size="sm" tagline />
              <Text size="sm" color="muted" className="mt-4">
                Support isn&apos;t a last resort. It&apos;s part of how modern life gets
                done.
              </Text>
            </div>

            {/* Link Sections */}
            {links.map((section) => (
              <div key={section.title}>
                <h3 className="text-label font-semibold text-text-brand mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-body-sm text-text-secondary hover:text-text-brand transition-colors duration-fast"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Divider className="my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Text size="sm" color="muted">
              © {currentYear} Parentive. All rights reserved.
            </Text>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.href}
                    href={social.href}
                    className="text-text-secondary hover:text-text-brand transition-colors duration-fast"
                    aria-label={social.label}
                  >
                    {social.icon || social.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  }
);
Footer.displayName = "Footer";

export { Footer };
