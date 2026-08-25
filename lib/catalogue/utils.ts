/**
 * Parentive Service Catalogue Utilities
 * 
 * Provides selectors and filters for common service catalogue queries.
 */

import {
  CatalogueService,
  ServiceCategory,
  AvailabilityStatus,
  CategoryMetadata,
} from './types';
import { CATALOGUE, CATEGORIES } from './data';

/**
 * Get all services in the catalogue
 */
export function getAllServices(): CatalogueService[] {
  return CATALOGUE;
}

/**
 * Get all publicly visible services (excludes validation-only and internal-only services)
 */
export function getPubliclyVisibleServices(): CatalogueService[] {
  return CATALOGUE.filter(
    (service) => 
      service.public.availabilityStatus === 'available' ||
      service.public.availabilityStatus === 'coming-soon' ||
      service.public.availabilityStatus === 'seasonal'
  );
}

/**
 * Get all MVP validation priority services
 */
export function getMvpServices(): CatalogueService[] {
  return CATALOGUE.filter((service) => service.public.isMvpPriority);
}

/**
 * Get all featured services
 */
export function getFeaturedServices(): CatalogueService[] {
  return CATALOGUE.filter((service) => service.public.isFeatured);
}

/**
 * Get services by category
 */
export function getServicesByCategory(
  category: ServiceCategory
): CatalogueService[] {
  return CATALOGUE.filter((service) => service.public.category === category);
}

/**
 * Get services by availability status
 */
export function getServicesByAvailability(
  status: AvailabilityStatus
): CatalogueService[] {
  return CATALOGUE.filter(
    (service) => service.public.availabilityStatus === status
  );
}

/**
 * Get a service by slug
 */
export function getServiceBySlug(
  slug: string
): CatalogueService | undefined {
  return CATALOGUE.find((service) => service.public.slug === slug);
}

/**
 * Get a service by SKU
 */
export function getServiceBySku(
  sku: string
): CatalogueService | undefined {
  return CATALOGUE.find((service) => service.public.sku === sku);
}

/**
 * Get all services eligible as add-ons
 */
export function getAddOnServices(): CatalogueService[] {
  return CATALOGUE.filter((service) => service.public.isAddOnEligible);
}

/**
 * Get all category metadata
 */
export function getCategories(): CategoryMetadata[] {
  return CATEGORIES;
}

/**
 * Get category metadata by ID
 */
export function getCategoryById(
  id: ServiceCategory
): CategoryMetadata | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Search services by name or description (case-insensitive)
 */
export function searchServices(query: string): CatalogueService[] {
  const lowerQuery = query.toLowerCase();
  return CATALOGUE.filter(
    (service) =>
      service.public.name.toLowerCase().includes(lowerQuery) ||
      service.public.shortDescription.toLowerCase().includes(lowerQuery) ||
      service.public.detailedDescription.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get services with confirmed pricing
 */
export function getServicesWithPricing(): CatalogueService[] {
  return CATALOGUE.filter(
    (service) => 
      service.public.displayPrice !== null &&
      service.public.priceStatus === 'confirmed'
  );
}

/**
 * Group services by category
 */
export function groupServicesByCategory(): Record<
  ServiceCategory,
  CatalogueService[]
> {
  const grouped = {} as Record<ServiceCategory, CatalogueService[]>;

  CATEGORIES.forEach((category) => {
    grouped[category.id] = getServicesByCategory(category.id);
  });

  return grouped;
}
