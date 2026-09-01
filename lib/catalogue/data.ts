/**
 * Parentive Service Catalogue Data
 * 
 * Centralized source of truth for all Parentive services.
 * Contains working descriptions and preliminary scope definitions.
 */

import { CatalogueService, CategoryMetadata } from "./types";

/**
 * Category definitions
 */
export const CATEGORIES: CategoryMetadata[] = [
  {
    id: "home-laundry",
    name: "Home & laundry",
    description: "Bring household spaces and laundry back to a ready, organized state.",
    displayOrder: 1,
  },
  {
    id: "kitchen-food",
    name: "Kitchen & food",
    description: "From meal prep to clean counters, we handle the kitchen tasks that pile up.",
    displayOrder: 2,
  },
  {
    id: "family-support",
    name: "Family support",
    description: "Parent-home child engagement that creates uninterrupted time for you.",
    displayOrder: 3,
  },
  {
    id: "flexible-support",
    name: "Flexible support",
    description: "Request support for tasks that do not fit the standard catalogue.",
    displayOrder: 4,
  },
];

/**
 * Complete service catalogue - 14 pilot services + Pre-ordered Pickup add-on
 */
export const CATALOGUE: CatalogueService[] = [
  {
    public: {
      sku: "SVC-HL-001",
      slug: "laundry-reset",
      name: "Laundry Reset",
      category: "home-laundry",
      shortDescription: "Bring a defined amount of household laundry back to a ready state.",
      detailedDescription: "We will wash, dry, fold or hang, and put away household laundry so you return to an empty hamper and clothes where they belong.",
      inclusions: [
        "Washing and drying one defined load",
        "Folding or hanging as appropriate",
        "Returning items to their usual storage locations",
        "Brief orientation to understand household systems",
      ],
      exclusions: [
        "Dry-clean-only items",
        "Delicate hand-wash items",
        "Specialty stain removal or treatments",
      ],
      customerPrerequisites: [
        "Household laundry detergent and products",
        "Access to washer and dryer",
        "Brief orientation on where items belong",
      ],
      serviceProcess: "This is a pilot service. Request through the early access form. Parentive will confirm availability and schedule your visit.",
      importantNotes: [
        "One standard load per service (approximately 8-10 lbs)",
        "Laundry should be sorted and ready",
        "A few minutes of orientation helps your Helper work independently",
      ],
      relatedServices: ["fold-and-put-away", "bed-reset"],
      requiresReview: false,
      eligibleAddOns: ["pre-ordered-pickup"],
      pricingModel: "fixed-outcome",
      displayPrice: null,
      priceStatus: "pending-validation",
      availabilityStatus: "available",
      isAddOnEligible: true,
      isFeatured: true,
      isMvpPriority: true,
      seo: {
        title: "Laundry Reset | Parentive",
        description: "Let Parentive handle your household laundry. We wash, dry, fold and put away so you return to an empty hamper.",
      },
    },
    operational: {
      estimatedActiveMinutes: 90,
      estimatedElapsedMinutes: 120,
      p50CompletionMinutes: null,
      p75CompletionMinutes: null,
      p90CompletionMinutes: null,
      loadedLabourCost: null,
      targetContributionMargin: null,
      isConcurrencyEligible: true,
      compatibleConcurrentTaskTypes: ["kitchen-reset", "playroom-reset"],
      requiredHelperCapabilities: [],
      riskClassification: "standard",
      serviceAreaConstraints: [],
      validationStatus: "in-validation",
      observationCount: 0,
    },
  },

  // Remaining Home & Laundry services would be added here
  // Kitchen & Food services would be added here  
  // Family Support services would be added here
  // Flexible Support services would be added here
  // Add-ons would be added here
];