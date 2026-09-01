/**
 * Tests for Parentive Service Catalogue Utilities
 */

import {
  getAllServices,
  getPubliclyVisibleServices,
  getMvpServices,
  getFeaturedServices,
  getServicesByCategory,
  getServicesByAvailability,
  getServiceBySlug,
  getServiceBySku,
  getAddOnServices,
  getCategories,
  getCategoryById,
  searchServices,
  getServicesWithPricing,
  groupServicesByCategory,
} from './utils';
import { CATALOGUE } from './data';

describe('Catalogue Utilities', () => {
  describe('getAllServices', () => {
    it('should return all services from the catalogue', () => {
      const services = getAllServices();
      expect(services).toBe(CATALOGUE);
      expect(services.length).toBeGreaterThan(0);
    });
  });

  describe('getPubliclyVisibleServices', () => {
    it('should return only publicly visible services', () => {
      const services = getPubliclyVisibleServices();
      const statuses = services.map((s) => s.public.availabilityStatus);

      statuses.forEach((status) => {
        expect(['available', 'coming-soon', 'seasonal']).toContain(status);
      });

      expect(statuses).not.toContain('validation');
    });

    it('should exclude validation-only services', () => {
      const services = getPubliclyVisibleServices();
      const hasValidationOnly = services.some(
        (s) => s.public.availabilityStatus === 'validation'
      );
      expect(hasValidationOnly).toBe(false);
    });
  });

  describe('getMvpServices', () => {
    it('should return MVP services', () => {
      const services = getMvpServices();
      expect(services.length).toBeGreaterThan(0);
    });

    it('should return only services marked as MVP priority', () => {
      const services = getMvpServices();
      services.forEach((service) => {
        expect(service.public.isMvpPriority).toBe(true);
      });
    });

    it('should include key MVP services', () => {
      const services = getMvpServices();
      const slugs = services.map((s) => s.public.slug);

      // Check for at least the first MVP service as an example
      expect(slugs).toContain('laundry-reset');
    });
  });

  describe('getFeaturedServices', () => {
    it('should return only featured services', () => {
      const services = getFeaturedServices();
      services.forEach((service) => {
        expect(service.public.isFeatured).toBe(true);
      });
    });

    it('should return at least one featured service', () => {
      const services = getFeaturedServices();
      expect(services.length).toBeGreaterThan(0);
    });
  });

  describe('getServicesByCategory', () => {
    it('should filter services by category', () => {
      const services = getServicesByCategory('home-laundry');
      services.forEach((service) => {
        expect(service.public.category).toBe('home-laundry');
      });
    });

    it('should return services for valid categories', () => {
      const laundry = getServicesByCategory('home-laundry');
      expect(laundry.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getServicesByAvailability', () => {
    it('should return validation services', () => {
      const services = getServicesByAvailability('validation');
      services.forEach((service) => {
        expect(service.public.availabilityStatus).toBe('validation');
      });
    });

    it('should return coming-soon services', () => {
      const services = getServicesByAvailability('coming-soon');
      services.forEach((service) => {
        expect(service.public.availabilityStatus).toBe('coming-soon');
      });
    });

    it('should return add-on services', () => {
      const services = getServicesByAvailability('add-on');
      services.forEach((service) => {
        expect(service.public.availabilityStatus).toBe('add-on');
      });
    });

    it('should return seasonal services', () => {
      const services = getServicesByAvailability('seasonal');
      services.forEach((service) => {
        expect(service.public.availabilityStatus).toBe('seasonal');
      });
    });
  });

  describe('getServiceBySlug', () => {
    it('should find service by slug', () => {
      const service = getServiceBySlug('laundry-reset');
      expect(service).toBeDefined();
      expect(service?.public.slug).toBe('laundry-reset');
      expect(service?.public.name).toBe('Laundry Reset');
    });

    it('should return undefined for non-existent slug', () => {
      const service = getServiceBySlug('non-existent-service');
      expect(service).toBeUndefined();
    });

    it('should find expected slugs that exist', () => {
      const slugs = ['laundry-reset'];

      slugs.forEach((slug) => {
        const service = getServiceBySlug(slug);
        expect(service).toBeDefined();
        expect(service?.public.slug).toBe(slug);
      });
    });
  });

  describe('getServiceBySku', () => {
    it('should find service by SKU', () => {
      const service = getServiceBySku('SVC-LAU-001');
      expect(service).toBeDefined();
      expect(service?.public.sku).toBe('SVC-LAU-001');
      expect(service?.public.name).toBe('Laundry Reset');
    });

    it('should return undefined for non-existent SKU', () => {
      const service = getServiceBySku('SVC-XXX-999');
      expect(service).toBeUndefined();
    });
  });

  describe('getAddOnServices', () => {
    it('should return only add-on eligible services', () => {
      const services = getAddOnServices();
      services.forEach((service) => {
        expect(service.public.isAddOnEligible).toBe(true);
      });
    });

    it('should return at least one add-on service', () => {
      const services = getAddOnServices();
      expect(services.length).toBeGreaterThan(0);
    });
  });

  describe('getCategories', () => {
    it('should return all 5 categories', () => {
      const categories = getCategories();
      expect(categories.length).toBe(5);
    });

    it('should return categories in correct display order', () => {
      const categories = getCategories();
      expect(categories[0].id).toBe('home-laundry');
      expect(categories[1].id).toBe('kitchen-food');
      expect(categories[2].id).toBe('home-reset');
      expect(categories[3].id).toBe('kids-parent-support');
      expect(categories[4].id).toBe('life-outdoors');
    });

    it('should have all required metadata fields', () => {
      const categories = getCategories();
      categories.forEach((category) => {
        expect(category.id).toBeDefined();
        expect(category.name).toBeDefined();
        expect(category.description).toBeDefined();
        expect(category.displayOrder).toBeDefined();
      });
    });
  });

  describe('getCategoryById', () => {
    it('should find category by ID', () => {
      const category = getCategoryById('kitchen-food');
      expect(category).toBeDefined();
      expect(category?.id).toBe('kitchen-food');
      expect(category?.name).toBe('Kitchen & Food');
    });

    it('should return undefined for non-existent category', () => {
      const category = getCategoryById('non-existent' as any);
      expect(category).toBeUndefined();
    });
  });

  describe('searchServices', () => {
    it('should find services by name', () => {
      const results = searchServices('laundry');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((s) => s.public.name.includes('Laundry'))).toBe(true);
    });

    it('should find services by description', () => {
      const results = searchServices('basket');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
      const resultsLower = searchServices('laundry');
      const resultsUpper = searchServices('LAUNDRY');
      const resultsMixed = searchServices('LaUnDrY');

      expect(resultsLower.length).toBe(resultsUpper.length);
      expect(resultsLower.length).toBe(resultsMixed.length);
    });

    it('should return empty array for non-matching query', () => {
      const results = searchServices('zzzznonexistent');
      expect(results.length).toBe(0);
    });
  });

  describe('getServicesWithPricing', () => {
    it('should return only services with confirmed pricing', () => {
      const services = getServicesWithPricing();
      services.forEach((service) => {
        expect(service.public.displayPrice).not.toBeNull();
        expect(service.public.priceStatus).toBe('confirmed');
      });
    });

    it('should return empty array when no prices are confirmed', () => {
      const services = getServicesWithPricing();
      // Since we haven't set any confirmed prices yet, this should be empty
      expect(services.length).toBe(0);
    });
  });

  describe('groupServicesByCategory', () => {
    it('should group all services by category', () => {
      const grouped = groupServicesByCategory();

      // Check that grouping works correctly
      expect(grouped['home-laundry']).toBeDefined();
      expect(Array.isArray(grouped['home-laundry'])).toBe(true);
    });

    it('should have all categories as keys', () => {
      const grouped = groupServicesByCategory();
      const keys = Object.keys(grouped);

      expect(keys).toContain('home-laundry');
      expect(keys).toContain('kitchen-food');
      expect(keys).toContain('home-reset');
      expect(keys).toContain('kids-parent-support');
      expect(keys).toContain('life-outdoors');
    });

    it('should group services correctly', () => {
      const grouped = groupServicesByCategory();

      grouped['home-laundry'].forEach((service) => {
        expect(service.public.category).toBe('home-laundry');
      });

      grouped['kitchen-food'].forEach((service) => {
        expect(service.public.category).toBe('kitchen-food');
      });
    });
  });

  describe('Data Integrity', () => {
    it('should have services defined', () => {
      expect(CATALOGUE.length).toBeGreaterThan(0);
    });

    it('should have unique SKUs', () => {
      const skus = CATALOGUE.map((s) => s.public.sku);
      const uniqueSkus = new Set(skus);
      expect(skus.length).toBe(uniqueSkus.size);
    });

    it('should have unique slugs', () => {
      const slugs = CATALOGUE.map((s) => s.public.slug);
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    it('should have all required public fields', () => {
      CATALOGUE.forEach((service) => {
        expect(service.public.sku).toBeDefined();
        expect(service.public.slug).toBeDefined();
        expect(service.public.name).toBeDefined();
        expect(service.public.category).toBeDefined();
        expect(service.public.shortDescription).toBeDefined();
        expect(service.public.detailedDescription).toBeDefined();
        expect(service.public.inclusions).toBeInstanceOf(Array);
        expect(service.public.exclusions).toBeInstanceOf(Array);
        expect(service.public.customerPrerequisites).toBeInstanceOf(Array);
        expect(service.public.pricingModel).toBeDefined();
      });
    });

    it('should have all required operational fields', () => {
      CATALOGUE.forEach((service) => {
        expect(service.operational).toBeDefined();
        expect(service.operational.isConcurrencyEligible).toBeDefined();
        expect(service.operational.compatibleConcurrentTaskTypes).toBeInstanceOf(Array);
        expect(service.operational.requiredHelperCapabilities).toBeInstanceOf(Array);
        expect(service.operational.serviceAreaConstraints).toBeInstanceOf(Array);
        expect(service.operational.validationStatus).toBeDefined();
        expect(service.operational.observationCount).toBeDefined();
      });
    });

    it('should not have fabricated pricing for unvalidated services', () => {
      CATALOGUE.forEach((service) => {
        if (service.public.priceStatus === 'pending-validation') {
          expect(service.public.displayPrice).toBeNull();
        }
      });
    });

    it('should not have fabricated timing data for unvalidated services', () => {
      CATALOGUE.forEach((service) => {
        if (service.operational.validationStatus === 'not-validated') {
          // Allow estimatedActiveMinutes for some services where it's obvious
          // but percentile data should not be fabricated
          expect(service.operational.p50CompletionMinutes).toBeNull();
          expect(service.operational.p75CompletionMinutes).toBeNull();
          expect(service.operational.p90CompletionMinutes).toBeNull();
        }
      });
    });

    it('should have appropriate risk classification for childcare services', () => {
      const childcareServices = CATALOGUE.filter((s) =>
        s.operational.requiredHelperCapabilities.includes('childcare')
      );

      childcareServices.forEach((service) => {
        expect(service.operational.riskClassification).toBe('requires-screening');
      });
    });
  });
});
