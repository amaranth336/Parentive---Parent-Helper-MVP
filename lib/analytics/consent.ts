export const CONSENT_STORAGE_KEY = "parentive-measurement-consent";
export const CONSENT_VERSION = 1;

export type MeasurementConsent = {
  analytics: boolean;
  advertising: boolean;
  version: typeof CONSENT_VERSION;
};

export function parseConsent(raw: string | null): MeasurementConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as {
      analytics?: unknown;
      advertising?: unknown;
      version?: unknown;
    };
    if (parsed.version !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== "boolean") return null;
    if (typeof parsed.advertising !== "boolean") return null;
    return {
      analytics: parsed.analytics,
      advertising: parsed.advertising,
      version: CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

export function serializeConsent(consent: MeasurementConsent): string {
  return JSON.stringify({
    analytics: consent.analytics,
    advertising: consent.advertising,
    version: CONSENT_VERSION,
  });
}

type ConsentStorage = Pick<Storage, "getItem" | "setItem">;

export function readStoredConsent(storage: ConsentStorage | null): MeasurementConsent | null {
  if (!storage) return null;
  try {
    return parseConsent(storage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeStoredConsent(
  storage: ConsentStorage | null,
  consent: MeasurementConsent,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(CONSENT_STORAGE_KEY, serializeConsent(consent));
    return true;
  } catch {
    return false;
  }
}
