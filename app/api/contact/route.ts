import { NextResponse } from "next/server";
import {
  CONTACT_ERRORS,
  MAX_CONTACT_REQUEST_BYTES,
} from "@/lib/contact/copy";
import { contactRateLimiter, handleContactSubmission } from "@/lib/contact/handler";
import { resolveClientIp } from "@/lib/helpers/client-ip";
import {
  HelpersBodyTooLargeError,
  readHelpersBodyWithLimit,
} from "@/lib/helpers/request-body";

function parseJsonObject(
  bytes: Uint8Array,
): { ok: true; value: Record<string, unknown> } | { ok: false } {
  try {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    if (!text.trim()) {
      return { ok: false };
    }

    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false };
    }

    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return { ok: false };
  }
}

export async function POST(request: Request) {
  const ip = resolveClientIp(request);

  if (contactRateLimiter.isLimited(ip || "unknown")) {
    return NextResponse.json(
      { ok: false, error: CONTACT_ERRORS.rateLimit },
      { status: 429 },
    );
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_CONTACT_REQUEST_BYTES
    ) {
      return NextResponse.json(
        { ok: false, error: CONTACT_ERRORS.payloadTooLarge },
        { status: 413 },
      );
    }
  }

  let bodyBytes: Uint8Array;
  try {
    bodyBytes = await readHelpersBodyWithLimit(
      request,
      MAX_CONTACT_REQUEST_BYTES,
    );
  } catch (error) {
    if (error instanceof HelpersBodyTooLargeError) {
      return NextResponse.json(
        { ok: false, error: CONTACT_ERRORS.payloadTooLarge },
        { status: 413 },
      );
    }

    return NextResponse.json(
      { ok: false, error: CONTACT_ERRORS.validation },
      { status: 400 },
    );
  }

  const parsed = parseJsonObject(bodyBytes);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: CONTACT_ERRORS.validation },
      { status: 400 },
    );
  }

  const result = await handleContactSubmission(parsed.value, { ip });
  return NextResponse.json(result.body, { status: result.status });
}
