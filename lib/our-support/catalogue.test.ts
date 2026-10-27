import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  FLEXIBLE_SERVICE_ID,
  SERVICE_IDS,
  catalogue,
  listCatalogueServices,
} from "@/lib/our-support/catalogue";
import {
  HERO_DECK,
  PORTAL_HEADING,
  REQUEST_NOTICE,
  REQUEST_TITLE,
  VISIT_HEADING,
} from "@/lib/our-support/copy";

describe("pilot catalogue", () => {
  const services = listCatalogueServices();
  const publicText = services
    .map((service) =>
      [service.name, service.tagline, service.copy, service.visibleNote, service.note]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  it("keeps the 18 approved services and the plant tagline", () => {
    expect(services.map((service) => service.id)).toEqual([...SERVICE_IDS]);
    expect(services.find((service) => service.id === "S13")?.tagline).toBe(
      "End the droopy leaf dramatics",
    );
    expect(services.find((service) => service.id === FLEXIBLE_SERVICE_ID)?.priceCents).toBeNull();
    expect(publicText).not.toMatch(/Garden Reset|Quoted individually|\bscope\b|\$0/);
    expect(publicText).not.toMatch(/\b135\b/);
  });

  it("prices fixed services in cents and never treats a quote as free", () => {
    expect(services.find((service) => service.id === "S01")?.priceCents).toBe(5000);
    expect(services.find((service) => service.id === "S16")?.priceCents).toBe(8000);
    expect(services.find((service) => service.id === "S02")?.priceCents).toBe(1500);
    expect(catalogue.map((category) => category.name)).toEqual([
      "Home and Laundry",
      "Kitchen and Food",
      "Family Support",
    ]);
  });

  it("uses the helping hand and keeps unused icon masters in the project", () => {
    expect(services.find((service) => service.id === "S19")?.icon).toBe(
      "flex-helping-hand-light",
    );
    expect(
      services
        .filter((service) => ["S01", "S15", "S02"].includes(service.id))
        .every((service) => service.icon === "laundry-basket-light"),
    ).toBe(true);
    for (const file of [
      "flex-helping-hand-light.svg",
      "flex-handshake-light.svg",
      "flex-list-light.svg",
      "quiet-bath-light.svg",
      "baby-gear-light.svg",
      "house-plant-light.svg",
    ]) {
      expect(
        existsSync(join(process.cwd(), "public/images/our-support/icons", file)),
      ).toBe(true);
    }
  });
});

describe("our support page contract", () => {
  const page = readFileSync(join(process.cwd(), "app/our-support/page.tsx"), "utf8");
  const experience = readFileSync(
    join(process.cwd(), "components/our-support-experience.tsx"),
    "utf8",
  );
  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  const migration = readFileSync(
    join(
      process.cwd(),
      "supabase/migrations/20261023120000_create_pilot_visit_requests.sql",
    ),
    "utf8",
  );

  it("publishes the approved headings and a real request endpoint", () => {
    expect(page).toContain("export const metadata: Metadata");
    expect(page).not.toMatch(/["']use client["']/);
    expect(HERO_DECK).toBe(
      "Laundry put away. Dinner prepared. A room that feels settled again.",
    );
    expect(experience).toContain('href={`#${category.id}`}');
    expect(experience).toContain("support-category-links");
    expect(experience).not.toContain("What can we take off your plate?");
    expect(experience).not.toContain("How a visit comes together");
    expect(VISIT_HEADING).toBe("Your Helper visit");
    expect(REQUEST_TITLE).toBe("What are we helping with?");
    expect(PORTAL_HEADING).toBe("Simpler booking is on its way.");
    expect(REQUEST_NOTICE).toBe(
      "This is a request, not a confirmed booking. We’ll review the request and respond by email within 24 hours. No payment is collected on this website at this time.",
    );
    expect(experience).toContain('type="checkbox"');
    expect(experience).toContain('fetch("/api/our-support"');
    expect(experience).not.toContain("Quoted individually");
    expect(experience).not.toContain("Garden Reset");
    expect(experience).not.toMatch(/lib\/supabase\/admin|RESEND_API_KEY|service_role/);
  });

  it("keeps two columns from 701px and stacks below that", () => {
    expect(css).toMatch(/@media \(min-width: 701px\)/);
    expect(css).toMatch(/grid-template-rows:\s*subgrid/);
    expect(css).toMatch(/grid-row:\s*span 6/);
    expect(css).toMatch(/aspect-ratio:\s*4\s*\/\s*5/);
    expect(experience).toContain(
      "aspectRatio: `${CATEGORY_IMAGES[category.id].width} / ${CATEGORY_IMAGES[category.id].height}`",
    );
    expect(css).toContain("#24362D");
    expect(css).toContain("white-space: nowrap");
  });

  it("keeps pilot visit requests server-only and out of marketing", () => {
    expect(migration).toContain("ENABLE ROW LEVEL SECURITY");
    expect(migration).toContain(
      "REVOKE ALL ON TABLE public.pilot_visit_requests FROM anon",
    );
    expect(migration).toContain(
      "REVOKE ALL ON TABLE public.pilot_visit_requests FROM authenticated",
    );
    expect(migration).toContain(
      "GRANT ALL ON TABLE public.pilot_visit_requests TO service_role",
    );
    expect(migration).toContain("marketing_consent = false");
    expect(migration).not.toContain("support_requests");
  });
});
