import Link from 'next/link';
import type { CatalogueService } from '@/lib/catalogue';
import { Heading } from './ui/heading';
import { Text } from './ui/text';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { Divider } from './ui/divider';

interface ServiceDetailContentProps {
  service: CatalogueService;
  relatedServices?: CatalogueService[];
}

export function ServiceDetailContent({ service, relatedServices = [] }: ServiceDetailContentProps) {
  const { public: publicContent } = service;

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-body-sm text-text-muted mb-6">
        <Link href="/services" className="text-brand-primary hover:underline">
          Services
        </Link>
        <span>/</span>
        <span>{publicContent.name}</span>
      </nav>

      <Card className="bg-surface-emphasis">
        {/* Header */}
        <div className="mb-8">
          <Heading as="h1" className="mb-6 text-text-brand">
            {publicContent.name}
          </Heading>
          
          {publicContent.requiresReview && (
            <Alert variant="info" className="mb-4">
              <strong>Review required:</strong> This service requires individual review during scheduling.
            </Alert>
          )}
          
          {publicContent.availabilityStatus === 'add-on' && (
            <Alert variant="success" className="mb-4">
              <strong>Add-on service:</strong> This can be added to eligible service visits.
            </Alert>
          )}
        </div>

        {/* Outcome */}
        <div className="mb-8">
          <Heading as="h2" className="mb-4 text-text-brand">
            Outcome
          </Heading>
          <Text size="lg" className="text-text-primary">
            {publicContent.detailedDescription}
          </Text>
        </div>

        {/* Inclusions */}
        {publicContent.inclusions.length > 0 && (
          <div className="mb-8">
            <Heading as="h2" className="mb-4 text-text-brand">
              What this can include
            </Heading>
            <ul className="space-y-2">
              {publicContent.inclusions.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-brand-primary font-bold">✓</span>
                  <Text size="sm">{item}</Text>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prerequisites */}
        {publicContent.customerPrerequisites.length > 0 && (
          <div className="mb-8">
            <Heading as="h2" className="mb-4 text-text-brand">
              What you'll provide
            </Heading>
            <ul className="space-y-2">
              {publicContent.customerPrerequisites.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-brand-primary font-bold">✓</span>
                  <Text size="sm">{item}</Text>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Service Process */}
        <div className="mb-8">
          <Heading as="h2" className="mb-4 text-text-brand">
            What to expect
          </Heading>
          <Text>{publicContent.serviceProcess}</Text>
        </div>

        {/* Important Notes */}
        {publicContent.importantNotes.length > 0 && (
          <div className="mb-8">
            <Heading as="h2" className="mb-4 text-text-brand">
              Good to know
            </Heading>
            <ul className="space-y-2">
              {publicContent.importantNotes.map((note, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-brand-primary font-bold">✓</span>
                  <Text size="sm">{note}</Text>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exclusions */}
        {publicContent.exclusions.length > 0 && (
          <div className="mb-8">
            <Heading as="h2" className="mb-4 text-text-brand">
              What's not included
            </Heading>
            <ul className="space-y-2">
              {publicContent.exclusions.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-text-muted">—</span>
                  <Text size="sm" color="muted">{item}</Text>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mb-8">
            <Heading as="h2" className="mb-4 text-text-brand">
              Combine it with
            </Heading>
            <div className="space-y-3">
              {relatedServices.map((related) => (
                <Link 
                  key={related.public.sku}
                  href={`/services/${related.public.slug}`} 
                  className="block"
                >
                  <Card variant="default">
                    <Heading as="h3" className="mb-1 text-text-brand">
                      {related.public.name}
                    </Heading>
                    <Text size="sm" color="muted">
                      {related.public.shortDescription}
                    </Text>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {publicContent.eligibleAddOns.length > 0 && (
          <div className="mb-8">
            <Heading as="h2" className="mb-4 text-text-brand">
              Available add-ons
            </Heading>
            <Text size="sm" color="muted" className="mb-3">
              You can add these to this visit:
            </Text>
            <ul className="space-y-2">
              {publicContent.eligibleAddOns.map((addonSlug, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-brand-primary font-bold">✓</span>
                  <Link 
                    href={`/services/${addonSlug}`}
                    className="text-body-sm text-brand-primary hover:underline font-semibold"
                  >
                    {addonSlug.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Divider className="my-8" />

        {/* CTA */}
        <div className="text-center">
          <Button variant="primary" size="lg" className="mb-4">
            Take it off my plate
          </Button>
          <Text size="sm" color="muted">
            This is an early access pilot service. Your request will be reviewed before confirmation.
          </Text>
        </div>
      </Card>
    </div>
  );
}
