import { EARLY_ACCESS_PATH } from "@/lib/early-access/copy";
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
  "For these visits, a parent or responsible adult remains home. This is not babysitting, date-night care, or independent childcare, and Parentive does not transport children.";

export const OFFERING_NAMES = [
  "Laundry Reset",
  "Fold & Put Away",
  "Bed Reset",
  "Playroom Reset",
  "Family Room Reset",
  "Baby Gear Reset",
  "Kitchen Reset",
  "Dinner Prep",
  "Tomorrow's Lunches",
  "Meal Prep Reset",
  "Produce & Snack Prep",
  "Uninterrupted Hour",
  "Parent's Helper Visit",
  "Flexible Support Request",
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
      alt: "Temporary placeholder for a household-help photograph",
      caption: "Photography placeholder — household help, composition only.",
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
    heading: "What Parentive can take on",
    lead: "These are the pilot offerings. We'll share fuller service detail as the site grows.",
    groups: [
      {
        id: "home-and-laundry",
        title: "Home and laundry",
        names: [
          "Laundry Reset",
          "Fold & Put Away",
          "Bed Reset",
          "Playroom Reset",
          "Family Room Reset",
          "Baby Gear Reset",
        ],
      },
      {
        id: "kitchen-and-food",
        title: "Kitchen and food",
        names: [
          "Kitchen Reset",
          "Dinner Prep",
          "Tomorrow's Lunches",
          "Meal Prep Reset",
          "Produce & Snack Prep",
        ],
      },
      {
        id: "family-support",
        title: "Family support",
        names: ["Uninterrupted Hour", "Parent's Helper Visit"],
        note: PARENT_HOME_REQUIRED,
      },
      {
        id: "flexible-support",
        title: "Flexible support",
        names: ["Flexible Support Request"],
        note: "For useful household help that doesn't match a listed offering. Parentive reviews each request and may accept, decline, or suggest a different shape. It is not a promise to do anything asked.",
      },
    ] satisfies readonly OfferingGroup[],
  },
  howItWorks: {
    id: "how-it-works",
    heading: "How Parentive works right now",
    steps: [
      {
        title: "Learn what we can take on",
        body: "Read the kinds of support above and see whether Parentive fits your household.",
      },
      {
        title: "Join the early-access list",
        body: "Interested families can add themselves to the early-access list. The list is open.",
      },
      {
        title: "We'll be in touch as the pilot begins",
        body: "Parentive will follow up with families in the launch communities as the pilot is ready. Visits are not booked from this page.",
      },
    ],
  },
  supportModel: {
    id: "support-model",
    heading: "How support is structured",
    paragraphs: [
      "Most offerings are outcome-based household tasks (a reset, a prep, a finished load).",
      "Uninterrupted Hour, Parent's Helper Visit, and time-based Flexible Support Request are time blocks, reviewed as needed.",
      "Households may use Parentive once, occasionally, or on a weekly, biweekly, or monthly rhythm. Recurring help is a normal option, not a sign something is wrong.",
      "The household provides the usual supplies (laundry products, ingredients, cookware, storage, everyday task supplies).",
      "Customer pricing is not published yet.",
    ],
    cadence: "Support can be part of the routine.",
  },
  difference: {
    id: "difference",
    heading: "A different kind of household support",
    paragraphs: [
      "Parentive sits in the everyday mix — household resets, food prep, and parent-present help — rather than asking you to hire a cleaner for one kind of task, a sitter for another, or to coordinate a marketplace yourself.",
      "Parentive is not a cleaning company, a babysitting service, a nanny agency, or software for tracking family life.",
    ],
  },
  makeRoom: {
    id: "make-room",
    heading: LOCKED_PAYOFF,
    body: "Sometimes the useful part isn't only the finished laundry or the prepped dinner. It's the room that help creates — work, time together, rest, something of your own, or simply not doing that task yourself.",
    photo: {
      alt: "Temporary placeholder for a wide brand photograph",
      caption: "Photography placeholder — household help, composition only.",
    },
  },
  area: {
    id: "area",
    heading: "Select communities across the GTA",
    body: `Parentive is preparing a pilot in ${formatPilotCommunityList(PILOT_COMMUNITIES)}.`,
  },
  expect: {
    id: "expect",
    heading: "What you can expect",
    points: [
      "Parentive Helpers are the people who come to your home.",
      "Clear offering boundaries; parent or responsible adult remains home for child-related support.",
      "Parentive coordinates and reviews flexible or parent-present requests.",
      "Respectful in-home support and straightforward communication.",
    ],
  },
  earlyAccess: {
    id: "early-access",
    heading: "Early access is the next step",
    body: "Parentive is preparing a pilot. Early-access sign-up is open. We'll use that list to follow up as the launch communities are ready. Nothing on this page books a visit.",
    alert:
      "Early access sign-up is open. Join from the button below — nothing on this page books a visit.",
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
