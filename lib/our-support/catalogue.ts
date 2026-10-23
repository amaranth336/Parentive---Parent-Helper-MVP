/**
 * Canonical pilot catalogue.
 * Rendering, selection and server pricing all read this module.
 * Prices are CAD cents before tax. Null means a quote is required, never free.
 */

export const SERVICE_IDS = [
  "S01",
  "S15",
  "S02",
  "S08",
  "S12",
  "S07",
  "S14",
  "S17",
  "S13",
  "S03",
  "S04",
  "S09",
  "S16",
  "S05",
  "S06",
  "S10",
  "S18",
  "S19",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

export const CATEGORY_IDS = [
  "home-laundry",
  "kitchen-food",
  "family-support",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type ServiceIconName =
  | "laundry-basket-light"
  | "family-room-light"
  | "baby-gear-light"
  | "house-plant-light"
  | "kitchen-light"
  | "made-bed-light"
  | "playroom-toys-light"
  | "light-organizing-light"
  | "dinner-prep-light"
  | "coffee-moment-light"
  | "flex-helping-hand-light";

export type CatalogueService = {
  id: ServiceId;
  name: string;
  tagline: string;
  priceCents: number | null;
  copy: string;
  visibleNote?: string;
  note?: string;
  icon: ServiceIconName;
};

export type CatalogueCategory = {
  id: CategoryId;
  name: string;
  tag: string;
  intro: string;
  imageAlt: string;
  items: readonly CatalogueService[];
};

export const ONE_TIME_MINIMUM_CENTS = 8000;
export const RECURRING_MINIMUM_CENTS = 6000;
export const RECURRING_VISIT_COMMITMENT = 3;
export const WASHING_SERVICE_IDS = ["S01", "S15"] as const satisfies readonly ServiceId[];
export const FLEXIBLE_SERVICE_ID = "S19" satisfies ServiceId;
/** Internal planning allowance only. Do not show this as hands-on time. */
export const WASHING_ELAPSED_PLANNING_MINUTES = 135;

export const OUR_SUPPORT_PATH = "/our-support";

export const catalogue: readonly CatalogueCategory[] = [
  {
    id: "home-laundry",
    name: "Home and laundry",
    tag: "A home that feels a little more handled.",
    intro:
      "The baskets, bedrooms and everyday spaces that keep asking for your attention. Choose a few jobs and let your Helper take them from here.",
    imageAlt: "Person holding a woven basket filled with folded laundry",
    items: [
      {
        id: "S01",
        name: "Laundry Reset",
        tagline: "Tackle Laundry Mountain",
        priceCents: 5000,
        copy: "One load washed, dried, folded and put away, plus up to one already-clean load folded and returned to its place. Your laundry machines, sink and folding surfaces get a wipe-down too.",
        visibleNote: "Book alongside other services to allow for wash and dry cycles.",
        note: "Book alongside other services so your Helper can work while the machines run. Allow for wash and dry cycles; we’ll confirm the combined visit length. Standard household loads; cloth diapers excluded.",
        icon: "laundry-basket-light",
      },
      {
        id: "S15",
        name: "Wash, Fold & Put Away Laundry",
        tagline: "A Load Off Your List",
        priceCents: 5000,
        copy: "One load washed, dried, folded and put away, plus up to two additional loads you’ve already washed folded and put away. A little less laundry waiting for you.",
        visibleNote: "Book alongside other services to allow for wash and dry cycles.",
        note: "Book alongside other services to allow for wash and dry cycles. We’ll confirm the combined visit length. Standard household loads; cloth diapers excluded.",
        icon: "laundry-basket-light",
      },
      {
        id: "S02",
        name: "Fold & Put Away Laundry",
        tagline: "Reclaim the Chair",
        priceCents: 1500,
        copy: "One standard load of clean laundry folded and put away. The basket is empty, the clothes are where they belong, and the chair can be a chair again.",
        note: "One standard household load. Cloth diapers excluded.",
        icon: "laundry-basket-light",
      },
      {
        id: "S08",
        name: "Bedroom Reset",
        tagline: "Turn Down the To-Dos",
        priceCents: 3000,
        copy: "One bed changed and made with the clean linens you provide. Surfaces wiped, light fixtures dusted, accessible spaces beneath furniture vacuumed, and the room lightly tidied. A calmer place to come back to.",
        note: "Clean replacement linens supplied by you. For bedding washing and drying during the pilot, submit a Flexible Support Request so we can arrange it alongside other services.",
        icon: "made-bed-light",
      },
      {
        id: "S12",
        name: "Family Room Reset",
        tagline: "Living Room, Ready for Living",
        priceCents: 1200,
        copy: "The day’s clutter tidied, surfaces wiped or dusted, and seating and accessible spaces beneath furniture vacuumed. Your shared space, ready to settle into again.",
        icon: "family-room-light",
      },
      {
        id: "S07",
        name: "Toy Reset",
        tagline: "Toynado Recovery",
        priceCents: 2000,
        copy: "Toys tidied and lightly organised, frequently touched surfaces cleaned, and selected toys washed or sanitised as appropriate. Where it suits your setup, your Helper can rotate toys too. Ready for the next round of play.",
        icon: "playroom-toys-light",
      },
      {
        id: "S14",
        name: "Baby Gear Reset",
        tagline: "Tiny Gear, All Clear",
        priceCents: 2000,
        copy: "Bottles, pump parts, pacifiers, teething toys and baby feeding utensils washed and sanitised for one baby, then placed in your designated drying or storage area. The little essentials, ready again.",
        note: "Provide the relevant cleaning brushes, any sterilising equipment and a sanitary drying/storage area. For more than one child, send a Flexible Support Request so we can confirm the combined details and price.",
        icon: "baby-gear-light",
      },
      {
        id: "S17",
        name: "Organization/Declutter",
        tagline: "Less Searching. More Finding.",
        priceCents: 3000,
        copy: "One agreed pantry, bedroom closet, linen closet or entry closet reorganised, so everyday essentials are easier to find and put away. A little order where it will help most.",
        note: "One agreed interior space. Garages, storage rooms and outdoor spaces are excluded.",
        icon: "light-organizing-light",
      },
      {
        id: "S13",
        name: "Water House Plants",
        tagline: "End the droopy leaf dramatics",
        priceCents: 1200,
        copy: "Your indoor plants lightly watered, with pots rotated where appropriate. One small recurring job you can stop trying to remember.",
        note: "Basic watering and pot rotation. For specialist plant-care needs, submit a Flexible Support Request.",
        icon: "house-plant-light",
      },
    ],
  },
  {
    id: "kitchen-food",
    name: "Kitchen and Food",
    tag: "Less kitchen catch-up. More room to enjoy it.",
    intro:
      "From the dishes that never end to the meals that need to be prepped. Get your kitchen counters back, or give the next few days a head start.",
    imageAlt: "Person slicing cucumber while preparing vegetables at a kitchen counter",
    items: [
      {
        id: "S03",
        name: "Kitchen Retouch",
        tagline: "Counters, Reclaimed",
        priceCents: 2000,
        copy: "Dishes washed, counters wiped, and the faucet and appliance fronts cleaned. An everyday kitchen refresh that helps the room feel manageable again.",
        icon: "kitchen-light",
      },
      {
        id: "S04",
        name: "Dishwasher Reset",
        tagline: "Dishes, Dismissed",
        priceCents: 1200,
        copy: "Clean dishes put away, the dishwasher interior and filter cleaned, and supplied rinse aid topped up. Your Helper then loads and runs a wash, or starts an agreed empty cleaning cycle.",
        note: "Choose a loaded wash or an empty cleaning cycle. You provide the dishwasher products and rinse aid.",
        icon: "kitchen-light",
      },
      {
        id: "S09",
        name: "Fridge Reset",
        tagline: "No more ‘Is this still good?’",
        priceCents: 3000,
        copy: "Old leftovers and expired condiments cleared out, fridge surfaces and crisper drawers cleaned, and food returned to its place. A fridge that’s easier to open and use.",
        note: "Freezer excluded. Shelves and drawers stay in place unless you explicitly request removal; freezer support can be reviewed through a Flexible Support Request.",
        icon: "kitchen-light",
      },
      {
        id: "S16",
        name: "Kitchen Reset",
        tagline: "The Kitchen Comeback",
        priceCents: 8000,
        copy: "Dishes handled, dishwasher refreshed, counters, stovetop and appliance fronts wiped, microwave and sink cleaned, and the fridge cleared out and cleaned. A thorough reset for the room that works hardest.",
        note: "Pantry reorganisation, freezer cleaning and oven-interior cleaning are separate requests. Stain and hard-water-mark removal is not guaranteed.",
        icon: "kitchen-light",
      },
      {
        id: "S05",
        name: "Dinner Prep",
        tagline: "Dinner, Delegated",
        priceCents: 4000,
        copy: "One simple meal prepared using your ingredients and supplied recipe or clear instructions. Your Helper handles the chopping, cooking and used dishes, so dinner is one less job on your list.",
        note: "One straightforward, single-course meal within everyday home-cooking skills. You provide ingredients, cookware and your recipe or instructions.",
        icon: "dinner-prep-light",
      },
      {
        id: "S06",
        name: "Lunchbox Prep",
        tagline: "A Little Less Morning Scramble",
        priceCents: 3000,
        copy: "Fruit, vegetables, snacks and simple lunches prepared for the next two days, for up to three children. A head start on the part of the morning that always seems to arrive too quickly.",
        note: "Up to two days of lunches for up to three children. Further days can be prepared on a subsequent visit for freshness.",
        icon: "dinner-prep-light",
      },
      {
        id: "S10",
        name: "Meal Prep Batch",
        tagline: "A Head Start, Ready in the Fridge",
        priceCents: 6000,
        copy: "Up to three days of fruit and vegetable prep for breakfasts and dinners, plus one standard batch recipe you choose—such as muffins, soup or baby purées. A few useful things already done.",
        note: "You provide ingredients, storage containers and the chosen recipe or instructions.",
        icon: "dinner-prep-light",
      },
    ],
  },
  {
    id: "family-support",
    name: "Family support",
    tag: "A little space for you, knowing your little ones are happily engaged nearby.",
    intro:
      "A caring presence with the children while you’re home, or a thoughtful plan for the task that doesn’t quite fit a box.",
    imageAlt:
      "Parents at home with their children: one adult helps with homework at the table while another prepares food in the kitchen",
    items: [
      {
        id: "S18",
        name: "Uninterrupted Hour",
        tagline: "An Hour to Hear Yourself Think",
        priceCents: 4000,
        copy: "An hour to work, rest or finish something of your own while your children have someone present and engaged. Your Helper can play, read, help with homework or serve food you’ve already prepared.",
        visibleNote:
          "You or another responsible adult stays home on the property and available if needed.",
        note: "Tell us children’s ages, allergies and support needs when booking. More than one baby under 12 months or more than two older children may require different Helper matching and an adjusted price. No sick-child care, medical care or administering medication/supplements.",
        icon: "coffee-moment-light",
      },
      {
        id: "S19",
        name: "Flexible Support Request",
        tagline: "That Other Thing on Your List",
        priceCents: null,
        copy: "Something else would make the biggest difference? Tell us what needs doing. We’ll review your request, confirm how a Helper can help, and agree on the details and price before your visit.",
        note: "Requests are reviewed individually. No offsite childcare, medical care, errands or child transport. A responsible adult must remain home for child engagement.",
        icon: "flex-helping-hand-light",
      },
    ],
  },
];

const servicesById = new Map<ServiceId, CatalogueService>(
  catalogue.flatMap((category) => category.items.map((item) => [item.id, item])),
);

export function isServiceId(value: string): value is ServiceId {
  return servicesById.has(value as ServiceId);
}

export function getCatalogueService(id: ServiceId): CatalogueService {
  const service = servicesById.get(id);
  if (!service) {
    throw new Error(`Unknown catalogue service ${id}`);
  }
  return service;
}

export function listCatalogueServices(): readonly CatalogueService[] {
  return catalogue.flatMap((category) => category.items);
}

export function formatServiceDollars(cents: number): string {
  return `$${cents / 100}`;
}
