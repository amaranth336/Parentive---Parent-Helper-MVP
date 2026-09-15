/**
 * Parentive Service Catalogue Types
 *
 * Defines the structure for the centralized service catalogue,
 * separating customer-facing content from internal operational metadata.
 */

export type ServiceCategory =
  | 'home-laundry'
  | 'kitchen-food'
  | 'family-support'
  | 'flexible-support';

export type PricingModel =
  | 'fixed-outcome'
  | 'starting-from'
  | 'time-block-based'
  | 'request-quote'
  | 'pricing-pending';

export type PriceStatus =
  | 'confirmed'
  | 'pending-validation'
  | 'under-review'
  | 'seasonal';

export type AvailabilityStatus =
  | 'available'
  | 'coming-soon'
  | 'add-on'
  | 'seasonal'
  | 'validation';

export type RiskClassification =
  | 'standard'
  | 'elevated'
  | 'requires-screening'
  | null;

export type ValidationStatus =
  | 'not-validated'
  | 'in-validation'
  | 'validated'
  | 'requires-revision';

/**
 * Customer-facing service content
 */
export interface ServicePublicContent {
  /** Unique SKU/identifier */
  sku: string;

  /** URL-friendly slug */
  slug: string;

  /** Display name */
  name: string;

  /** Service category */
  category: ServiceCategory;

  /** Brief one-line description */
  shortDescription: string;

  /** Detailed outcome-oriented description */
  detailedDescription: string;

  /** What this service can include */
  inclusions: string[];

  /** What's explicitly not included */
  exclusions: string[];

  /** What the household needs to prepare/provide */
  customerPrerequisites: string[];

  /** What to expect from the request process */
  serviceProcess: string;

  /** Good to know — boundaries, safety, pilot notes */
  importantNotes: string[];

  /** Related service slugs that complement this service */
  relatedServices: string[];

  /** Whether this service requires individual review */
  requiresReview: boolean;

  /** Eligible add-on identifiers */
  eligibleAddOns: string[];

  /** Pricing model type */
  pricingModel: PricingModel;

  /** Display price (null if pending validation) */
  displayPrice: string | null;

  /** Price status */
  priceStatus: PriceStatus;

  /** Service availability */
  availabilityStatus: AvailabilityStatus;

  /** Can this be added to another service? */
  isAddOnEligible: boolean;

  /** Should this be featured prominently? */
  isFeatured: boolean;

  /** Is this an MVP validation priority? */
  isMvpPriority: boolean;

  /** Optional icon/image reference */
  iconRef?: string;

  /** SEO metadata */
  seo: {
    title: string;
    description: string;
  };
}

/**
 * Internal operational metadata
 *
 * Separate from public content to support future operational
 * pricing, scheduling, and capability matching.
 */
export interface ServiceOperationalMetadata {
  /** Estimated active working minutes */
  estimatedActiveMinutes: number | null;

  /** Estimated elapsed time including transitions */
  estimatedElapsedMinutes: number | null;

  /** 50th percentile completion time from validation data */
  p50CompletionMinutes: number | null;

  /** 75th percentile completion time */
  p75CompletionMinutes: number | null;

  /** 90th percentile completion time */
  p90CompletionMinutes: number | null;

  /** Loaded labour cost (includes overhead, benefits, etc) */
  loadedLabourCost: number | null;

  /** Target contribution margin percentage */
  targetContributionMargin: number | null;

  /** Can this service be performed concurrently with others? */
  isConcurrencyEligible: boolean;

  /** Service types that can be performed concurrently */
  compatibleConcurrentTaskTypes: string[];

  /** Required helper capabilities/certifications */
  requiredHelperCapabilities: string[];

  /** Risk classification for screening/insurance */
  riskClassification: RiskClassification;

  /** Geographic or service-area constraints */
  serviceAreaConstraints: string[];

  /** Validation status */
  validationStatus: ValidationStatus;

  /** Number of real-world observations recorded */
  observationCount: number;
}

/**
 * Complete service definition combining public and operational data
 */
export interface CatalogueService {
  public: ServicePublicContent;
  operational: ServiceOperationalMetadata;
}

/**
 * Category metadata for UI organization
 */
export interface CategoryMetadata {
  id: ServiceCategory;
  name: string;
  description: string;
  displayOrder: number;
}
