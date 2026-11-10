const GA_MEASUREMENT_ID = /^G-[A-Z0-9]{6,}$/;
const META_PIXEL_ID = /^\d{8,20}$/;

/** Placeholder and malformed IDs never leave the page. */
export function parseGaMeasurementId(
  value: string | null | undefined,
): string | null {
  const id = value?.trim() ?? "";
  if (!GA_MEASUREMENT_ID.test(id)) return null;
  if (/^G-X+$/.test(id)) return null;
  return id;
}

export function parseMetaPixelId(
  value: string | null | undefined,
): string | null {
  const id = value?.trim() ?? "";
  if (!META_PIXEL_ID.test(id)) return null;
  if (/^0+$/.test(id)) return null;
  return id;
}

export function gaMeasurementId(): string | null {
  return parseGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
}

export function metaPixelId(): string | null {
  return parseMetaPixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID);
}
