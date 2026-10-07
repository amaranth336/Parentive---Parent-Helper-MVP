export type HeaderConcealInput = {
  footerTop: number;
  viewportHeight: number;
  headerHeight: number;
  scrollY: number;
};

/**
 * Header stays fully visible until the footer is about to enter.
 * It finishes fading upward just before the footer becomes visible,
 * so the two bands are not on screen together.
 * At scrollY 0 the header stays visible even on short pages.
 */
export function headerConcealProgress({
  footerTop,
  viewportHeight,
  headerHeight,
  scrollY,
}: HeaderConcealInput): number {
  if (scrollY <= 0) {
    return 0;
  }

  const range = Math.max(headerHeight, 1);
  const lead = 2;
  const distanceUntilFooter = footerTop - viewportHeight;
  const progress = 1 - (distanceUntilFooter - lead) / range;

  return Math.min(1, Math.max(0, progress));
}
