import {
  formatPilotCommunityList,
  PILOT_COMMUNITIES,
} from "@/lib/service-area/communities";

export const LOCKED_H1 = "Take something off your plate.";
export const LOCKED_DESCRIPTOR = "Trusted, flexible help for real life.";
export const LOCKED_BELIEF =
  "Support isn't a last resort. It's part of how modern life gets done.";
export const LOCKED_PAYOFF = "Make room for life.";

export const PARENT_HOME_REQUIRED =
  "For these visits, a parent or responsible adult remains home. This service is intended to offer flexible in home child care while the Parent is onsite but free for self-care, work or other personal time/tasks.";

export const OFFERING_NAMES = [
  "Laundry - wash, fold & put away",
  "Bedroom reset - including washing/changing bedding",
  "Playroom or family room reset",
  "Baby gear reset - clean, tidy & put away",
  "Light home organization",
  "Light cleaning - dusting, vaccuuming, wiping down surfaces",
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
    label: "How to join early access",
    variant: "primary",
  },
  {
    href: "#support",
    label: "See kinds of support",
    variant: "secondary",
  },
];

export const homepage = {
  metadata: {
    title: "Parentive — Trusted, flexible help for real life",
    description:
      "A household and parents' helper for select communities across the GTA. Take something off your plate. Join early access.",
  },
  hero: {
    kicker: LOCKED_DESCRIPTOR,
    heading: LOCKED_H1,
    support:
      "Parentive is a local household and parents' helper. A Parentive Helper comes to your home for everyday work — laundry, room resets, food prep, and parent-present support — so you can choose what comes off your plate.",
    launchLine:
      "We're preparing a pilot in select communities across the GTA. You can join the early-access list now.",
    photo: {
      alt: "Mother reading a picture book with two young children and a dog on a living room rug",
    },
    primaryCta: homepageCtas[0],
    secondaryCta: homepageCtas[1],
  },
  why: {
    id: "why",
    heading: "Everyday life takes more hands than one household always has.",
    body: "Meals, laundry, and the reset after a full day still need doing. Parentive is practical help you can plan around — not a last resort, and not a judgement on how you run your home.",
    belief: LOCKED_BELIEF,
  },
  support: {
    id: "support",
    heading: "What Parentive can take on:",
    lead: "These are our early offerings only. We'll share further service details as we expand and grow.",
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
          "Light cleaning - dusting, vaccuuming, wiping down surfaces",
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
        note: "For useful household support that doesn't match a listed offering. Parentive reviews each request and may accept, decline, or suggest a slightly modified scope. Tasks to be outlined prior to scheduled visit.",
      },
    ] satisfies readonly OfferingGroup[],
  },
  howItWorks: {
    id: "how-it-works",
    heading: "How Parentive works right now:",
    steps: [
      {
        number: "01",
        title: "Learn what we can take on",
        body: "Read the available types of support above and see whether Parentive fits your household.",
      },
      {
        number: "02",
        title: "Join the early-access list",
        body: "Interested families can add themselves to the early-access list.",
      },
      {
        number: "03",
        title: "We'll be in touch when services become available in your area",
        body: "Parentive will follow up with families in the launch communities as services become available.",
      },
    ],
  },
  supportModel: {
    id: "support-model",
    heading: "How support is structured:",
    paragraphs: [
      "Most offerings are outcome-based household tasks (a reset, a prep, laundry done).",
      "The household provides the usual supplies (laundry products, ingredients, cookware, storage, everyday task supplies).",
      "Uninterrupted Hour, Parent's Helper Visit, and time-based Flexible Support Request are time blocks, reviewed as requested.",
      "Households may use Parentive once, occasionally, or on a weekly, biweekly, or monthly rhythm. Recurring help is a normal option, incorporating Parentive into your Village.",
    ],
    cadence: "Support can be part of the routine.",
  },
  difference: {
    id: "difference",
    heading: "A different kind of household support.",
    paragraphs: [
      "Parentive sits in the everyday mix — household resets, food prep, and parent-present child care support — rather than you having to source providers for each various task.",
      "Let Parentive lighten your load.",
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
    heading: "What you can expect:",
    points: [
      "Trusted people in your home. Every Parentive Helper is fully screened via references and Vulnerable Sector Check before working with families.",
      "Capable, dependable support. Helpers are selected for reliability, judgement, attention to detail and the ability to follow through on the outcome agreed for the visit.",
      'Clear expectations, not vague help. Each visit has defined boundaries and outcomes, so you know what Parentive is taking on and what "done" should look like.',
      "Respect for your home and routines. Helpers work thoughtfully within your household, follow your preferences and communicate clearly if something needs clarification.",
      "Positive engagement with children. For parent-present support involving children, Helpers are screened for their ability to engage warmly, appropriately and actively — not simply supervise.",
    ],
    closing:
      "You're not just getting another pair of hands. You're getting support you can feel comfortable bringing into your home.",
  },
  faq: {
    id: "faq",
    heading: "Frequently asked questions",
    items: [
      {
        question: "Where is Parentive available?",
        answer: `Select communities across the GTA: ${formatPilotCommunityList(PILOT_COMMUNITIES)}.`,
      },
      {
        question: "Can I use Parentive more than once?",
        answer:
          "Yes — once, occasionally, or as a regular rhythm. Recurring help is a normal way to use the service.",
      },
      {
        question: "What if what I need isn't listed?",
        answer:
          "Flexible Support Request is reviewed. Parentive may accept, decline, or suggest a different shape.",
      },
      {
        question: "Do I need to be home?",
        answer:
          "For Uninterrupted Hour and Parent's Helper Visit, a parent or responsible adult remains home. Parentive does not offer independent or date-night childcare, and does not transport children.",
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
