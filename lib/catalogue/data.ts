/**
 * Parentive Service Catalogue Data
 * 
 * Centralized source of truth for all Parentive services.
 * Contains working descriptions and preliminary scope definitions.
 */

import { CatalogueService, CategoryMetadata } from './types';

/**
 * Category definitions
 */
export const CATEGORIES: CategoryMetadata[] = [
  {
    id: 'laundry-clothing',
    name: 'Laundry & Clothing',
    description: 'Take laundry off your plate with resets that return clothes to where they belong.',
    displayOrder: 1,
  },
  {
    id: 'kitchen-food',
    name: 'Kitchen & Food',
    description: 'From meal prep to clean counters, we handle the kitchen tasks that pile up.',
    displayOrder: 2,
  },
  {
    id: 'home-reset',
    name: 'Home Reset',
    description: 'Restore rooms to ready-to-use order so you can focus on what matters.',
    displayOrder: 3,
  },
  {
    id: 'kids-parent-support',
    name: 'Kids & Parent Support',
    description: 'Extra hands when you need uninterrupted time or trusted care.',
    displayOrder: 4,
  },
  {
    id: 'life-outdoors',
    name: 'Life & Outdoors',
    description: 'Garden care and errands that keep your household running smoothly.',
    displayOrder: 5,
  },
];

/**
 * Complete service catalogue
 */
export const CATALOGUE: CatalogueService[] = [
  // ============================================
  // LAUNDRY & CLOTHING
  // ============================================
  {
    public: {
      sku: 'SVC-LAU-001',
      slug: 'laundry-reset',
      name: 'Laundry Reset',
      category: 'laundry-clothing',
      shortDescription: 'One less basket following you around.',
      detailedDescription: `We'll wash, dry, fold or hang, and put away one standard load of everyday laundry. You'll return to an empty hamper and clothes where they belong.`,
      inclusions: [
        'One standard load (approximately 8-10 lbs)',
        'Wash and dry',
        'Fold or hang as appropriate',
        'Put away in designated locations',
      ],
      exclusions: [
        'Dry-clean-only items',
        'Delicate hand-wash items',
        'Specialty treatments (stain removal, alterations)',
        'Sorting through mixed unsorted laundry',
      ],
      customerPrerequisites: [
        'Laundry already sorted and ready to wash',
        'Access to washer and dryer',
        'Laundry detergent and supplies available',
        'Clear direction on where items should be put away',
      ],
      pricingModel: 'fixed-outcome',
      displayPrice: null,
      priceStatus: 'pending-validation',
      availabilityStatus: 'validation',
      isAddOnEligible: true,
      isFeatured: true,
      isMvpPriority: true,
    },
    operational: {
      estimatedActiveMinutes: null,
      estimatedElapsedMinutes: null,
      p50CompletionMinutes: null,
      p75CompletionMinutes: null,
      p90CompletionMinutes: null,
      loadedLabourCost: null,
      targetContributionMargin: null,
      isConcurrencyEligible: true,
      compatibleConcurrentTaskTypes: ['kitchen-reset', 'playroom-reset'],
      requiredHelperCapabilities: [],
      riskClassification: 'standard',
      serviceAreaConstraints: [],
      validationStatus: 'not-validated',
      observationCount: 0,
    },
  },
];
