import {
  LOCKED_BELIEF,
  LOCKED_DESCRIPTOR,
  LOCKED_H1,
  LOCKED_PAYOFF,
  OFFERING_NAMES,
  PARENT_HOME_REQUIRED,
  flattenHomepageText,
  homepage,
  homepageCtas,
} from "./content";

const REQUIRED_OFFERING_NAMES = [
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

describe("homepage content", () => {
  const allText = flattenHomepageText(homepage);

  it("includes the homepage offering lines exactly", () => {
    const groupedNames = homepage.support.groups.flatMap((group) => [
      ...group.names,
    ]);

    expect(homepage.support.lead).toBe(
      "These are our first offerings. As we grow, we'll keep adding ways to help, and we'll share more as we do.",
    );
    expect(OFFERING_NAMES).toEqual(REQUIRED_OFFERING_NAMES);
    expect(groupedNames).toEqual([...REQUIRED_OFFERING_NAMES]);

    for (const name of REQUIRED_OFFERING_NAMES) {
      expect(allText).toContain(name);
    }
  });

  it("states that a parent or responsible adult stays home", () => {
    expect(PARENT_HOME_REQUIRED).toContain(
      "you or another responsible adult stays home",
    );
    expect(allText).toContain("you or another responsible adult stays home");
    expect(homepage.support.groups.find((group) => group.id === "family-support")?.note).toBe(
      PARENT_HOME_REQUIRED,
    );
  });

  it("does not publish prices or currency", () => {
    expect(allText).not.toMatch(/\$|£|€|CAD\b|USD\b|CDN\b/i);
    expect(allText).not.toMatch(/\b\d+\.\d{2}\b/);
  });

  it("does not use Hive language", () => {
    expect(allText).not.toMatch(/hive/i);
    expect(allText).not.toMatch(/join the hive/i);
  });

  it("uses a live early-access primary CTA and an in-page secondary hash", () => {
    expect(homepageCtas.length).toBeGreaterThan(0);

    for (const cta of homepageCtas) {
      expect(cta.href).not.toContain("/services");
      expect(cta.href).not.toContain("/request");
    }

    expect(homepage.hero.primaryCta.href).toBe("/early-access");
    expect(homepage.hero.primaryCta.label).toBe("Join the early-access list");
    expect(homepage.hero.secondaryCta.href).toBe("#support");
    expect(homepage.hero.secondaryCta.href.startsWith("#")).toBe(true);
  });

  it("includes Uxbridge in area and availability copy", () => {
    expect(homepage.area.body).toContain("Uxbridge");
    expect(
      homepage.faq.items.find((item) => item.question === "Where is Parentive available?")
        ?.answer,
    ).toContain("Uxbridge");
    expect(allText).toContain("Uxbridge");
  });

  it("does not restore /request", () => {
    expect(allText).not.toContain("/request");
    expect(homepageCtas.map((cta) => cta.href).join(" ")).not.toContain("/request");
  });

  it("keeps early-access follow-up language current", () => {
    expect(homepage.howItWorks.steps[1]?.body).toBe(
      "Add your name whenever you're ready. It only takes a minute.",
    );
    expect(homepage.howItWorks.steps[1]?.body).not.toMatch(/list is open/i);
    expect(homepage.howItWorks.steps[2]?.title).toBe(
      "We'll reach out when we're ready to help near you",
    );
    expect(homepage.howItWorks.steps[2]?.body).toBe(
      "As services open up in the launch communities, we'll let you know. No chasing needed.",
    );
    expect(homepage.hero.primaryCta.href).toBe("/early-access");
    expect(homepage.metadata.description).not.toMatch(/being prepared/i);
    expect(homepage.hero.launchLine).toMatch(/join the early-access list now/i);
    expect(homepage.hero.launchLine).not.toMatch(/preparing early access/i);
  });

  it("preserves locked brand lines verbatim", () => {
    expect(homepage.hero.heading).toBe(LOCKED_H1);
    expect(homepage.hero.kicker).toBe(LOCKED_DESCRIPTOR);
    expect(homepage.why.belief).toBe(LOCKED_BELIEF);
    expect(homepage.makeRoom.heading).toBe(LOCKED_PAYOFF);
    expect(allText.split(LOCKED_BELIEF).length - 1).toBe(1);
  });

  it("numbers how-it-works steps for section treatment", () => {
    expect(homepage.howItWorks.steps.map((step) => step.number)).toEqual([
      "01",
      "02",
      "03",
    ]);
  });

  it("keeps FAQ content available for the /faq route", () => {
    expect(homepage.faq.heading).toBe("Frequently asked questions");
    expect(homepage.faq.items.map((item) => item.question)).toEqual([
      "Where is Parentive available?",
      "Who are Parentive Helpers, and how are they screened?",
      "What can a Parentive Helper actually help with?",
      "Is Parentive a cleaning service or childcare service?",
      "What do I need to provide for a visit?",
      "What happens if I need something that isn't listed?",
      "How does pricing work?",
    ]);
    expect(homepage.faq.items.map((item) => item.question).join("\n")).not.toMatch(
      /regularly|more than once/i,
    );
    expect(homepage.faq.contactLead).toBe("Still wondering about something?");
    expect(homepage.faq.contactLinkLabel).toBe("We'd love to hear from you.");
    expect(homepage.faq.contactHref).toBe("/contact");
    expect(
      homepage.faq.items.find((item) => item.question === "How does pricing work?")
        ?.answer,
    ).not.toMatch(/\$|£|€|\b\d+\b/);
  });

  it("states what households can expect from Parentive Helpers", () => {
    expect(homepage.expect.heading).toBe(
      "Let us lighten your load. Here's what you can expect from every Helper:",
    );
    expect(homepage.expect.points).toEqual([
      "People you can trust in your home. Every Helper is carefully screened, with references and a Vulnerable Sector Check, before they ever step into a family's home.",
      "Capable and dependable. Helpers are chosen for their reliability, good judgement and eye for detail. They're meticulous, they follow through on what was agreed, and they don't need to be managed by you.",
      "Your home, your way. Helpers work thoughtfully around your routines, follow your preferences, and simply check in if they're unsure about something.",
      "Warm with little ones. For visits that include children, Helpers are screened for their ability to connect warmly and appropriately, being genuinely present rather than just keeping watch.",
      "Trained, and clear on the plan. Every Helper goes through Parentive onboarding, covering service quality, household boundaries, privacy, communication and more, before their first visit. You'll always know what to expect, and so will they. You're never starting from scratch.",
    ]);
    expect(homepage.expect.closing).toBe(
      "You're not just getting another pair of hands. You're getting support you'll feel comfortable to welcome into your home.",
    );
  });
});
