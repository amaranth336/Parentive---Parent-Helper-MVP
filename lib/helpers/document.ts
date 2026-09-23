import { MAX_DOCUMENT_BYTES } from "./copy";

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export type AllowedDocumentMimeType =
  (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number];

export type DocumentValidationSuccess = {
  ok: true;
  filename: string;
  contentType: AllowedDocumentMimeType;
  byteSize: number;
  extension: "pdf" | "docx";
};

export type DocumentValidationFailure = {
  ok: false;
  error: string;
};

export type DocumentValidationResult =
  | DocumentValidationSuccess
  | DocumentValidationFailure;

const PDF_MIME = "application/pdf";
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const EXECUTABLE_EXTENSIONS = new Set([
  "exe",
  "bat",
  "cmd",
  "com",
  "msi",
  "scr",
  "js",
  "mjs",
  "cjs",
  "vbs",
  "ps1",
  "sh",
  "dll",
  "jar",
]);

export const DOCUMENT_ERROR_MESSAGES = {
  required: "Attach a PDF or DOCX experience document.",
  empty: "The uploaded document is empty.",
  tooLarge: "Documents must be 5 MB or smaller.",
  type: "Upload a PDF or DOCX document only.",
  filename: "Use a simple PDF or DOCX filename without extra extensions.",
  content: "The uploaded file does not look like a valid PDF or DOCX document.",
} as const;

function basename(filename: string): string {
  return filename.replace(/^.*[\\/]/, "").trim();
}

function extensionParts(filename: string): string[] {
  const base = basename(filename);
  const parts = base.split(".");
  if (parts.length < 2) {
    return [];
  }
  return parts.slice(1).map((part) => part.toLowerCase());
}

function looksLikePdf(bytes: Uint8Array): boolean {
  if (bytes.length < 5) {
    return false;
  }
  return (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  );
}

function looksLikeZip(bytes: Uint8Array): boolean {
  if (bytes.length < 4) {
    return false;
  }
  return bytes[0] === 0x50 && bytes[1] === 0x4b;
}

function zipContainsWordDocument(bytes: Uint8Array): boolean {
  // DOCX is a ZIP. Local file headers start with PK\x03\x04 and include
  // the filename. Searching for word/document.xml is practical without
  // adding a ZIP dependency.
  const haystack = Buffer.from(bytes).toString("binary");
  return (
    haystack.includes("word/document.xml") ||
    haystack.includes("word\\document.xml")
  );
}

export function validateHelperDocument(input: {
  filename?: string | null;
  contentType?: string | null;
  byteSize?: number | null;
  bytes?: Uint8Array | null;
}): DocumentValidationResult {
  const filename = basename(input.filename ?? "");
  if (!filename) {
    return { ok: false, error: DOCUMENT_ERROR_MESSAGES.required };
  }

  const parts = extensionParts(filename);
  if (parts.length !== 1) {
    return { ok: false, error: DOCUMENT_ERROR_MESSAGES.filename };
  }

  const extension = parts[0];
  if (EXECUTABLE_EXTENSIONS.has(extension)) {
    return { ok: false, error: DOCUMENT_ERROR_MESSAGES.type };
  }

  if (extension !== "pdf" && extension !== "docx") {
    return { ok: false, error: DOCUMENT_ERROR_MESSAGES.type };
  }

  const byteSize = input.byteSize ?? input.bytes?.byteLength ?? 0;
  if (!Number.isFinite(byteSize) || byteSize <= 0) {
    return { ok: false, error: DOCUMENT_ERROR_MESSAGES.empty };
  }

  if (byteSize > MAX_DOCUMENT_BYTES) {
    return { ok: false, error: DOCUMENT_ERROR_MESSAGES.tooLarge };
  }

  const contentType = (input.contentType ?? "").trim().toLowerCase();
  const expectedMime = extension === "pdf" ? PDF_MIME : DOCX_MIME;
  if (contentType !== expectedMime) {
    return { ok: false, error: DOCUMENT_ERROR_MESSAGES.type };
  }

  if (input.bytes) {
    if (extension === "pdf") {
      if (!looksLikePdf(input.bytes)) {
        return { ok: false, error: DOCUMENT_ERROR_MESSAGES.content };
      }
    } else if (
      !looksLikeZip(input.bytes) ||
      !zipContainsWordDocument(input.bytes)
    ) {
      return { ok: false, error: DOCUMENT_ERROR_MESSAGES.content };
    }
  }

  return {
    ok: true,
    filename,
    contentType: expectedMime,
    byteSize,
    extension,
  };
}
