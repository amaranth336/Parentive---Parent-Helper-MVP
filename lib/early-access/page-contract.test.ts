import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function pngSize(relativePath: string): { width: number; height: number } {
  const buffer = readFileSync(join(process.cwd(), relativePath));
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

describe("early-access page contract", () => {
  const pageSource = read("app/early-access/page.tsx");
  const contentSource = read("components/early-access-page-content.tsx");

  it("exports metadata from the server page", () => {
    expect(pageSource).toContain("export const metadata: Metadata");
    expect(pageSource).toContain("Early access — Parentive");
    expect(pageSource).toContain("EARLY_ACCESS_SUPPORTING");
    expect(pageSource).not.toMatch(/["']use client["']/);
  });

  it("keeps submission state in a client component", () => {
    expect(contentSource).toMatch(/^"use client";/);
    expect(contentSource).toContain("POST_SUBMIT_HEADING");
    expect(contentSource).toContain("early-access-hero-woman-coffee.png");
    expect(contentSource).toContain("heroPhoto.width");
    expect(contentSource).toContain("heroPhoto.height");
  });

  it("uses the approved 1448 by 1086 hero photograph", () => {
    expect(
      pngSize("public/images/early-access/early-access-hero-woman-coffee.png"),
    ).toEqual({ width: 1448, height: 1086 });
  });
});
