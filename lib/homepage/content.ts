import {
  formatPilotCommunityList,
  PILOT_COMMUNITIES,
} from "@/lib/service-area/communities";

export const LOCKED_H1 = "Let us take something off your plate.";
export const LOCKED_DESCRIPTOR = "Trusted, flexible help for real life.";
export const LOCKED_BELIEF =
  "Reaching out for help isn't a last resort. It's how families make it through the week; and we're glad to be part of yours.";
export const LOCKED_PAYOFF = "Make room for life.";

export const PARENT_HOME_REQUIRED =
  "For these visits, you or another responsible adult stays home, close by but free. Your Helper keeps your little ones engaged while you rest, work, or take care of something just for you.";

export const OFFERING_NAMES = [
  "Laundry - wash, fold & put away",
  "Bedroom reset - including washing/changing bedding",
  "Playroom or family room reset",
  "Baby gear reset - clean, tidy & put away",
  "Light home organization",
  "Light cleaning - dusting, vacuuming, wiping down surfaces",
  "Kitchen retouch - includes tidy and dishes",
  "Kitchen reset - includes light pantry reorganization and fridge cleanout",
  "Dinner prep",
  "Tomorrow's lunches",
  "Meal prep for the week",
  "Produce & snack prep",
  "Uninterrupted hour",
  "Parent's Helper visit",
  "Flexible support request",
] as const;

export type OfferingName = (typeof OFFERING_NAMES)[number];

export type HomepageCta = {
  href: `#${string}` | "/early-access";
  label: string;
  variant: "primary" | "secondary";
};

export type OfferingGroup = {
  id: string;
  title: string;
  names: readonly OfferingName[];
  note?: string;
};

export const homepageCtas: readonly HomepageCta[] = [
  {
    href: "/early-access",
    label: "Join the early-access list",
    variant: "primary",
  },
  {
    href: "#support",
    label: "See how we can help",
    variant: "secondary",
  },
];

