import Link from 'next/link';
import type { ServicePublicContent } from '@/lib/catalogue';

interface ServiceCardProps {
  service: ServicePublicContent;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="service-card"
    >
      <div className="service-card-header">
        <h3>{service.name}</h3>
        {service.requiresReview && (
          <span className="badge badge-review">Review required</span>
        )}
        {service.availabilityStatus === 'add-on' && (
          <span className="badge badge-addon">Add-on</span>
        )}
      </div>
      <p className="service-card-description">{service.shortDescription}</p>
      <div className="service-card-footer">
        <span className="link-text">Learn more →</span>
      </div>
    </Link>
  );
}
