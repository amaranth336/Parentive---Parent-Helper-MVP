/**
 * Parentive Pricing Architecture Data
 * 
 * Commercial rules and pricing framework (no final dollar prices).
 */

import { CommercialRules } from './types';

/**
 * Parentive commercial rules and pilot economics
 * 
 * IMPORTANT: These values are internal planning assumptions only.
 * Do NOT render wage, cost, margin, or break-even calculations publicly.
 */
export const COMMERCIAL_RULES: CommercialRules = {
  pilotValidationPeriod: 90,
  
  pilotEconomics: {
    baseHelperWagePerHour: 23,
    minimumHelperHours: 3,
    estimatedBreakEven: 90,
    orientationBufferMinutes: 15,
  },
  
  cancellationPolicy: {
    freeRescheduleBefore: 24,
    lateCancellationFeeNote: 'Late-cancellation fee will equal the finalized minimum visit charge',
    noShowPolicyNote: 'Full booked service fee applies where Parentive reserved capacity and the Helper cannot reasonably be reassigned',
  },
  
  paymentTiming: {
    pilotDueHours: 48,
    futureModel: 'Payment at booking/confirmation',
  },
  
  travelPolicy: 'Normal Helper commute within approved launch geography is included. Pre-ordered Pickup add-on uses time + km pricing (rates TBD).',
  
  tippingPolicy: 'Parentive does not solicit tips, add gratuity prompts, or process tips. Customers may independently give a cash tip to a Helper.',
  
  taxTreatment: 'Prices shown are pre-tax. Applicable tax will be added at checkout.',
};

/**
 * Founding Customer / Pilot Rate messaging
 */
export const FOUNDING_CUSTOMER_MESSAGING = {
  heading: 'Founding Customer Rate',
  description: 'Parentive is offering an introductory Founding Customer Rate during our 90-day pilot validation period. Pricing may be reviewed and adjusted following the pilot based on observed operational data. Founding pricing is not guaranteed permanently, though we may offer future loyalty benefits separately.',
  note: 'Pilot pricing allows us to validate service delivery and economics in real households before finalizing standard rates.',
};

/**
 * Minimum visit architecture messaging
 */
export const MINIMUM_VISIT_MESSAGING = {
  heading: 'Minimum Visit Charge',
  description: 'Parentive services are subject to a minimum visit charge to support Helper scheduling and capacity commitment. This minimum ensures sustainable service delivery while maintaining fair Helper compensation.',
  note: 'Final minimum visit charge amount remains to be determined and will be established during pilot validation.',
  clarification: 'The minimum visit charge does not necessarily equal three hours of customer-facing service. Some services may be shorter while still meeting Parentive minimum economic commitment.',
};

/**
 * Recurring support messaging
 */
export const RECURRING_SUPPORT_MESSAGING = {
  heading: 'Recurring Support',
  description: 'Use Parentive once, occasionally, or as part of your regular routine. Recurring visits may qualify for modest incremental savings.',
  frequencies: [
    {
      name: 'Weekly',
      description: 'Best recurring rate',
      eligible: true,
    },
    {
      name: 'Biweekly',
      description: 'Smaller recurring saving',
      eligible: true,
    },
    {
      name: 'Monthly',
      description: 'Standard rate',
      eligible: true,
    },
    {
      name: 'Ad hoc',
      description: 'Standard rate',
      eligible: false,
    },
  ],
  note: 'Exact discount percentages will be determined during pilot validation. All discounted visits must retain acceptable margin and remain above Parentive economic floor.',
};

/**
 * Service pricing principles (customer-facing)
 */
export const PRICING_PRINCIPLES = [
  {
    title: 'Clear',
    description: 'You know what you are paying for before your visit is confirmed.',
  },
  {
    title: 'Predictable',
    description: 'No surprise charges or unexpected fees.',
  },
  {
    title: 'Fair',
    description: 'Pricing reflects the value of the outcome and the Helper time.',
  },
  {
    title: 'Simple',
    description: 'Straightforward pricing without hidden calculations.',
  },
  {
    title: 'Outcome-oriented',
    description: 'Defined services are priced around the result, not just time.',
  },
];