export const homepage = {
  metadata: {
    title: "Parentive — Trusted, flexible help for real life",
    description:
      "A household and parents' helper for select communities across the GTA. Let us take something off your plate. Join early access.",
  },
  hero: {
    kicker: LOCKED_DESCRIPTOR,
    heading: LOCKED_H1,
    support:
      "Parentive is a local team of Helpers who come to your home and lend a hand with the everyday things: laundry, room resets, food prep, and a caring presence with the kids while you're nearby. They arrive ready to help, so bringing in support never becomes one more thing on your list.",
    launchLine:
      "We're preparing a pilot in select communities across the GTA. You're welcome to join the early-access list now, and we'll let you know as soon as we're ready to help near you.",
    photo: {
      alt: "Mother reading a picture book with two young children and a dog on a living room rug",
    },
    primaryCta: homepageCtas[0],
    secondaryCta: homepageCtas[1],
  },
  why: {
    id: "why",
    heading: "Everyday life takes more hands than one household always has.",
    body: "Meals, laundry, and the reset after a long day still need doing, and you've been carrying a lot. Parentive is dependable help you can plan around. There's no judgement here, and nothing you need to have figured out first.",
    belief: LOCKED_BELIEF,
  },
  ready: {
    id: "ready",
    heading: "Skip the searching. Skip the training.",
    paragraphs: [
      "Finding someone, showing them where everything lives and explaining what and how you like things done can feel like more work than doing it yourself.",
      "Parentive Helpers arrive trained and clear on what the visit involves, so it feels like support from the very first knock on the door.",
      "Like laundry folded a certain way? No problem. Just point us in the direction of where it goes and our team will figure out the rest.",
    ],
    photo: {
      alt: "Parent and child greeting a Helper at the front door",
    },
  },
  support: {
    id: "support",
    heading: "Here's how we can lighten your load:",
    lead: "These are our first offerings. As we grow, we'll keep adding ways to help, and we'll share more as we do.",
    photo: {
      alt: "Father helping children with homework at the table while someone prepares food in the kitchen",
    },
    groups: [
      {
        id: "home-and-laundry",
        title: "Home and laundry",
        names: [
          "Laundry - wash, fold & put away",
          "Bedroom reset - including washing/changing bedding",
          "Playroom or family room reset",
          "Baby gear reset - clean, tidy & put away",
          "Light home organization",
          "Light cleaning - dusting, vacuuming, wiping down surfaces",
        ],
      },
      {
        id: "kitchen-and-food",
        title: "Kitchen and food",
        names: [
          "Kitchen retouch - includes tidy and dishes",
          "Kitchen reset - includes light pantry reorganization and fridge cleanout",
          "Dinner prep",
          "Tomorrow's lunches",
          "Meal prep for the week",
          "Produce & snack prep",
        ],
      },
      {
        id: "family-support",
        title: "Family support",
        names: ["Uninterrupted hour", "Parent's Helper visit"],
        note: PARENT_HOME_REQUIRED,
      },
      {
        id: "flexible-support",
        title: "Flexible support",
        names: ["Flexible support request"],
        note: "Need something that isn't on the list? Tell us what would help. We'll take a look and let you know if it's a good fit, or suggest a small adjustment so we can support you well. We'll agree on the tasks before your visit, so everyone knows what to expect.",
      },
    ] satisfies readonly OfferingGroup[],
  },
  howItWorks: {
    id: "how-it-works",
    heading: "How it works, for now:",
    steps: [
      {
        number: "01",
        title: "See how we can help",
        body: "Have a look at what we can take on and see if it feels like a fit for your family.",
      },
      {
        number: "02",
        title: "Join the early-access list",
        body: "Add your name whenever you're ready. It only takes a minute.",
      },
      {
        number: "03",
        title: "We'll reach out when we're ready to help near you",
        body: "As services open up in the launch communities, we'll let you know. No chasing needed.",
      },
    ],
  },
  supportModel: {
    id: "support-model",
    heading: "How it all fits together:",
    paragraphs: [
      "Most of our support is a clear job done well: a reset, a prep, laundry folded and put away.",
      "You provide the everyday supplies, like laundry and cleaning products, ingredients, cookware and storage, and we'll handle the rest.",
      "Uninterrupted Hour, Parent's Helper Visit and Flexible Support Requests are set up as blocks of time, and we'll go over each one with you.",
      "Use Parentive once, now and then, or recurring weekly, biweekly or monthly; whatever fits your life. Regular help is a perfectly normal choice, and it can become part of your Village.",
    ],
    cadence: "Support can become part of your rhythm.",
  },
  difference: {
    id: "difference",
    heading: "A different kind of household support.",
    paragraphs: [
      "Parentive covers the everyday mix: household resets, food prep, and a caring presence with the kids while you're home. You don't have to find a different person for every task.",
    ],
  },
  makeRoom: {
    id: "make-room",
    heading: LOCKED_PAYOFF,
    body: "Sometimes the useful part isn't only the finished laundry or the prepped dinner. It's the room that help creates — time together, rest, work, something of your own, or simply not doing that task yourself.",
    photo: {
      alt: "After-school moment at home: groceries on the counter, a cat nearby, while a caregiver helps children with shoes and a backpack",
    },
  },
  area: {
    id: "area",
    heading: "Select communities across the GTA",
    body: `Parentive is preparing a pilot in ${formatPilotCommunityList(PILOT_COMMUNITIES)}.`,
  },
  expect: {
    id: "expect",
    heading: "Let us lighten your load. Here's what you can expect from every Helper:",
    points: [
      "People you can trust in your home. Every Helper is carefully screened, with references and a Vulnerable Sector Check, before they ever step into a family's home.",
      "Capable and dependable. Helpers are chosen for their reliability, good judgement and eye for detail. They're meticulous, they follow through on what was agreed, and they don't need to be managed by you.",
      "Your home, your way. Helpers work thoughtfully around your routines, follow your preferences, and simply check in if they're unsure about something.",
      "Warm with little ones. For visits that include children, Helpers are screened for their ability to connect warmly and appropriately, being genuinely present rather than just keeping watch.",
      "Trained, and clear on the plan. Every Helper goes through Parentive onboarding, covering service quality, household boundaries, privacy, communication and more, before their first visit. You'll always know what to expect, and so will they.",
    ],
    closing:
      "You're not just getting another pair of hands. You're getting support you'll feel comfortable to welcome into your home.",
  },
  faq: {
    id: "faq",
    heading: "Frequently asked questions",
    contactLead: "Still wondering about something?",
    contactLinkLabel: "We'd love to hear from you.",
    contactHref: "/contact",
    items: [
      {
        question: "Where is Parentive available?",
        answer: `We're preparing a pilot in ${formatPilotCommunityList(PILOT_COMMUNITIES)}. If you're just outside those areas, you're still welcome to join the early-access list.`,
      },
      {
        question: "Who are Parentive Helpers, and how are they screened?",
        answer:
          "Parentive Helpers are members of our team, chosen for their reliability, judgement, attention to detail and respectful in-home support. Every Helper completes a Vulnerable Sector Check and Parentive onboarding before working with families. Helpers who spend time with children are also screened for their ability to connect with kids warmly and appropriately.",
      },
      {
        question: "What can a Parentive Helper actually help with?",
        answer:
          "Everyday, practical support: laundry, room resets, meal and lunch prep, light organizing, and a caring presence with your kids while you're home. Every visit has a clear plan, so you always know what your Helper is there to do, and so do they.",
      },
      {
        question: "Is Parentive a cleaning service or childcare service?",
        answer:
          "Not quite. We sit somewhere in between. We're not a cleaning company, babysitting service or nanny agency. Our Helpers take care of practical household work and support your family while you're home, within clear boundaries and expectations that keep every visit comfortable for everyone.",
      },
      {
        question: "What do I need to provide for a visit?",
        answer:
          "Just the everyday basics, like laundry products, ingredients, cookware, storage containers and household supplies. We'll let you know what's needed before each visit, so nothing is a surprise.",
      },
      {
        question: "What happens if I need something that isn't listed?",
        answer:
          "Send us a Flexible Support Request and tell us what would help lighten your load. We'll take a look and let you know if it's a good fit, or suggest another approach that might work better for you.",
      },
      {
        question: "How does pricing work?",
        answer:
          "We're still finalizing our pricing, and we'll share it before we launch so there are no surprises.",
      },
    ],
  },
};

export function flattenHomepageText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(flattenHomepageText).join("\n");
  }

  if (value && typeof value === "object") {
    return Object.values(value).map(flattenHomepageText).join("\n");
  }

  return "";
}
