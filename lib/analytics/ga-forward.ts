export type GaForwardBudget = {
  pageViews: number;
  leads: number;
};

export function createGaForwardBudget(): GaForwardBudget {
  return { pageViews: 0, leads: 0 };
}

export function gaEventName(item: unknown): string | null {
  if (!item || typeof item !== "object") return null;
  const record = item as { event?: unknown; length?: unknown; 0?: unknown; 1?: unknown };
  if (typeof record.length === "number" && record[0] === "event" && typeof record[1] === "string") {
    return record[1];
  }
  if (typeof record.event === "string" && record[0] === undefined) {
    return record.event;
  }
  return null;
}

/**
 * Setup commands have no event name and are forwarded.
 * The only events that leave the page are the budgeted page view and lead.
 */
export function shouldForwardGaCommand(item: unknown, budget: GaForwardBudget): boolean {
  const name = gaEventName(item);
  if (!name) return true;
  if (name === "page_view") {
    if (budget.pageViews > 0) {
      budget.pageViews -= 1;
      return true;
    }
    return false;
  }
  if (name === "generate_lead") {
    if (budget.leads > 0) {
      budget.leads -= 1;
      return true;
    }
    return false;
  }
  return false;
}
