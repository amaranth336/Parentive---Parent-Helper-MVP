/**
 * Parentive Service Catalogue Data
 *
 * Centralized source of truth for the 14-service pilot catalogue.
 * Customer-facing copy is outcome-first. Internal economics stay in operational fields.
 */

import {
  CatalogueService,
  CategoryMetadata,
  ServiceOperationalMetadata,
  ServicePublicContent,
} from './types';

export const FOOD_SERVICE_SLUGS = [
  'kitchen-reset',
  'dinner-prep',
  'tomorrows-lunches',
  'meal-prep-reset',
  'produce-snack-prep',
] as const;

export const CHILD_SUPPORT_SERVICE_SLUGS = [
  'uninterrupted-hour',
  'parents-helper-visit',
] as const;

export const FLEXIBLE_SUPPORT_SLUG = 'flexible-support-request';

export const PREORDERED_PICKUP_ADDON = 'pre-ordered-pickup';

export const CATEGORIES: CategoryMetadata[] = [
  {
    id: 'home-laundry',
    name: 'Home & laundry',
    description: 'Keep everyday spaces and laundry moving toward a ready state.',
    displayOrder: 1,
  },
  {
    id: 'kitchen-food',
    name: 'Kitchen & food',
    description: 'Take some of the preparation and kitchen reset work off your day.',
    displayOrder: 2,
  },
  {
    id: 'family-support',
    name: 'Family support',
    description:
      'Active parent-home child support while you remain on the premises.',
    displayOrder: 3,
  },
  {
    id: 'flexible-support',
    name: 'Flexible support',
    description: 'Have something else on your list? Tell us what would help.',
    displayOrder: 4,
  },
];

const PILOT_PROCESS =
  'Parentive is preparing for pilot launch and is not yet accepting confirmed bookings. Submit a support request so we can understand what you need. When bookings open, Parentive will review the request and confirm details before a Helper visit.';

function operational(
  overrides: Partial<ServiceOperationalMetadata> = {}
): ServiceOperationalMetadata {
  return {
    estimatedActiveMinutes: null,
    estimatedElapsedMinutes: null,
    p50CompletionMinutes: null,
    p75CompletionMinutes: null,
    p90CompletionMinutes: null,
    loadedLabourCost: null,
    targetContributionMargin: null,
    isConcurrencyEligible: true,
    compatibleConcurrentTaskTypes: [],
    requiredHelperCapabilities: [],
    riskClassification: 'standard',
    serviceAreaConstraints: [],
    validationStatus: 'in-validation',
    observationCount: 0,
    ...overrides,
  };
}

function service(
  publicContent: ServicePublicContent,
  ops?: Partial<ServiceOperationalMetadata>
): CatalogueService {
  return {
    public: publicContent,
    operational: operational(ops),
  };
}

const pendingOutcome = {
  pricingModel: 'fixed-outcome' as const,
  displayPrice: null,
  priceStatus: 'pending-validation' as const,
  availabilityStatus: 'coming-soon' as const,
};

