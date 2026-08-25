import Link from 'next/link';
import { Container } from '@/components/ui/container';

const footerNavigation = {
  services: [
    { name: 'Browse Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Service Packages', href: '/packages' },
    { name: 'How It Works', href: '/how-it-works' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Trust & Safety', href: '/trust' },
    { name: 'Become a Helper', href: '/helpers' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Policies', href: '/policies' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-auto">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Parentive
              </Link>
              <p className="mt-4 text-sm text-neutral-600">
                Trusted, flexible family support
              </p>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                Services
              </h3>
              <ul className="mt-4 space-y-3">
                {footerNavigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-500 text-center">
              &copy; {new Date().getFullYear()} Parentive. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
