import { headerConcealProgress } from "./site-header-scroll";

describe("headerConcealProgress", () => {
  const headerHeight = 100;
  const viewportHeight = 800;

  it("keeps the header visible before the page has scrolled", () => {
    expect(
      headerConcealProgress({
        footerTop: 400,
        viewportHeight,
        headerHeight,
        scrollY: 0,
      }),
    ).toBe(0);
  });

  it("keeps the header visible while the footer is still below the fade range", () => {
    expect(
      headerConcealProgress({
        footerTop: 1000,
        viewportHeight,
        headerHeight,
        scrollY: 240,
      }),
    ).toBe(0);
  });

  it("fades the header across its own height as the footer approaches", () => {
    expect(
      headerConcealProgress({
        footerTop: 852,
        viewportHeight,
        headerHeight,
        scrollY: 240,
      }),
    ).toBeCloseTo(0.5);
  });

  it("hides the header just before the footer enters the viewport", () => {
    expect(
      headerConcealProgress({
        footerTop: viewportHeight,
        viewportHeight,
        headerHeight,
        scrollY: 240,
      }),
    ).toBe(1);

    expect(
      headerConcealProgress({
        footerTop: viewportHeight - 40,
        viewportHeight,
        headerHeight,
        scrollY: 240,
      }),
    ).toBe(1);
  });
});
