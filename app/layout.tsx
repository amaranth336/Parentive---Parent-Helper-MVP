import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Parentive - Trusted, Flexible Family Support',
    template: '%s | Parentive',
  },
  description:
    'Take something off your plate. Parentive provides trusted, flexible help for real family life.',
  keywords: [
    'family support',
    'parent helper',
    'childcare',
    'household help',
    'Vancouver',
  ],
  authors: [{ name: 'Parentive' }],
  creator: 'Parentive',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://parentive.ca',
    siteName: 'Parentive',
    title: 'Parentive - Trusted, Flexible Family Support',
    description:
      'Take something off your plate. Parentive provides trusted, flexible help for real family life.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parentive - Trusted, Flexible Family Support',
    description:
      'Take something off your plate. Parentive provides trusted, flexible help for real family life.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
