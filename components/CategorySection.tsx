import type { CategoryMetadata, CatalogueService } from '@/lib/catalogue';
import { ServiceCard } from './ServiceCard';
import { Heading } from './ui/heading';
import { Text } from './ui/text';
import { Section } from './ui/section';

interface CategorySectionProps {
  category: CategoryMetadata;
  services: CatalogueService[];
}

export function CategorySection({ category, services }: CategorySectionProps) {
  if (services.length === 0) return null;

  return (
    <Section className="bg-surface-secondary">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <Heading as="h2" className="mb-2 text-text-brand">
            {category.name}
          </Heading>
          <Text color="muted">{category.description}</Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.public.sku} service={service.public} />
          ))}
        </div>
      </div>
    </Section>
  );
}
