/**
 * Parentive Pricing Architecture Types
 * 
 * Defines pricing models, recurring support, and commercial rules
 * separate from final dollar pricing.
 */

/**
 * Recurring frequency options
 */
export type RecurringFrequency =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'ad-hoc';

/**
 * Pricing tier for founding customer / standard rates
 */
export type PricingTier =
  | 'founding'
  | 'standard'
  | 'tbd';

/**
 * Time-based service configuration
 */
export interface TimeBasedConfig {
  /** Minimum customer-facing service duration in minutes */
  minimumMinutes: number;
  
  /** Increment size in minutes for additional time */
  incrementMinutes: number;
  
  /** Whether additional time can be added */
  allowAdditionalTime: boolean;
}

/**
 * Outcome-based service configuration
 */
export interface OutcomeBasedConfig {
  /** Expected completion time range (internal planning) */
  expectedMinutes: {
    min: number;
    max: number;
  } | null;
  
  /** Whether scope includes built-in orientation buffer */
  includesOrientation: boolean;
}

/**
 * Pricing display state
 */
export interface PricingDisplay {
  /** Pricing tier */
  tier: PricingTier;
  
  /** Display text (e.g., "TBD", "Starting from...", or null for confirmed pricing) */
  displayText: string | null;
  
  /** Whether to show "+ applicable tax" */
  showTaxNote: boolean;
}

/**
 * Recurring support configuration
 */
export interface RecurringSupportConfig {
  /** Is this service eligible for recurring booking? */
  isRecurringEligible: boolean;
  
  /** Supported frequencies */
  supportedFrequencies: RecurringFrequency[];
  
  /** Whether recurring discount is available (exact % TBD) */
  hasRecurringDiscount: boolean;
}

/**
 * Cancellation policy
 */
export interface CancellationPolicy {
  /** Hours before visit for free cancellation */
  freeRescheduleBefore: number;
  
  /** Late cancellation fee equals minimum visit charge */
  lateCancellationFeeNote: string;
  
  /** No-show policy note */
  noShowPolicyNote: string;
}

/**
 * Internal pilot economics (not customer-facing)
 */
export interface PilotEconomics {
  /** Base Helper wage per hour */
  baseHelperWagePerHour: number;
  
  /** Minimum paid Helper hours per visit/assignment */
  minimumHelperHours: number;
  
  /** Estimated practical break-even floor pre-tax */
  estimatedBreakEven: number;
  
  /** Notes about orientation buffer included in planning */
  orientationBufferMinutes: number;
}

/**
 * Commercial rules and constraints
 */
export interface CommercialRules {
  /** Pilot validation period in days */
  pilotValidationPeriod: number;
  
  /** Pilot economics (internal only) */
  pilotEconomics: PilotEconomics;
  
  /** Default cancellation policy */
  cancellationPolicy: CancellationPolicy;
  
  /** Payment timing rules */
  paymentTiming: {
    pilotDueHours: number;
    futureModel: string;
  };
  
  /** Travel policy notes */
  travelPolicy: string;
  
  /** Tipping policy */
  tippingPolicy: string;
  
  /** Tax treatment */
  taxTreatment: string;
}
