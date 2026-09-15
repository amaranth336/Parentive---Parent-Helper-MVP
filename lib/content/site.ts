/**
 * Shared customer-facing copy for Parentive V2.
 * Keep route pages consuming this module rather than inventing parallel narratives.
 */

export const BRAND = {
  name: 'Parentive',
  proposition: 'Take something off your plate.',
  descriptor: 'Trusted, flexible help for real life.',
  belief: 'Support isn’t a last resort. It’s part of how modern life gets done.',
  payoff: 'Make room for life.',
  customerCta: 'Take it off my plate',
  servicesCta: 'See services',
  recruitmentCta: 'Join the Hive',
} as const;

export const SERVICE_AREA_LINE =
  'Now preparing to serve select communities across the GTA, including East Gwillimbury, Newmarket, Aurora, Georgina and Whitchurch-Stouffville.';

export const SERVICE_AREA_COMMUNITIES = [
  'East Gwillimbury',
  'Newmarket',
  'Aurora',
  'Georgina',
  'Whitchurch-Stouffville',
] as const;

export const PRELAUNCH_STATUS =
  'Parentive is preparing for pilot launch and is not yet accepting confirmed bookings.';

export const PRIMARY_NAV = [
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/helpers', label: 'Join the Hive' },
] as const;

export const HOMEPAGE_FAMILIES = [
  {
    id: 'home-laundry',
    href: '/services#home-laundry',
    name: 'Home & laundry',
    description: 'Keep everyday spaces and routines moving.',
  },
  {
    id: 'kitchen-food',
    href: '/services#kitchen-food',
    name: 'Kitchen & food',
    description: 'Take some of the preparation off your day.',
  },
  {
    id: 'family-support',
    href: '/services#family-support',
    name: 'Family support',
    description: 'Create a little uninterrupted room while you stay close by.',
  },
  {
    id: 'flexible-support',
    href: '/services#flexible-support',
    name: 'Flexible support',
    description: 'Have something else on your list? Tell us what would help.',
  },
] as const;

export const HOW_IT_WORKS_PREVIEW = [
  {
    title: 'Choose your support',
    description:
      'Select one service, combine several, or tell Parentive what else would help.',
  },
  {
    title: 'Tell us what you need',
    description:
      'Share timing and household details needed to understand the request.',
  },
  {
    title: 'Parentive reviews it',
    description: 'Parentive checks scope, timing and fit.',
  },
  {
    title: 'Confirm your visit',
    description:
      'Once bookings open, Parentive confirms the details before the Helper arrives.',
  },
] as const;

export const HOW_IT_WORKS_LIFECYCLE = [
  {
    title: 'Choose your support',
    description:
      'Browse the Parentive catalogue, combine services, or submit a Flexible Support Request. You can choose one thing or several for the same visit.',
  },
  {
    title: 'Tell us about your household',
    description:
      'Share the support you’re looking for, preferred timing, and the household context Parentive needs to understand the request — including child-support or allergy details where they apply.',
  },
  {
    title: 'Parentive reviews your request',
    description:
      'Parentive reviews scope, service fit, expected duration, Helper suitability, and any adjustments that may be needed.',
  },
  {
    title: 'We confirm your visit',
    description:
      'Once bookings open, you’ll receive confirmed scope, timing, price, and any relevant preparation notes before a Helper arrives. Submissions today collect early-access interest — they are not confirmed bookings.',
  },
  {
    title: 'Your Helper completes the support',
    description:
      'Your Helper arrives, completes a brief household orientation, carries out the agreed support, and finishes with an appropriate handoff.',
  },
] as const;

export const RECURRING_RHYTHMS = [
  {
    name: 'Weekly',
    description: 'An extra pair of hands as part of the regular week.',
  },
  {
    name: 'Biweekly',
    description: 'A steady reset every couple of weeks.',
  },
  {
    name: 'Monthly',
    description: 'Support on a monthly cadence when that rhythm fits.',
  },
  {
    name: 'Occasional',
    description: 'Help only when life calls for it.',
  },
] as const;

export const DIFFERENTIATION = [
  {
    name: 'House cleaning',
    description:
      'Primarily focused on cleaning the home. Parentive may include light cleaning as part of completing a task or reset, but it is not a traditional residential cleaning service.',
  },
  {
    name: 'Nannies & babysitters',
    description:
      'Primarily focused on childcare. Parentive can provide parent-home child support during pilot alongside practical household help. A parent or caregiver remains on premises.',
  },
  {
    name: 'Task marketplaces',
    description:
      'Primarily connect customers with individual providers. Parentive defines services, coordinates the experience and sets standards.',
  },
  {
    name: 'Parentive',
    description:
      'Flexible support around the real mix of tasks family life creates.',
  },
] as const;

export const FAQS = [
  {
    question: 'What can Parentive help with?',
    answer:
      'Parentive offers practical household and family support across home and laundry, kitchen and food, parent-home child support, and flexible requests. You can choose one service or combine several into the same visit.',
  },
  {
    question: 'Is Parentive a cleaning service or childcare service?',
    answer:
      'Neither exclusively. Parentive is designed for the space between traditional service categories. Helpers can support household tasks, meal preparation and parent-home child support within the Parentive service catalogue. Deep cleaning and independent childcare are not part of the pilot.',
  },
  {
    question: 'Do I need to be home?',
    answer:
      'For household-only services, final access requirements will be confirmed as Parentive prepares for launch. For any child-support service during the pilot, a parent or caregiver must remain on the premises throughout the visit.',
  },
  {
    question: 'Can I request help regularly?',
    answer:
      'Yes. Parentive is being designed for weekly, biweekly, monthly and occasional support.',
  },
  {
    question: 'Where will Parentive be available?',
    answer:
      'Parentive is preparing to launch in select GTA communities, including East Gwillimbury, Newmarket, Aurora, Georgina and Whitchurch-Stouffville.',
  },
] as const;

export const DEFAULT_METADATA = {
  title: {
    default: 'Parentive — Take something off your plate',
    template: '%s — Parentive',
  },
  description:
    'Trusted, flexible help for real life. Parentive provides practical household and family support — from laundry and meal prep to parent-home child support.',
  openGraphTitle: 'Parentive — Take something off your plate',
  openGraphDescription:
    'Practical household and family support for modern life. Take something off your plate.',
} as const;
