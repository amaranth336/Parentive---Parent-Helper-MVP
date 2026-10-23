import {
  FLEXIBLE_SERVICE_ID,
  ONE_TIME_MINIMUM_CENTS,
  RECURRING_MINIMUM_CENTS,
  WASHING_SERVICE_IDS,
  formatServiceDollars,
  getCatalogueService,
  type ServiceId,
} from "@/lib/our-support/catalogue";

export type VisitType = "one-time" | "recurring";

export type ServiceLine = {
  id: ServiceId;
  name: string;
  priceCents: number | null;
};

export type SelectionSummary = {
  lines: ServiceLine[];
  count: number;
  subtotalCents: number;
  quoteRequired: boolean;
  minimumCents: number;
  washingOnly: boolean;
  fixedBelowMinimum: boolean;
  shortcutVisible: boolean;
};

const washingIds = new Set<string>(WASHING_SERVICE_IDS);

export function minimumCentsFor(visitType: VisitType): number {
  return visitType === "recurring"
    ? RECURRING_MINIMUM_CENTS
    : ONE_TIME_MINIMUM_CENTS;
}

export function toggleService(
  selected: readonly ServiceId[],
  id: ServiceId,
): ServiceId[] {
  if (selected.includes(id)) {
    return selected.filter((item) => item !== id);
  }
  return [...selected, id];
}

export function removeService(
  selected: readonly ServiceId[],
  id: ServiceId,
): ServiceId[] {
  return selected.filter((item) => item !== id);
}

export function summarizeSelection(
  selected: readonly ServiceId[],
  visitType: VisitType,
): SelectionSummary {
  const lines = selected.map((id) => {
    const service = getCatalogueService(id);
    return {
      id,
      name: service.name,
      priceCents: service.priceCents,
    };
  });
  const subtotalCents = lines.reduce(
    (sum, line) => sum + (line.priceCents ?? 0),
    0,
  );
  const quoteRequired = lines.some((line) => line.priceCents === null);
  const washingOnly =
    lines.length > 0 && lines.every((line) => washingIds.has(line.id));
  const minimumCents = minimumCentsFor(visitType);

  return {
    lines,
    count: lines.length,
    subtotalCents,
    quoteRequired,
    minimumCents,
    washingOnly,
    fixedBelowMinimum: subtotalCents < minimumCents,
    shortcutVisible: lines.length > 0,
  };
}

export function shortcutLabel(summary: SelectionSummary): string {
  const countLabel = `${summary.count} ${summary.count === 1 ? "service" : "services"}`;
  if (summary.quoteRequired && summary.subtotalCents === 0) {
    return `${countLabel} · Quoted separately`;
  }
  if (summary.quoteRequired) {
    return `${countLabel} · ${formatServiceDollars(summary.subtotalCents)} subtotal, plus a separate quote`;
  }
  return `${countLabel} · ${formatServiceDollars(summary.subtotalCents)} subtotal`;
}

export function selectionIncludesFlexible(selected: readonly ServiceId[]): boolean {
  return selected.includes(FLEXIBLE_SERVICE_ID);
}