export const CATALOGUE: CatalogueService[] = [
  service(
    {
      sku: 'SVC-HL-001',
      slug: 'laundry-reset',
      name: 'Laundry Reset',
      category: 'home-laundry',
      shortDescription: 'Get a load washed, dried and ready for what comes next.',
      detailedDescription:
        'A defined amount of household laundry is washed, dried, and left ready for the next step — folded, hung, or staged according to how your household works.',
      inclusions: [
        'Washing and drying a defined load of everyday laundry',
        'Folding or hanging as appropriate for the items',
        'Returning items to a ready state, including putting away when orientation is provided',
        'A few minutes of household orientation at the start',
      ],
      exclusions: [
        'Dry-clean-only items',
        'Delicate hand-wash items',
        'Specialty stain treatments or alterations',
      ],
      customerPrerequisites: [
        'Laundry detergent and usual household laundry products',
        'Access to the washer and dryer',
        'A brief orientation on where finished laundry belongs',
      ],
      serviceProcess: PILOT_PROCESS,
      importantNotes: [
        'Households provide normal supplies during the pilot.',
        'A few minutes of orientation at the start helps your Helper work independently for the rest of the task.',
        'This is an outcome-based service. Pilot pricing is being finalized before bookings open.',
      ],
      relatedServices: ['fold-and-put-away', 'bed-reset'],
      requiresReview: false,
      eligibleAddOns: [PREORDERED_PICKUP_ADDON],
      ...pendingOutcome,
      isAddOnEligible: true,
      isFeatured: true,
      isMvpPriority: true,
      seo: {
        title: 'Laundry Reset',
        description:
          'Get a load washed, dried and ready for what comes next with Parentive household support.',
      },
    },
    { isConcurrencyEligible: true, compatibleConcurrentTaskTypes: ['kitchen-reset', 'playroom-reset'] }
  ),
  service({
    sku: 'SVC-HL-002',
    slug: 'fold-and-put-away',
    name: 'Fold & Put Away',
    category: 'home-laundry',
    shortDescription: 'Get clean laundry folded and returned where it belongs.',
    detailedDescription:
      'Clean laundry is folded or hung and returned to its usual household storage, clearing the pile that has been waiting.',
    inclusions: [
      'Folding or hanging clean, dry laundry',
      'Returning items to designated storage',
      'A brief orientation on where items belong',
    ],
    exclusions: ['Washing or drying', 'Ironing or steaming', 'Sorting mixed unsorted laundry from scratch'],
    customerPrerequisites: [
      'Clean laundry ready to fold',
      'A brief orientation on where items belong',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'Laundry should already be clean and dry.',
      'Households provide usual storage space and a short orientation.',
    ],
    relatedServices: ['laundry-reset', 'bed-reset'],
    requiresReview: false,
    eligibleAddOns: [],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: false,
    isMvpPriority: true,
    seo: {
      title: 'Fold & Put Away',
      description:
        'Get clean laundry folded and returned where it belongs with Parentive household support.',
    },
  }),
  service({
    sku: 'SVC-HL-003',
    slug: 'bed-reset',
    name: 'Bed Reset',
    category: 'home-laundry',
    shortDescription: 'Fresh sheets and a bed ready to settle into.',
    detailedDescription:
      'Beds are stripped and remade, and the immediate sleeping space is returned to a ready state.',
    inclusions: [
      'Stripping and remaking beds with household linens',
      'Resetting the immediate bedside space',
      'Starting or finishing related linen laundry when it fits the visit',
    ],
    exclusions: ['Mattress treatments', 'Deep cleaning under furniture', 'Window or carpet cleaning'],
    customerPrerequisites: [
      'Clean sheets and household linens available, or laundry access if linens are being reset during the visit',
      'A brief orientation on household bed-making preferences',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'This is a bed and immediate-space reset, not a whole-home clean.',
      'Light cleaning incidental to the reset may be included.',
    ],
    relatedServices: ['laundry-reset', 'fold-and-put-away'],
    requiresReview: false,
    eligibleAddOns: [],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: false,
    isMvpPriority: true,
    seo: {
      title: 'Bed Reset',
      description: 'Fresh sheets and a bed ready to settle into, with Parentive household support.',
    },
  }),
  service({
    sku: 'SVC-HL-004',
    slug: 'playroom-reset',
    name: 'Playroom Reset',
    category: 'home-laundry',
    shortDescription: 'Restore the play space to a ready-to-use state.',
    detailedDescription:
      'Toys and play materials are returned to an organized, usable state so the play space is ready again.',
    inclusions: [
      'Returning toys and play materials to their usual places',
      'Light tidying of the play space',
      'A brief orientation on household organization systems',
    ],
    exclusions: ['Deep cleaning', 'Building or assembling furniture', 'Discarding items without instruction'],
    customerPrerequisites: [
      'A brief orientation on where toys and materials belong',
      'Household storage and organization supplies already in the home',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'This is a reset to ready — not a redesign of the room.',
      'Combines well with family-support services when a parent or caregiver is home.',
    ],
    relatedServices: ['family-room-reset', 'parents-helper-visit'],
    requiresReview: false,
    eligibleAddOns: [],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: false,
    isMvpPriority: true,
    seo: {
      title: 'Playroom Reset',
      description: 'Restore the play space to a ready-to-use state with Parentive household support.',
    },
  }),
  service({
    sku: 'SVC-HL-005',
    slug: 'family-room-reset',
    name: 'Family Room Reset',
    category: 'home-laundry',
    shortDescription: 'Bring an everyday living space back to ready.',
    detailedDescription:
      'The primary shared living area is reset within Parentive’s light-cleaning and household-reset scope, so the space is ready to use again.',
    inclusions: [
      'Returning everyday items to their usual places',
      'Light tidying and surface wipe-downs associated with the reset',
      'A brief orientation on household preferences',
    ],
    exclusions: [
      'Deep cleaning',
      'Carpet cleaning',
      'Window cleaning',
      'Bathroom or whole-home cleaning',
    ],
    customerPrerequisites: [
      'Usual household cleaning products',
      'A brief orientation on where items belong',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'Parentive provides light cleaning and household resets, not residential deep cleaning.',
      'If a request is better suited to a cleaning provider, Parentive can help you recognize that during review.',
    ],
    relatedServices: ['playroom-reset', 'kitchen-reset'],
    requiresReview: false,
    eligibleAddOns: [],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: false,
    isMvpPriority: true,
    seo: {
      title: 'Family Room Reset',
      description: 'Bring an everyday living space back to ready with Parentive household support.',
    },
  }),
  service({
    sku: 'SVC-HL-006',
    slug: 'baby-gear-reset',
    name: 'Baby Gear Reset',
    category: 'home-laundry',
    shortDescription: 'Refresh and organize the everyday gear that keeps baby life moving.',
    detailedDescription:
      'Everyday baby gear and supplies are cleaned, reset, and organized within defined safety boundaries so the next stretch of baby life is easier to start.',
    inclusions: [
      'Bottle and pump-part cleanup using household equipment',
      'High-chair cleanup',
      'Stroller surface cleanup',
      'Diaper-station restocking, cleaning, or disinfecting',
      'Toy and baby-item organization',
      'Everyday feeding-item and supply reset',
    ],
    exclusions: [
      'Car-seat installation or adjustment',
      'Installing or dismantling child-restraint systems',
      'Repairing baby equipment',
      'Specialized sterilization requiring expertise',
      'Assessing or certifying equipment safety',
    ],
    customerPrerequisites: [
      'Household cleaning products and any usual sterilizing equipment',
      'A brief orientation on where gear and supplies belong',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'Parentive does not take responsibility for specialist safety-equipment installation or compliance.',
      'This service is a practical reset of everyday gear, not equipment certification.',
    ],
    relatedServices: ['parents-helper-visit', 'playroom-reset'],
    requiresReview: false,
    eligibleAddOns: [],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: false,
    isMvpPriority: true,
    seo: {
      title: 'Baby Gear Reset',
      description:
        'Refresh and organize the everyday gear that keeps baby life moving, with Parentive household support.',
    },
  }),
  service({
    sku: 'SVC-KF-001',
    slug: 'kitchen-reset',
    name: 'Kitchen Reset',
    category: 'kitchen-food',
    shortDescription:
      'Bring the kitchen back to a clean, usable ready-state after everyday life.',
    detailedDescription:
      'The everyday kitchen area is returned to a clean, usable, ready state within Parentive’s light-cleaning scope — counters, dishes associated with the reset, and the surfaces needed to cook or prepare food again.',
    inclusions: [
      'Clearing and wiping counters associated with the reset',
      'Dishes and immediate workspace cleanup',
      'Light tidying to a usable ready-state',
      'A brief kitchen orientation',
    ],
    exclusions: [
      'Oven cleaning',
      'Deep cleaning',
      'Bathroom cleaning',
      'Mould, biohazard, or pest-related cleanup',
    ],
    customerPrerequisites: [
      'Household cleaning products, dish soap, and garbage or recycling bags',
      'A brief orientation on kitchen layout and preferences',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'This is a kitchen reset, not a deep-clean service.',
      'Allergy and dietary information should be shared if food handling is also requested.',
    ],
    relatedServices: ['dinner-prep', 'produce-snack-prep'],
    requiresReview: false,
    eligibleAddOns: [PREORDERED_PICKUP_ADDON],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: true,
    isMvpPriority: true,
    seo: {
      title: 'Kitchen Reset',
      description:
        'Bring the kitchen back to a clean, usable ready-state after everyday life with Parentive.',
    },
  }),
  service({
    sku: 'SVC-KF-002',
    slug: 'dinner-prep',
    name: 'Dinner Prep',
    category: 'kitchen-food',
    shortDescription: 'Prepare a planned meal or components so dinner is easier when you need it.',
    detailedDescription:
      'One planned meal or its defined components is prepared so dinner is easier to finish or serve when you need it.',
    inclusions: [
      'Preparing one specified meal or defined meal components',
      'Using household ingredients, cookware, and recipes as provided',
      'Kitchen cleanup associated with the preparation',
      'Recipe review during scheduling when a specific recipe is required',
    ],
    exclusions: [
      'Creating a weekly meal plan',
      'Independently selecting household recipes',
      'Determining nutritional plans',
    ],
    customerPrerequisites: [
      'Ingredients, cookware, utensils, and storage containers',
      'A recipe or clear description of the planned meal, shared in advance when the preparation reasonably requires one',
      'Relevant allergy or dietary information',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'If a specific recipe is needed, please provide it at least 24 hours before a confirmed visit so Parentive can review the preparation.',
      'Meal-plan creation is not included in the pilot.',
      'Helpers wash hands on entry and clean food-preparation surfaces after handling food.',
    ],
    relatedServices: ['produce-snack-prep', 'kitchen-reset'],
    requiresReview: true,
    eligibleAddOns: [PREORDERED_PICKUP_ADDON],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: true,
    isMvpPriority: true,
    seo: {
      title: 'Dinner Prep',
      description:
        'Prepare a planned meal or components so dinner is easier when you need it, with Parentive kitchen support.',
    },
  }),
  service({
    sku: 'SVC-KF-003',
    slug: 'tomorrows-lunches',
    name: 'Tomorrow’s Lunches',
    category: 'kitchen-food',
    shortDescription: 'Prepare and package specified lunches and snacks for the next day.',
    detailedDescription:
      'Specified lunches and snacks for the following day are prepared and packaged using household ingredients and containers.',
    inclusions: [
      'Preparing household-specified lunches and snacks',
      'Packaging in household containers',
      'Cleanup associated with the food task',
    ],
    exclusions: ['Creating a meal plan', 'Independently choosing lunch menus', 'Shopping for missing ingredients unless Pre-ordered Pickup is approved'],
    customerPrerequisites: [
      'Ingredients, containers, and a clear list of what should be packed',
      'Relevant allergy or dietary information',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'Please specify what should be packed. Parentive prepares what you have planned rather than inventing a menu.',
      'Allergy and cross-contamination information should be disclosed with the request.',
    ],
    relatedServices: ['produce-snack-prep', 'meal-prep-reset'],
    requiresReview: true,
    eligibleAddOns: [PREORDERED_PICKUP_ADDON],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: false,
    isMvpPriority: true,
    seo: {
      title: 'Tomorrow’s Lunches',
      description:
        'Prepare and package specified lunches and snacks for the next day with Parentive kitchen support.',
    },
  }),
  service({
    sku: 'SVC-KF-004',
    slug: 'meal-prep-reset',
    name: 'Meal Prep Reset',
    category: 'kitchen-food',
    shortDescription: 'Batch-prep defined meals or components for the days ahead.',
    detailedDescription:
      'Multiple specified meals or meal components are prepared for later use, based on household instructions and recipes.',
    inclusions: [
      'Batch preparation of specified meals or components',
      'Portioning and storing using household containers',
      'Cleanup associated with the preparation',
    ],
    exclusions: [
      'Designing weekly meal plans',
      'Independently selecting recipes',
      'Nutritional planning',
    ],
    customerPrerequisites: [
      'Ingredients, cookware, and storage containers',
      'Specified meals or recipes provided in advance when reasonably required',
      'Relevant allergy or dietary information',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'Parentive executes a household-provided plan rather than creating one.',
      'Pre-ordered Pickup may be requested as an add-on when groceries are pre-paid and ready for collection.',
    ],
    relatedServices: ['dinner-prep', 'produce-snack-prep'],
    requiresReview: true,
    eligibleAddOns: [PREORDERED_PICKUP_ADDON],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: false,
    isMvpPriority: true,
    seo: {
      title: 'Meal Prep Reset',
      description:
        'Batch-prep defined meals or components for the days ahead with Parentive kitchen support.',
    },
  }),
  service({
    sku: 'SVC-KF-005',
    slug: 'produce-snack-prep',
    name: 'Produce & Snack Prep',
    category: 'kitchen-food',
    shortDescription: 'Wash, prepare, portion and store produce and straightforward snacks.',
    detailedDescription:
      'Produce and straightforward household snacks are washed, prepared, portioned, and stored based on household instructions.',
    inclusions: [
      'Washing, cutting, portioning, and storing produce',
      'Preparing straightforward snacks as specified',
      'Cleanup associated with the task',
    ],
    exclusions: ['Meal-plan creation', 'Independent recipe selection', 'Specialty baking'],
    customerPrerequisites: [
      'Produce, snack ingredients, and storage containers',
      'Clear instructions on how items should be prepared and stored',
      'Relevant allergy or dietary information',
    ],
    serviceProcess: PILOT_PROCESS,
    importantNotes: [
      'This service follows household instructions rather than inventing a snack plan.',
      'Please share allergy and cross-contamination considerations with the request.',
    ],
    relatedServices: ['dinner-prep', 'tomorrows-lunches'],
    requiresReview: true,
    eligibleAddOns: [PREORDERED_PICKUP_ADDON],
    ...pendingOutcome,
    isAddOnEligible: true,
    isFeatured: false,
    isMvpPriority: true,
    seo: {
      title: 'Produce & Snack Prep',
      description:
        'Wash, prepare, portion and store produce and straightforward snacks with Parentive kitchen support.',
    },
  }),
  service(
    {
      sku: 'SVC-FS-001',
      slug: 'uninterrupted-hour',
      name: 'Uninterrupted Hour',
      category: 'family-support',
      shortDescription:
        'An hour of active parent-home child support so you can focus elsewhere in the house.',
      detailedDescription:
        'A defined hour of active, age-appropriate parent-home child engagement while a parent or caregiver remains on the premises. The point is uninterrupted room — not passive supervision.',
      inclusions: [
        'Active, intentional, age-appropriate engagement',
        'Play, reading, crafts, or other activities suited to the reviewed request',
        'Clothing, changing, diapering, or toileting assistance as requested and reviewed',
        'Feeding or bottle preparation as requested and reviewed',
        'Nap support or remaining with a sleeping child as requested',
        'Homework or age-appropriate household activities',
        'Outdoor play on the household property',
      ],
      exclusions: [
        'Independent or date-night childcare',
        'Administering medication',
        'Bathing children',
        'Transporting children or taking children off the premises',
      ],
      customerPrerequisites: [
        'A parent or caregiver remaining on the premises throughout the visit',
        'Number of children and ages involved in the request',
        'A description of the support you would like',
      ],
      serviceProcess: PILOT_PROCESS,
      importantNotes: [
        'During the pilot, a parent or caregiver must remain on the premises throughout the visit.',
        'Every child-support request is reviewed individually.',
        'This remains a one-hour service. Pricing will account for Parentive’s visit economics without converting it into a longer product.',
        'Helpers assigned to child support are selected for meaningful engagement — not simply passive supervision.',
      ],
      relatedServices: ['parents-helper-visit', 'playroom-reset'],
      requiresReview: true,
      eligibleAddOns: [],
      pricingModel: 'time-block-based',
      displayPrice: null,
      priceStatus: 'pending-validation',
      availabilityStatus: 'coming-soon',
      isAddOnEligible: false,
      isFeatured: true,
      isMvpPriority: true,
      seo: {
        title: 'Uninterrupted Hour',
        description:
          'An hour of active parent-home child support so you can focus elsewhere in the house.',
      },
    },
    {
      isConcurrencyEligible: false,
      requiredHelperCapabilities: ['childcare'],
      riskClassification: 'requires-screening',
    }
  ),
  service(
    {
      sku: 'SVC-FS-002',
      slug: 'parents-helper-visit',
      name: 'Parent’s Helper Visit',
      category: 'family-support',
      shortDescription:
        'Flexible parent-home support with children while you remain on the premises.',
      detailedDescription:
        'Flexible parent-home child and family support while a parent or caregiver remains on the premises. Support is active and practical, and may sit alongside other household tasks when the request is reviewed and agreed.',
      inclusions: [
        'Active parent-home child support',
        'Flexible help with children while you stay on the premises',
        'Age-appropriate engagement, routines, and practical support as reviewed',
        'Light household support that reasonably fits the visit when requested and confirmed',
      ],
      exclusions: [
        'Independent childcare',
        'Administering medication',
        'Bathing children',
        'Transporting children or taking children off the premises',
      ],
      customerPrerequisites: [
        'A parent or caregiver remaining on the premises throughout the visit',
        'Number of children and ages involved',
        'A description of the support you would like',
      ],
      serviceProcess: PILOT_PROCESS,
      importantNotes: [
        'Customer-facing minimum is 2 hours, with additional time in 30-minute increments once bookings open.',
        'Every child-support request is reviewed individually.',
        'Parentive child support is hands-on engagement, not passive babysitting.',
      ],
      relatedServices: ['uninterrupted-hour', 'baby-gear-reset'],
      requiresReview: true,
      eligibleAddOns: [],
      pricingModel: 'time-block-based',
      displayPrice: null,
      priceStatus: 'pending-validation',
      availabilityStatus: 'coming-soon',
      isAddOnEligible: false,
      isFeatured: true,
      isMvpPriority: true,
      seo: {
        title: 'Parent’s Helper Visit',
        description:
          'Flexible parent-home support with children while you remain on the premises.',
      },
    },
    {
      isConcurrencyEligible: false,
      requiredHelperCapabilities: ['childcare'],
      riskClassification: 'requires-screening',
    }
  ),
  service({
    sku: 'SVC-FX-001',
    slug: FLEXIBLE_SUPPORT_SLUG,
    name: 'Flexible Support Request',
    category: 'flexible-support',
    shortDescription:
      'Have something else on your list? Tell us what would help and Parentive will review whether it fits.',
    detailedDescription:
      'A time-based request for household or family tasks that do not fit the defined pilot catalogue. You describe the work, the expected outcome, and any household context. Parentive reviews the request and may accept it, decline it, or accept it with a revised time estimate or service approach.',
    inclusions: [
      'Review of a custom household or family support request',
      'Practical tasks that fit Parentive’s model, geography, and safety boundaries',
      'Clear follow-up when the request can or cannot be supported',
    ],
    exclusions: [
      'Medical care or personal care requiring professional competency',
      'Medication administration',
      'Hazardous materials or biohazards',
      'Heavy lifting or moving',
      'Ladder or height work',
      'Home repairs or trades work',
      'Work requiring licences or certification',
      'Independent childcare',
      'Transportation of household members or children',
      'Pet-care services beyond incidental household interaction',
    ],
    customerPrerequisites: [
      'A clear description of the requested tasks and what finished looks like',
      'Relevant household context for accurate review',
    ],
    serviceProcess:
      'Flexible requests remain review-based. Parentive is preparing for launch and is not yet accepting confirmed bookings. Share enough detail for Parentive to assess fit, estimate time later, and follow up as the pilot takes shape.',
    importantNotes: [
      'Custom requests are not automatically accepted.',
      'Customer-facing minimum is 2 hours, with additional time in 30-minute increments once bookings open. Final duration is subject to review.',
      'Pre-ordered, pre-paid grocery or household-item pickup may be provided as an eligible add-on when it fits the visit.',
    ],
    relatedServices: ['laundry-reset', 'kitchen-reset', 'parents-helper-visit'],
    requiresReview: true,
    eligibleAddOns: [PREORDERED_PICKUP_ADDON],
    pricingModel: 'request-quote',
    displayPrice: null,
    priceStatus: 'pending-validation',
    availabilityStatus: 'coming-soon',
    isAddOnEligible: false,
    isFeatured: false,
    isMvpPriority: true,
    seo: {
      title: 'Flexible Support Request',
      description:
        'Tell Parentive what else would help. Flexible household and family support requests are reviewed for fit.',
    },
  }),
];
