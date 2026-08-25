/**
 * Parentive Service Catalogue Types
 *
 * This module defines the types for Parentive's service catalogue.
 * Types are separated into customer-facing (public) and operational (internal) concerns.
 */

// ============================================================================
// CUSTOMER-FACING TYPES (Public)
// ============================================================================

/**
 * Service pricing type
 */
export type PricingType = 'fixed' | 'time-based' | 'package' | 'custom-quote';

/**
 * Service pricing status
 */
export type PricingStatus =
  | 'validated'
  | 'provisional'
  | 'testing'
  | 'seasonal';

/**
 * Service availability status
 */
export type ServiceStatus =
  | 'available'
  | 'coming-soon'
  | 'seasonal'
  | 'add-on-only'
  | 'unavailable';

/**
 * Service category
 */
export type ServiceCategory =
  | 'laundry-clothing'
  | 'kitchen-food'
  | 'home-reset'
  | 'kids-parent-support'
  | 'life-outdoors'
  | 'packages';

/**
 * Customer-facing service definition
 *
 * Represents a single service or outcome available to customers.
 */
export interface Service {
  /** Unique identifier / SKU */
  id: string;

  /** Display name */
  name: string;

  /** URL-friendly slug */
  slug: string;

  /** Service category */
  category: ServiceCategory;

  /** Short description (1-2 sentences) */
  shortDescription: string;

  /** Detailed description with full context */
  detailedDescription: string;

  /** What's included in this service */
  inclusions: string[];

  /** What's explicitly not included */
  exclusions: string[];

  /** Prerequisites or requirements for customers */
  customerPrerequisites?: string[];

  /** Pricing type */
  pricingType: PricingType;

  /** Price in cents (for fixed pricing) */
  price?: number;

  /** Pricing label for display (e.g., "$49", "Starting at $65", "Custom") */
  priceLabel: string;

  /** Pricing status */
  pricingStatus: PricingStatus;

  /** Service availability status */
  serviceStatus: ServiceStatus;

  /** Whether this can be selected as an add-on to other services */
  addOnEligible: boolean;

  /** Featured on homepage */
  featured: boolean;

  /** Marked as popular/frequently chosen */
  popular: boolean;

  /** Sort order within category */
  sortOrder: number;

  /** Optional custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Service package/bundle
 *
 * Represents a predefined combination of services offered together.
 */
export interface ServicePackage {
  /** Unique identifier */
  id: string;

  /** Package name */
  name: string;

  /** URL-friendly slug */
  slug: string;

  /** Short description */
  shortDescription: string;

  /** Detailed description */
  detailedDescription: string;

  /** Service IDs included in this package */
  includedServiceIds: string[];

  /** Total package price in cents */
  price: number;

  /** Price label for display */
  priceLabel: string;

  /** Individual service value in cents (for showing savings) */
  regularValue?: number;

  /** Package availability status */
  status: ServiceStatus;

  /** Featured on packages page */
  featured: boolean;

  /** Sort order */
  sortOrder: number;
}

// ============================================================================
// OPERATIONAL TYPES (Internal - Not exposed to customers)
// ============================================================================

/**
 * Concurrency eligibility for service scheduling
 */
export type ConcurrencyEligibility =
  | 'fully-concurrent'
  | 'partially-concurrent'
  | 'sequential-only';

/**
 * Risk classification for helper matching and insurance
 */
export type RiskClassification = 'low' | 'medium' | 'high' | 'supervision-required';

/**
 * Operational service metadata
 *
 * Internal fields for scheduling, pricing, and operational planning.
 * These fields are NEVER exposed in customer-facing interfaces.
 */
export interface ServiceOperationalMetadata {
  /** Service ID reference */
  serviceId: string;

  /** Expected active working minutes */
  expectedActiveMinutes: number;

  /** Expected total elapsed minutes (including breaks, transitions) */
  expectedElapsedMinutes: number;

  /** P50 duration in minutes (median observed) */
  p50Minutes?: number;

  /** P75 duration in minutes */
  p75Minutes?: number;

  /** P90 duration in minutes */
  p90Minutes?: number;

  /** Loaded labour cost in cents */
  loadedLabourCost: number;

  /** Target contribution margin (percentage) */
  targetContributionMargin: number;

  /** Whether this service can be performed concurrently with others */
  concurrencyEligibility: ConcurrencyEligibility;

  /** Required helper capabilities/certifications */
  helperCapabilityRequirements: string[];

  /** Risk classification */
  riskClassification: RiskClassification;

  /** Geographic restrictions (postal code prefixes, city names, etc.) */
  geographicRestrictions?: string[];

  /** Additional internal notes */
  internalNotes?: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Service selection for booking
 */
export interface ServiceSelection {
  serviceId: string;
  quantity?: number;
  notes?: string;
}

/**
 * Service with operational data joined (for internal dashboards)
 */
export interface ServiceWithOperationalData extends Service {
  operational?: ServiceOperationalMetadata;
}
