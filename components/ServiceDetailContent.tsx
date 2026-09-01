import Link from 'next/link';
import type { CatalogueService } from '@/lib/catalogue';

interface ServiceDetailContentProps {
  service: CatalogueService;
  relatedServices?: CatalogueService[];
}

export function ServiceDetailContent({ service, relatedServices = [] }: ServiceDetailContentProps) {
  const { public: publicContent } = service;

  return (
    <div className="service-detail">
      <div className="service-detail-header">
        <div className="breadcrumb">
          <Link href="/services">Services</Link>
          <span className="breadcrumb-separator">/</span>
          <span>{publicContent.name}</span>
        </div>
        <h1>{publicContent.name}</h1>
        {publicContent.requiresReview && (
          <div className="notice notice-info">
            <strong>Review required:</strong> This service requires individual review during scheduling.
          </div>
        )}
        {publicContent.availabilityStatus === 'add-on' && (
          <div className="notice notice-addon">
            <strong>Add-on service:</strong> This can be added to eligible service visits.
          </div>
        )}
      </div>

      <section className="detail-section">
        <h2>Outcome</h2>
        <p className="lead">{publicContent.detailedDescription}</p>
      </section>

      {publicContent.inclusions.length > 0 && (
        <section className="detail-section">
          <h2>What this can include</h2>
          <ul className="detail-list">
            {publicContent.inclusions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {publicContent.customerPrerequisites.length > 0 && (
        <section className="detail-section">
          <h2>What you&apos;ll provide</h2>
          <ul className="detail-list">
            {publicContent.customerPrerequisites.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="detail-section">
        <h2>What to expect</h2>
        <p>{publicContent.serviceProcess}</p>
      </section>

      {publicContent.importantNotes.length > 0 && (
        <section className="detail-section">
          <h2>Good to know</h2>
          <ul className="detail-list">
            {publicContent.importantNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      {publicContent.exclusions.length > 0 && (
        <section className="detail-section">
          <h2>What&apos;s not included</h2>
          <ul className="detail-list detail-list-muted">
            {publicContent.exclusions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="detail-section">
          <h2>Combine it with</h2>
          <div className="related-services">
            {relatedServices.map((related) => (
              <Link
                key={related.public.sku}
                href={`/services/${related.public.slug}`}
                className="related-service-card"
              >
                <strong>{related.public.name}</strong>
                <span>{related.public.shortDescription}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {publicContent.eligibleAddOns.length > 0 && (
        <section className="detail-section">
          <h2>Available add-ons</h2>
          <p className="text-muted">
            You can add these to this visit:
          </p>
          <ul className="detail-list">
            {publicContent.eligibleAddOns.map((addonSlug, index) => (
              <li key={index}>
                <Link href={`/services/${addonSlug}`} className="link-inline">
                  {addonSlug.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="detail-section cta-section">
        <button className="btn btn-primary btn-large">
          Take it off my plate
        </button>
        <p className="cta-note">
          This is an early access pilot service. Your request will be reviewed before confirmation.
        </p>
      </section>
    </div>
  );
}
