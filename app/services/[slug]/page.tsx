import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { 
  getAllServices, 
  getServiceBySlug 
} from '@/lib/catalogue';
import { ServiceDetailContent } from '@/components/ServiceDetailContent';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const navigationLinks = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

const footerLinks = [
  {
    title: "Services",
    items: [
      { href: "/services", label: "All services" },
      { href: "/pricing", label: "Pricing" },
      { href: "/service-area", label: "Service area" },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/trust", label: "Trust & Safety" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Join Us",
    items: [{ href: "/join", label: "Join the Hive" }],
  },
  {
    title: "Legal",
    items: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export async function generateStaticParams() {
  const services = getAllServices();
  return services.map((service) => ({
    slug: service.public.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Parentive',
    };
  }

  return {
    title: service.public.seo.title,
    description: service.public.seo.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Get related services
  const allServices = getAllServices();
  const relatedServices = service.public.relatedServices
    .map(relatedSlug => allServices.find(s => s.public.slug === relatedSlug))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  return (
    <>
      <Header 
        links={navigationLinks}
        ctaLabel="Request a visit"
        ctaHref="/request"
      />
      <main className="bg-surface-default min-h-screen py-12">
        <ServiceDetailContent 
          service={service} 
          relatedServices={relatedServices}
        />
      </main>
      <Footer links={footerLinks} />
    </>
  );
}
