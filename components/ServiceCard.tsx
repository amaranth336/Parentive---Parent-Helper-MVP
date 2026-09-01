import Link from 'next/link';
import type { ServicePublicContent } from '@/lib/catalogue';
import { Card } from './ui/card';
import { Heading } from './ui/heading';
import { Text } from './ui/text';
import { Badge } from './ui/badge';

interface ServiceCardProps {
  service: ServicePublicContent;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card variant="elevated" hover asChild>
      <Link href={`/services/${service.slug}`} className="block h-full">
        <div className="flex justify-between items-start gap-2 mb-3">
          <Heading as="h3" className="text-text-brand">
            {service.name}
          </Heading>
          {service.requiresReview && (
            <Badge variant="default">Review required</Badge>
          )}
          {service.availabilityStatus === 'add-on' && (
            <Badge variant="success">Add-on</Badge>
          )}
        </div>
        <Text size="sm" color="muted" className="mb-4">
          {service.shortDescription}
        </Text>
        <Text size="sm" className="text-brand-primary font-semibold">
          Learn more →
        </Text>
      </Link>
    </Card>
  );
}
