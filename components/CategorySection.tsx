import type { CategoryMetadata, CatalogueService } from '@/lib/catalogue';
import { ServiceCard } from './ServiceCard';

interface CategorySectionProps {
  category: CategoryMetadata;
  services: CatalogueService[];
}

export function CategorySection({ category, services }: CategorySectionProps) {
  if (services.length === 0) return null;

  return (
    <section className="category-section">
      <div className="category-header">
        <h2>{category.name}</h2>
        <p className="category-description">{category.description}</p>
      </div>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard key={service.public.sku} service={service.public} />
        ))}
      </div>
    </section>
  );
}
