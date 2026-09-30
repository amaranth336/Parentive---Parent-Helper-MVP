import { validateHelperDocument } from "./document";

describe("helpers document validation", () => {
  const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]);
  const zipPrefix = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);

  function docxLikeBytes(): Uint8Array {
    const marker = Buffer.from("word/document.xml", "utf8");
    const combined = new Uint8Array(zipPrefix.length + marker.length + 8);
    combined.set(zipPrefix, 0);
    combined.set(marker, zipPrefix.length);
    return combined;
  }

  it("accepts a valid PDF", () => {
    const result = validateHelperDocument({
      filename: "experience.pdf",
      contentType: "application/pdf",
      byteSize: pdfBytes.byteLength,
      bytes: pdfBytes,
    });

    expect(result).toEqual({
      ok: true,
      filename: "experience.pdf",
      contentType: "application/pdf",
      byteSize: pdfBytes.byteLength,
      extension: "pdf",
    });
  });

  it("accepts a DOCX that looks like a ZIP containing word/document.xml", () => {
    const bytes = docxLikeBytes();
    const result = validateHelperDocument({
      filename: "notes.docx",
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      byteSize: bytes.byteLength,
      bytes,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.extension).toBe("docx");
    }
  });

  it("rejects empty files, oversized files, and wrong types", () => {
    expect(
      validateHelperDocument({
        filename: "empty.pdf",
        contentType: "application/pdf",
        byteSize: 0,
        bytes: new Uint8Array(),
      }).ok,
    ).toBe(false);

    expect(
      validateHelperDocument({
        filename: "big.pdf",
        contentType: "application/pdf",
        byteSize: 5_242_881,
        bytes: pdfBytes,
      }).ok,
    ).toBe(false);

    expect(
      validateHelperDocument({
        filename: "photo.png",
        contentType: "image/png",
        byteSize: 12,
        bytes: pdfBytes,
      }).ok,
    ).toBe(false);
  });

  it("rejects double extensions and executables", () => {
    expect(
      validateHelperDocument({
        filename: "resume.pdf.exe",
        contentType: "application/pdf",
        byteSize: pdfBytes.byteLength,
        bytes: pdfBytes,
      }).ok,
    ).toBe(false);

    expect(
      validateHelperDocument({
        filename: "script.js",
        contentType: "application/pdf",
        byteSize: pdfBytes.byteLength,
        bytes: pdfBytes,
      }).ok,
    ).toBe(false);
  });

  it("rejects mismatched magic bytes", () => {
    expect(
      validateHelperDocument({
        filename: "fake.pdf",
        contentType: "application/pdf",
        byteSize: 4,
        bytes: new Uint8Array([0x00, 0x01, 0x02, 0x03]),
      }).ok,
    ).toBe(false);

    expect(
      validateHelperDocument({
        filename: "fake.docx",
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        byteSize: 4,
        bytes: zipPrefix,
      }).ok,
    ).toBe(false);
  });
});
