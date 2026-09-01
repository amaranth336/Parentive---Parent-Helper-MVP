import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { 
  getAllServices, 
  getServiceBySlug 
} from '@/lib/catalogue';
import { ServiceDetailContent } from '@/components/ServiceDetailContent';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

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
    <main className="service-detail-page">
      <ServiceDetailContent 
        service={service} 
        relatedServices={relatedServices}
      />
    </main>
  );
}
